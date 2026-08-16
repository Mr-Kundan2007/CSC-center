import { supabase } from '../config/supabase.js';
import asyncHandler from '../middleware/asyncHandler.js';
import { isValidStatus, isValidTransition } from '../utils/applicationState.js';
import { notifyStatusChanged } from '../services/notificationService.js';
import {
  getAllFallbackApplications,
  getFallbackApplicationById,
  updateFallbackApplicationStatus,
  getFallbackDocumentsByAppId,
  getAllFallbackDocuments,
  getFallbackDocumentById
} from '../utils/localStore.js';

/**
 * GET /api/admin/me
 * Verify Admin Role & Token
 */
export const getAdminMe = asyncHandler(async (req, res) => {
  return res.status(200).json({
    success: true,
    data: {
      isAdmin: true,
      user: {
        id: req.user.id,
        fullName: req.user.fullName,
        email: req.user.email,
        role: req.user.role
      }
    }
  });
});

/**
 * GET /api/admin/applications
 * Paginated Application Listing for Administrator Desk
 */
export const getAdminApplications = asyncHandler(async (req, res) => {
  const { page = 1, limit = 20, status, service, search } = req.query;

  const pageNum = Math.max(1, parseInt(page, 10));
  const limitNum = Math.min(50, Math.max(1, parseInt(limit, 10)));
  const offset = (pageNum - 1) * limitNum;

  try {
    let query = supabase
      .from('applications')
      .select('id, application_id, full_name, mobile, email, status, payment_status, created_at, updated_at, services(title, category)', { count: 'exact' });

    if (status && status !== 'all') {
      query = query.eq('status', status);
    }

    if (service && service !== 'all') {
      query = query.eq('service_id', service);
    }

    if (search) {
      query = query.or(`application_id.ilike.%${search}%,full_name.ilike.%${search}%,mobile.ilike.%${search}%,email.ilike.%${search}%`);
    }

    query = query.order('created_at', { ascending: false });
    query = query.range(offset, offset + limitNum - 1);

    const { data, error, count } = await query;

    if (!error && data && data.length > 0) {
      const totalCount = count || data.length;
      const totalPages = Math.ceil(totalCount / limitNum);

      const formatted = data.map(app => ({
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
        data: formatted
      });
    }
  } catch (err) {
    console.warn('[adminController] Supabase listing error, falling back:', err.message);
  }

  // Fallback to localStore
  let localApps = getAllFallbackApplications();
  if (status && status !== 'all') {
    localApps = localApps.filter(a => a.status === status);
  }
  if (search) {
    const q = search.toLowerCase();
    localApps = localApps.filter(
      a =>
        (a.application_id && a.application_id.toLowerCase().includes(q)) ||
        (a.full_name && a.full_name.toLowerCase().includes(q)) ||
        (a.mobile && a.mobile.includes(q)) ||
        (a.email && a.email.toLowerCase().includes(q))
    );
  }

  const totalCount = localApps.length;
  const totalPages = Math.ceil(totalCount / limitNum);
  const paged = localApps.slice(offset, offset + limitNum).map(app => {
    const docs = getFallbackDocumentsByAppId(app.application_id);
    return {
      id: app.id,
      applicationId: app.application_id,
      fullName: app.full_name,
      mobile: app.mobile,
      email: app.email,
      address: app.address,
      city: app.city,
      state: app.state,
      pincode: app.pincode,
      serviceTitle: app.service_title || 'Digital Service',
      category: 'General',
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
 * GET /api/admin/applications/:applicationId
 * Admin Application Details View
 */
export const getAdminApplicationDetails = asyncHandler(async (req, res) => {
  const { applicationId } = req.params;
  const formattedAppId = (applicationId || '').trim().toUpperCase();

  try {
    const { data, error } = await supabase
      .from('applications')
      .select('*, services(title, category), application_documents(*)')
      .eq('application_id', formattedAppId)
      .single();

    if (!error && data) {
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
          userId: data.user_id,
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
            changedBy: h.changed_by,
            note: h.note,
            createdAt: h.created_at
          }))
        }
      });
    }
  } catch (err) {
    console.warn('[adminController] Supabase detail lookup error:', err.message);
  }

  // Fallback to localStore
  const localApp = getFallbackApplicationById(formattedAppId);
  if (localApp) {
    const localDocs = getFallbackDocumentsByAppId(formattedAppId);
    return res.status(200).json({
      success: true,
      data: {
        id: localApp.id,
        applicationId: localApp.application_id,
        userId: localApp.user_id,
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
        documents: localDocs.map(doc => ({
          id: doc.id,
          documentType: doc.document_type,
          fileName: doc.file_name,
          mimeType: doc.mime_type,
          fileSize: doc.file_size,
          createdAt: doc.created_at
        })),
        statusHistory: []
      }
    });
  }

  return res.status(404).json({
    success: false,
    message: `Application reference "${formattedAppId}" was not found.`
  });
});

/**
 * GET /api/admin/applications/:applicationId/documents/:documentId/url
 * Generate short-lived signed URL for Admin Document Review
 */
