import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import Alert from '../components/Alert';
import Loading from '../components/Loading';
import {
  getAdminApplicationDetails,
  getAdminSignedDocumentUrl,
  updateApplicationStatus,
  getDocumentDownloadUrl
} from '../services/api';
import {
  FileText,
  Clock,
  CheckCircle2,
  AlertCircle,
  Download,
  Calendar,
  Tag,
  User,
  Phone,
  Mail,
  MapPin,
  ArrowLeft,
  History,
  Shield,
  Edit3,
  X,
  Eye,
  Image as ImageIcon,
  ExternalLink,
  ZoomIn
} from 'lucide-react';

const statusBadges = {
  pending: { label: 'Pending Review', color: 'bg-amber-50 text-amber-700 border-amber-200' },
  under_review: { label: 'Under Review', color: 'bg-blue-50 text-blue-700 border-blue-200' },
  document_required: { label: 'Document Required', color: 'bg-purple-50 text-purple-700 border-purple-200' },
  approved: { label: 'Approved', color: 'bg-emerald-50 text-emerald-700 border-emerald-200' },
  completed: { label: 'Completed', color: 'bg-emerald-50 text-emerald-700 border-emerald-200' },
  rejected: { label: 'Rejected', color: 'bg-red-50 text-red-700 border-red-200' },
};

const statusOptions = [
  { value: 'under_review', label: 'Under Review' },
  { value: 'document_required', label: 'Document Required' },
  { value: 'approved', label: 'Approved' },
  { value: 'completed', label: 'Completed' },
  { value: 'rejected', label: 'Rejected' }
];

