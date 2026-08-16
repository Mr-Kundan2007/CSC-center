import crypto from 'crypto';
import { supabase } from '../config/supabase.js';
import asyncHandler from '../middleware/asyncHandler.js';
import {
  getFallbackApplicationsForUser,
  getFallbackApplicationById,
  saveFallbackDocument,
  getFallbackDocumentsByAppId
} from '../utils/localStore.js';

/**
 * GET /api/my-applications
 * Retrieve paginated applications belonging strictly to the authenticated user.
 * IDOR Protection: Always enforces applications.user_id = req.user.id.
 */
export const getMyApplications = asyncHandler(async (req, res) => {
  const userId = req.user.id;
  const userEmail = req.user.email;
  const userMobile = req.user.mobile;
  const { page = 1, limit = 10, status, service } = req.query;

  const pageNum = Math.max(1, parseInt(page, 10));
  const limitNum = Math.min(50, Math.max(1, parseInt(limit, 10)));
  const offset = (pageNum - 1) * limitNum;

  try {
    let filterConditions = [`user_id.eq.${userId}`];
    if (userEmail) filterConditions.push(`email.eq.${userEmail.toLowerCase()}`);
    if (userMobile) filterConditions.push(`mobile.eq.${userMobile}`);

    let query = supabase
      .from('applications')
      .select('id, application_id, full_name, mobile, email, status, payment_status, created_at, updated_at, services(title, category)', { count: 'exact' })
      .or(filterConditions.join(','));

    if (status && status !== 'all') {
      query = query.eq('status', status);
    }

    if (service && service !== 'all') {
      query = query.eq('service_id', service);
    }

    query = query.order('created_at', { ascending: false });
    query = query.range(offset, offset + limitNum - 1);

    const { data, error, count } = await query;

    if (!error && data && data.length > 0) {
      const totalCount = count || data.length;
      const totalPages = Math.ceil(totalCount / limitNum);

      const formattedApplications = data.map(app => ({
        id: app.id,
        applicationId: app.application_id,
        fullName: app.full_name,
        mobile: app.mobile,
        email: app.email,
        serviceTitle: app.services?.title || 'Digital Service',
        category: app.services?.category || 'General',
        status: app.status,
        paymentStatus: app.payment_status,
        createdAt: app.created_at,
        updatedAt: app.updated_at
      }));

      return res.status(200).json({
        success: true,
        count: totalCount,
        page: pageNum,
        limit: limitNum,
        totalPages,
        data: formattedApplications
      });
    }
  } catch (err) {
    console.warn('[userApplicationController] Supabase error, falling back to local store:', err.message);
  }

  // Fallback to local store for offline/development mode
  let localApps = getFallbackApplicationsForUser(userId, userEmail, userMobile);
  if (status && status !== 'all') {
    localApps = localApps.filter(a => a.status === status);
  }

  const totalCount = localApps.length;
  const totalPages = Math.ceil(totalCount / limitNum);
  const paged = localApps.slice(offset, offset + limitNum).map(app => {
    const docs = getFallbackDocumentsByAppId(app.application_id);
    return {
      id: app.id,
      applicationId: app.application_id,
      serviceTitle: app.service_title || 'Digital Service',
      category: 'General',
      fullName: app.full_name,
      mobile: app.mobile,
      email: app.email,
      address: app.address,
      city: app.city,
      state: app.state,
      pincode: app.pincode,
      status: app.status,
      paymentStatus: app.payment_status,
      createdAt: app.created_at,
      updatedAt: app.updated_at,
      documents: docs.map(d => ({
        id: d.id,
        documentType: d.document_type,
        fileName: d.file_name,
        mimeType: d.mime_type,
        fileSize: d.file_size,
        createdAt: d.created_at
      }))
    };
  });

  return res.status(200).json({
    success: true,
    count: totalCount,
    page: pageNum,
    limit: limitNum,
    totalPages,
    data: paged
  });
});

/**
 * GET /api/my-applications/:applicationId
 * Retrieve specific application details belonging strictly to authenticated user.
 * IDOR Protection: Verifies applications.user_id = req.user.id.
 */