export const getAdminSignedDocumentUrl = asyncHandler(async (req, res) => {
  const { applicationId, documentId } = req.params;
  const formattedAppId = (applicationId || '').trim().toUpperCase();

  try {
    const { data: docRecord, error: docErr } = await supabase
      .from('application_documents')
      .select('id, storage_path, applications(application_id)')
      .eq('id', documentId)
      .single();

    if (!docErr && docRecord && docRecord.applications?.application_id === formattedAppId) {
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
    console.warn('[adminController] Signed URL error:', err.message);
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
 * PATCH /api/admin/applications/:applicationId/status
 * Admin Application Status Transition & Audit Trail Logging
 */
export const updateApplicationStatus = asyncHandler(async (req, res) => {
  const adminId = req.user.id;
  const { applicationId } = req.params;
  const { status: targetStatus, note } = req.body;

  const formattedAppId = (applicationId || '').trim().toUpperCase();

  // 1. Validate status format
  if (!targetStatus || !isValidStatus(targetStatus)) {
    return res.status(400).json({
      success: false,
      message: `Invalid target status "${targetStatus}". Valid statuses are: pending, under_review, document_required, approved, completed, rejected.`
    });
  }

  // 2. Fetch current application state from Supabase or localStore
  let appRecord = null;
  try {
    const { data } = await supabase
      .from('applications')
      .select('*, services(title)')
      .eq('application_id', formattedAppId)
      .single();
    if (data) appRecord = data;
  } catch (err) {
    // Supabase optional
  }

  if (!appRecord) {
    const local = getFallbackApplicationById(formattedAppId);
    if (local) {
      appRecord = { ...local, title: local.service_title };
    }
  }

  if (!appRecord) {
    return res.status(404).json({ success: false, message: `Application reference "${formattedAppId}" not found.` });
  }

  const currentStatus = appRecord.status;

  // 3. Enforce Server-Side State Machine Transition Rules
  if (!isValidTransition(currentStatus, targetStatus)) {
    return res.status(400).json({
      success: false,
      message: `Invalid status transition from "${currentStatus}" to "${targetStatus}".`
    });
  }

  // 4. Update in Supabase if exists
  try {
    await supabase
      .from('applications')
      .update({
        status: targetStatus,
        updated_at: new Date().toISOString()
      })
      .eq('application_id', formattedAppId);

    await supabase.from('application_status_history').insert([
      {
        application_id: appRecord.id,
        old_status: currentStatus,
        new_status: targetStatus,
        changed_by: adminId,
        note: note || null
      }
    ]);
  } catch (err) {
    console.warn('[adminController] Supabase update warning:', err.message);
  }

  // Always update in local fallback store
  updateFallbackApplicationStatus(formattedAppId, targetStatus);

  // Trigger Email Notification Asynchronously
  notifyStatusChanged(appRecord, currentStatus, targetStatus, note).catch(err => {
    console.warn('[adminController] Email status notification warning:', err.message);
  });

  return res.status(200).json({
    success: true,
    message: `Application status updated to "${targetStatus}".`,
    data: {
      applicationId: formattedAppId,
      oldStatus: currentStatus,
      newStatus: targetStatus,
      note: note || null,
      updatedAt: new Date().toISOString()
    }
  });
});

export const getAdminDocuments = asyncHandler(async (req, res) => {
  const backendBase = process.env.BACKEND_URL || 'http://localhost:5001';

  try {
    const { data: dbDocs, error } = await supabase
      .from('application_documents')
      .select('*, applications(application_id, full_name, mobile, email)')
      .order('created_at', { ascending: false });

    if (!error && dbDocs && dbDocs.length > 0) {
      const formatted = dbDocs.map(d => ({
        id: d.id,
        applicationId: d.applications?.application_id || 'CSC-2026',
        applicantName: d.applications?.full_name || 'princeydv',
        documentType: d.document_type || 'Proof Document',
        fileName: d.file_name,
        fileSize: d.file_size,
        mimeType: d.mime_type,
        createdAt: d.created_at,
        downloadUrl: `${backendBase}/api/documents/download/${d.id}`
      }));
      return res.status(200).json({ success: true, data: formatted });
    }
  } catch (err) {
    console.warn('[adminController] getAdminDocuments error:', err.message);
  }

  // Fallback documents
  const allFallbackDocs = getAllFallbackDocuments();
  const allApps = getAllFallbackApplications();
  const appMap = {};
  allApps.forEach(a => { appMap[a.application_id] = a; });

  const formatted = allFallbackDocs.map(d => {
    const matchedApp = appMap[d.application_id] || {};
    return {
      id: d.id,
      applicationId: d.application_id,
      applicantName: matchedApp.full_name || 'princeydv',
      documentType: d.document_type,
      fileName: d.file_name,
      fileSize: d.file_size,
      mimeType: d.mime_type,
      createdAt: d.created_at,
      downloadUrl: `${backendBase}/api/documents/download/${d.id}`
    };
  });

  return res.status(200).json({ success: true, data: formatted });
});

export const getDashboardStats = asyncHandler(async (req, res) => {
  return res.status(501).json({
    success: false,
    message: 'Admin management APIs scheduled for later phase.'
  });
});