const ApplicationDetails = () => {
  const { id: applicationId } = useParams();
  const [appData, setAppData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  // Status Modal State
  const [showStatusModal, setShowStatusModal] = useState(false);
  const [targetStatus, setTargetStatus] = useState('under_review');
  const [statusNote, setStatusNote] = useState('');
  const [updating, setUpdating] = useState(false);
  const [updateMsg, setUpdateMsg] = useState('');
  const [updateError, setUpdateError] = useState('');

  // Document states
  const [downloadingDocId, setDownloadingDocId] = useState(null);
  const [previewImage, setPreviewImage] = useState(null);

  const fetchDetails = async () => {
    try {
      const res = await getAdminApplicationDetails(applicationId);
      if (res && res.success && res.data) {
        setAppData(res.data);
      } else {
        setError(res.message || 'Application record not found.');
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Application record not found.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    document.title = `CSC Admin | Application ${applicationId || ''}`;
    fetchDetails();
  }, [applicationId]);

  const getDocUrl = (docId) => {
    return getDocumentDownloadUrl(docId, true);
  };

  const handleDownloadDocument = async (docId, fileName) => {
    setDownloadingDocId(docId);
    try {
      const res = await getAdminSignedDocumentUrl(applicationId, docId);
      const url = res?.data?.signedUrl || res?.data?.downloadUrl || getDocumentDownloadUrl(docId, false, fileName);
      if (url && url !== '#') {
        const link = document.createElement('a');
        link.href = url;
        link.download = fileName || 'document.jpg';
        link.target = '_blank';
        link.rel = 'noopener,noreferrer';
        document.body.appendChild(link);
        link.click();
        setTimeout(() => {
          if (document.body.contains(link)) document.body.removeChild(link);
        }, 100);
      } else {
        window.location.href = getDocumentDownloadUrl(docId, false, fileName);
      }
    } catch (err) {
      window.location.href = getDocumentDownloadUrl(docId, false, fileName);
    } finally {
      setDownloadingDocId(null);
    }
  };

  const handleStatusSubmit = async (e) => {
    e.preventDefault();
    setUpdating(true);
    setUpdateError('');
    setUpdateMsg('');

    try {
      const res = await updateApplicationStatus(applicationId, {
        status: targetStatus,
        note: statusNote
      });

      if (res && res.success) {
        setUpdateMsg(res.message || 'Status updated successfully.');
        setShowStatusModal(false);
        setStatusNote('');
        await fetchDetails();
      } else {
        setUpdateError(res.message || 'Failed to update status.');
      }
    } catch (err) {
      setUpdateError(err.response?.data?.message || 'Status transition rejected by server state machine.');
    } finally {
      setUpdating(false);
    }
  };

  if (loading) return <Loading message="Loading application details..." />;

  if (error || !appData) {
    return (
      <div className="space-y-6">
        <Alert type="error" title="Record Error">{error || 'Application not found.'}</Alert>
        <Link to="/admin/applications" className="btn-primary text-xs py-2 px-4 inline-flex items-center gap-1">
          <ArrowLeft className="w-4 h-4" /> Back to Applications List
        </Link>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-slate-200 pb-4">
        <div>
          <span className="text-xs text-slate-400 font-bold uppercase">Application Reference</span>
          <h1 className="text-2xl sm:text-3xl font-mono font-extrabold text-slate-900">{appData.applicationId}</h1>
        </div>

        <div className="flex items-center gap-3">
          <span className={`px-3.5 py-1.5 rounded-full border text-xs font-bold ${
            statusBadges[appData.status]?.color || 'bg-slate-100 text-slate-800'
          }`}>
            {statusBadges[appData.status]?.label || appData.status}
          </span>

          <button
            onClick={() => {
              setShowStatusModal(true);
              setTargetStatus(appData.status === 'pending' ? 'under_review' : appData.status);
            }}
            className="btn-primary text-xs py-2 px-4 flex items-center gap-1.5 shadow-md cursor-pointer"
          >
            <Edit3 className="w-3.5 h-3.5" />
            <span>Update Status</span>
          </button>
        </div>
      </div>

      {updateMsg && <Alert type="success" title="Updated">{updateMsg}</Alert>}

      {/* Applicant Info & Service Details */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        
        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-3">
          <h3 className="text-base font-bold text-slate-900 border-b border-slate-100 pb-2">Applicant Information</h3>
          <div className="space-y-1.5 text-xs text-slate-800 font-medium">
            <p><strong>Full Name:</strong> {appData.fullName}</p>
            <p><strong>Mobile:</strong> {appData.mobile}</p>
            <p><strong>Email:</strong> {appData.email || 'None'}</p>
            <p><strong>Date of Birth:</strong> {appData.dateOfBirth || 'Not specified'}</p>
            <p><strong>Address:</strong> {appData.address} {appData.city} {appData.state} {appData.pincode}</p>
          </div>
        </div>

        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-3">
          <h3 className="text-base font-bold text-slate-900 border-b border-slate-100 pb-2">Service Details</h3>
          <div className="space-y-1.5 text-xs text-slate-800 font-medium">
            <p><strong>Service Title:</strong> {appData.serviceTitle}</p>
            <p><strong>Category:</strong> {appData.category}</p>
            <p><strong>Payment Status:</strong> <span className="capitalize font-bold text-emerald-700">{appData.paymentStatus}</span></p>
            <p><strong>Submission Date:</strong> {new Date(appData.createdAt).toLocaleString('en-IN')}</p>
            <p><strong>Remarks:</strong> {appData.remarks || 'None'}</p>
          </div>
        </div>

      </div>

      {/* Attached Documents with Inline Visual Preview */}
      <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-4">
        <div className="flex items-center justify-between border-b border-slate-100 pb-2">
          <h3 className="text-base font-bold text-slate-900">
            Attached Documents ({appData.documents.length})
          </h3>
          <span className="text-xs text-slate-400 font-medium">Click preview to view in this window</span>
        </div>

        {appData.documents.length === 0 ? (
          <p className="text-xs text-slate-400 italic">No documents attached.</p>
        ) : (
          <div className="space-y-4">
            {appData.documents.map(doc => {
              const docUrl = getDocUrl(doc.id);
              const isImage = !doc.fileName?.endsWith('.pdf');

              return (
                <div key={doc.id} className="p-4 bg-slate-50 rounded-2xl border border-slate-200 space-y-3">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                    <div className="flex items-center gap-3">
                      {isImage ? (
                        <img
                          src={docUrl}
                          alt={doc.fileName}
                          onClick={() => setPreviewImage({ url: docUrl, fileName: doc.fileName, docId: doc.id })}
                          className="w-14 h-14 object-cover rounded-xl border border-slate-300 shadow-xs cursor-pointer hover:scale-105 transition-transform bg-white shrink-0"
                          onError={(e) => {
                            e.target.onerror = null;
                            e.target.src = '/uploads/Friends Forever Pictures.jpeg';
                          }}
                        />
                      ) : (
                        <div className="w-14 h-14 rounded-xl bg-indigo-50 border border-indigo-200 flex items-center justify-center text-indigo-600 shrink-0">
                          <FileText className="w-6 h-6" />
                        </div>
                      )}
                      
                      <div className="overflow-hidden">
                        <p className="font-bold text-sm text-slate-900 truncate">{doc.fileName}</p>
                        <p className="text-xs text-slate-500 font-mono mt-0.5">
                          {doc.fileSize ? `${(doc.fileSize / 1024).toFixed(1)} KB` : 'Attached File'} • {doc.documentType || 'Identity Proof'}
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center gap-2 shrink-0">
                      {isImage && (
                        <button
                          type="button"
                          onClick={() => setPreviewImage({ url: docUrl, fileName: doc.fileName, docId: doc.id })}
                          className="btn-secondary text-xs py-2 px-3.5 flex items-center gap-1.5 cursor-pointer"
                        >
                          <Eye className="w-3.5 h-3.5 text-indigo-600" />
                          <span>View in this Window</span>
                        </button>
                      )}

                      <button
                        type="button"
                        onClick={() => handleDownloadDocument(doc.id, doc.fileName)}
                        disabled={downloadingDocId === doc.id}
                        className="btn-primary text-xs py-2 px-3.5 flex items-center gap-1.5 cursor-pointer disabled:opacity-50"
                      >
                        <Download className="w-3.5 h-3.5" />
                        <span>{downloadingDocId === doc.id ? 'Downloading...' : 'Download'}</span>
                      </button>
                    </div>
                  </div>

                  {/* Inline visual preview card */}
                  {isImage && (
                    <div className="pt-2 border-t border-slate-200/80">
                      <p className="text-[11px] font-bold text-slate-500 mb-2 uppercase tracking-wide">Image Preview:</p>
                      <div className="relative group max-w-md rounded-xl overflow-hidden border border-slate-200 bg-white shadow-xs">
                        <img
                          src={docUrl}
                          alt={doc.fileName}
                          className="w-full max-h-64 object-contain bg-slate-900/5 cursor-pointer"
                          onClick={() => setPreviewImage({ url: docUrl, fileName: doc.fileName, docId: doc.id })}
                          onError={(e) => {
                            e.target.onerror = null;
                            e.target.src = '/uploads/Friends Forever Pictures.jpeg';
                          }}
                        />
                        <div
                          onClick={() => setPreviewImage({ url: docUrl, fileName: doc.fileName, docId: doc.id })}
                          className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2 text-white font-bold text-xs cursor-pointer backdrop-blur-xs"
                        >
                          <ZoomIn className="w-5 h-5" />
                          <span>Click to Enlarge Full View</span>
                        </div>
                      </div>
                    </div>
                  )}

                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Status History Audit Trail */}
      <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-4">
        <h3 className="text-base font-bold text-slate-900 border-b border-slate-100 pb-2">Status Audit Trail</h3>
        {appData.statusHistory.length === 0 ? (
          <p className="text-xs text-slate-400 italic">Application is in initial pending status.</p>
        ) : (
          <div className="space-y-2">
            {appData.statusHistory.map(h => (
              <div key={h.id} className="p-3 bg-slate-50 rounded-xl border border-slate-100 text-xs space-y-1">
                <div className="flex justify-between font-bold text-slate-800">
                  <span>{h.oldStatus || 'initial'} → <strong className="text-indigo-600">{h.newStatus}</strong></span>
                  <span className="text-slate-400 font-mono">{new Date(h.createdAt).toLocaleString('en-IN')}</span>
                </div>
                {h.note && <p className="text-slate-600">Note: "{h.note}"</p>}
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Lightbox / View Image In This Window Modal */}
      {previewImage && (
        <div className="fixed inset-0 bg-slate-950/80 backdrop-blur-md flex items-center justify-center p-4 z-50 animate-fade-in">
          <div className="bg-white rounded-3xl max-w-4xl w-full max-h-[90vh] flex flex-col shadow-2xl border border-slate-200/80 overflow-hidden">
            {/* Modal Header */}
            <div className="p-4 sm:px-6 bg-slate-900 text-white flex items-center justify-between border-b border-slate-800">
              <div className="flex items-center gap-2.5 overflow-hidden">
                <ImageIcon className="w-5 h-5 text-indigo-400 shrink-0" />
                <div className="truncate">
                  <h3 className="text-sm sm:text-base font-bold text-white truncate">{previewImage.fileName}</h3>
                  <p className="text-[11px] text-slate-400 font-mono">Application Reference: {applicationId}</p>
                </div>
              </div>
              
              <button
                onClick={() => setPreviewImage(null)}
                className="p-2 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800 transition-colors cursor-pointer"
                title="Close"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Modal Body - Image Viewer */}
            <div className="flex-1 overflow-auto p-4 sm:p-6 bg-slate-950 flex items-center justify-center min-h-[300px]">
              <img
                src={previewImage.url}
                alt={previewImage.fileName}
                className="max-h-[60vh] max-w-full object-contain rounded-xl shadow-2xl border border-slate-800"
                onError={(e) => {
                  e.target.onerror = null;
                  e.target.src = '/uploads/Friends Forever Pictures.jpeg';
                }}
              />
            </div>

            {/* Modal Footer Controls */}
            <div className="p-4 sm:px-6 bg-slate-50 border-t border-slate-200 flex flex-wrap items-center justify-between gap-3">
              <span className="text-xs text-slate-500 font-medium">
                Verified Document Proof Attachment
              </span>

              <div className="flex items-center gap-2">
                <button
                  onClick={() => handleDownloadDocument(previewImage.docId, previewImage.fileName)}
                  className="btn-primary text-xs py-2 px-4 flex items-center gap-1.5 cursor-pointer shadow-sm"
                >
                  <Download className="w-4 h-4" />
                  <span>Download Image</span>
                </button>

                <button
                  onClick={() => setPreviewImage(null)}
                  className="btn-secondary text-xs py-2 px-4 cursor-pointer"
                >
                  Close Window
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Status Update Modal */}
      {showStatusModal && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-2xl p-6 sm:p-8 max-w-md w-full shadow-2xl space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <h3 className="text-lg font-bold text-slate-900">Update Application Status</h3>
              <button onClick={() => setShowStatusModal(false)} className="text-slate-400 hover:text-slate-600">
                <X className="w-5 h-5" />
              </button>
            </div>

            {updateError && <Alert type="error" title="Transition Error">{updateError}</Alert>}

            <form onSubmit={handleStatusSubmit} className="space-y-4" noValidate>
              <div>
                <label className="form-label">New Status Target *</label>
                <select
                  value={targetStatus}
                  onChange={(e) => setTargetStatus(e.target.value)}
                  className="form-input"
                >
                  {statusOptions.map(opt => (
                    <option key={opt.value} value={opt.value}>{opt.label}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="form-label">Audit Note / Reason for Customer</label>
                <textarea
                  rows="3"
                  placeholder="Mention verification details or document requirements..."
                  value={statusNote}
                  onChange={(e) => setStatusNote(e.target.value)}
                  className="form-input"
                ></textarea>
              </div>

              <div className="pt-2 flex justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setShowStatusModal(false)}
                  className="btn-tertiary text-xs py-2 px-4"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={updating}
                  className="btn-primary text-xs py-2 px-5 cursor-pointer disabled:opacity-50"
                >
                  {updating ? 'Saving Status...' : 'Confirm Status Change'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
};

export default ApplicationDetails;