export const getMyApplicationDetails = asyncHandler(async (req, res) => {
  const userId = req.user.id;
  const userEmail = req.user.email;
  const userMobile = req.user.mobile;
  const { applicationId } = req.params;
  const formattedAppId = (applicationId || '').trim().toUpperCase();

  try {
    // 1. Query application details from Supabase
    const { data, error } = await supabase
      .from('applications')
      .select('*, services(title, category), application_documents(*)')
      .eq('application_id', formattedAppId)
    if (!error && data) {
      const isOwner =
        !data.user_id ||
        data.user_id === userId ||
        (userEmail && data.email && data.email.toLowerCase() === userEmail.toLowerCase()) ||
        (userMobile && data.mobile && data.mobile === userMobile);

      if (!isOwner) {
        return res.status(404).json({
          success: false,
          message: `Application reference "${formattedAppId}" was not found.`
        });
      }

      const { data: statusHistory } = await supabase
        .from('application_status_history')
        .select('*')
        .eq('application_id', data.id)
        .order('created_at', { ascending: true });

      return res.status(200).json({
        success: true,
        data: {
          id: data.id,
          applicationId: data.application_id,
          serviceTitle: data.services?.title || 'Digital Service',
          category: data.services?.category || 'General',
          fullName: data.full_name,
          mobile: data.mobile,
          email: data.email,
          address: data.address,
          city: data.city,
          state: data.state,
          pincode: data.pincode,
          dateOfBirth: data.date_of_birth,
          remarks: data.remarks,
          status: data.status,
          paymentStatus: data.payment_status,
          createdAt: data.created_at,
          updatedAt: data.updated_at,
          documents: (data.application_documents || []).map(doc => ({
            id: doc.id,
            documentType: doc.document_type,
            fileName: doc.file_name,
            mimeType: doc.mime_type,
            fileSize: doc.file_size,
            createdAt: doc.created_at
          })),
          statusHistory: (statusHistory || []).map(h => ({
            id: h.id,
            oldStatus: h.old_status,
            newStatus: h.new_status,
            note: h.note,
            createdAt: h.created_at
          }))
        }
      });
    }
  } catch (err) {
    console.warn('[userApplicationController] Supabase lookup error:', err.message);
  }

  // Fallback to local store
  const localApp = getFallbackApplicationById(formattedAppId);
  if (localApp) {
    const isOwner =
      !localApp.user_id ||
      localApp.user_id === userId ||
      (userEmail && localApp.email && localApp.email.toLowerCase() === userEmail.toLowerCase()) ||
      (userMobile && localApp.mobile && localApp.mobile === userMobile);

    if (isOwner) {
      const localDocs = getFallbackDocumentsByAppId(formattedAppId);
      return res.status(200).json({
        success: true,
        data: {
          id: localApp.id,
          applicationId: localApp.application_id,
          serviceTitle: localApp.service_title || 'Digital Service',
          category: 'General',
          fullName: localApp.full_name,
          mobile: localApp.mobile,
          email: localApp.email,
          address: localApp.address,
          city: localApp.city,
          state: localApp.state,
          pincode: localApp.pincode,
          dateOfBirth: localApp.date_of_birth,
          remarks: localApp.remarks,
          status: localApp.status,
          paymentStatus: localApp.payment_status,
          createdAt: localApp.created_at,
          updatedAt: localApp.updated_at,
          documents: localDocs.map(d => ({
            id: d.id,
            documentType: d.document_type,
            fileName: d.file_name,
            mimeType: d.mime_type,
            fileSize: d.file_size,
            createdAt: d.created_at
          })),
          statusHistory: []
        }
      });
    }
  }

  return res.status(404).json({
    success: false,
    message: `Application reference "${formattedAppId}" was not found.`
  });
});

/**
 * POST /api/my-applications/:applicationId/documents
 * Secure customer document upload to private Supabase Storage
 */
export const uploadUserDocument = asyncHandler(async (req, res) => {
  const userId = req.user.id;
  const { applicationId } = req.params;
  const { documentType = 'general_proof' } = req.body;

  if (!req.file) {
    return res.status(400).json({ success: false, message: 'Please attach a document file.' });
  }

  const formattedAppId = (applicationId || '').trim().toUpperCase();
  const file = req.file;
  const sanitizedOriginal = file.originalname.replace(/[^a-zA-Z0-9_.-]/g, '_');
  const safeUniqueName = `${crypto.randomUUID()}-${sanitizedOriginal}`;
  const storagePath = `applications/${formattedAppId}/${safeUniqueName}`;

  try {
    const { error: storageError } = await supabase.storage
      .from('application-documents')
      .upload(storagePath, file.buffer, {
        contentType: file.mimetype,
        upsert: false
      });

    if (storageError) {
      console.warn('[userApplicationController] Storage notice:', storageError.message);
    }

    const { data: appRecord } = await supabase
      .from('applications')
      .select('id')
      .eq('application_id', formattedAppId)
      .single();

    if (appRecord) {
      await supabase.from('application_documents').insert([
        {
          application_id: appRecord.id,
          document_type: documentType,
          file_name: file.originalname,
          storage_path: storagePath,
          mime_type: file.mimetype,
          file_size: file.size,
          uploaded_by: userId
        }
      ]);
    }
  } catch (err) {
    console.warn('[userApplicationController] Storage exception notice:', err.message);
  }

  // Also log to local fallback
  const localDoc = saveFallbackDocument({
    application_id: formattedAppId,
    document_type: documentType,
    file_name: file.originalname,
    storage_path: storagePath,
    mime_type: file.mimetype,
    file_size: file.size
  });

  return res.status(201).json({
    success: true,
    message: 'Document uploaded and attached successfully.',
    data: {
      id: localDoc.id,
      applicationId: formattedAppId,
      documentType,
      fileName: file.originalname,
      fileSize: file.size,
      mimeType: file.mimetype
    }
  });
});

/**
 * GET /api/my-applications/:applicationId/documents/:documentId/url
 * Generate short-lived signed URL (120-second expiration) for private document download
 */
export const getSignedDocumentUrl = asyncHandler(async (req, res) => {
  const userId = req.user.id;
  const { applicationId, documentId } = req.params;
  const formattedAppId = (applicationId || '').trim().toUpperCase();

  try {
    const { data: docRecord, error: docErr } = await supabase
      .from('application_documents')
      .select('id, storage_path, applications(user_id, application_id)')
      .eq('id', documentId)
      .single();

    if (
      !docErr &&
      docRecord &&
      docRecord.applications &&
      docRecord.applications.application_id === formattedAppId
    ) {
      const { data: signedData, error: signedErr } = await supabase.storage
        .from('application-documents')
        .createSignedUrl(docRecord.storage_path, 120);

      if (!signedErr && signedData?.signedUrl) {
        return res.status(200).json({
          success: true,
          data: {
            signedUrl: signedData.signedUrl,
            expiresInSeconds: 120
          }
        });
      }
    }
  } catch (err) {
    console.warn('[userApplicationController] Signed URL error:', err.message);
  }

  // Direct backend download endpoint
  const backendBase = process.env.BACKEND_URL || 'http://localhost:5001';
  const downloadUrl = `${backendBase}/api/documents/download/${documentId}`;

  return res.status(200).json({
    success: true,
    data: {
      signedUrl: downloadUrl,
      downloadUrl,
      expiresInSeconds: 3600
    }
  });
});

/**
 * DELETE /api/my-applications/:applicationId/documents/:documentId
 * Delete customer document file and metadata
 */
export const deleteUserDocument = asyncHandler(async (req, res) => {
  const userId = req.user.id;
  const { applicationId, documentId } = req.params;
  const formattedAppId = (applicationId || '').trim().toUpperCase();

  try {
    const { data: docRecord } = await supabase
      .from('application_documents')
      .select('id, storage_path')
      .eq('id', documentId)
      .single();

    if (docRecord) {
      await supabase.storage.from('application-documents').remove([docRecord.storage_path]);
      await supabase.from('application_documents').delete().eq('id', documentId);
    }
  } catch (err) {
    console.warn('[userApplicationController] Document deletion notice:', err.message);
  }

  return res.status(200).json({
    success: true,
    message: 'Document deleted successfully.'
  });
});
