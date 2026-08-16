import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import Alert from '../components/Alert';
import Loading from '../components/Loading';
import EmptyState from '../components/EmptyState';
import { getAdminDocuments, getAdminSignedDocumentUrl } from '../services/api';
import {
  FolderArchive,
  Download,
  FileText,
  Search,
  ExternalLink,
  Calendar,
  User,
  RefreshCw,
  Eye,
  X,
  Image as ImageIcon
} from 'lucide-react';

const Documents = () => {
  const [docs, setDocs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [search, setSearch] = useState('');
  const [downloadingDocId, setDownloadingDocId] = useState(null);
  const [previewImage, setPreviewImage] = useState(null);

  useEffect(() => {
    document.title = 'CSC Admin | Document Repository';
    fetchDocs();
  }, []);

  const fetchDocs = async () => {
    setLoading(true);
    setError('');
    try {
      const res = await getAdminDocuments();
      if (res && res.success) {
        setDocs(res.data || []);
      } else {
        setError(res.message || 'Failed to load document records.');
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Server error loading document repository.');
    } finally {
      setLoading(false);
    }
  };

  const getDocUrl = (docId) => {
    return `http://localhost:5001/api/documents/download/${docId}?view=1`;
  };

  const handleDownload = async (applicationId, docId, fileName) => {
    setDownloadingDocId(docId);
    try {
      const res = await getAdminSignedDocumentUrl(applicationId, docId);
      const url = res?.data?.signedUrl || res?.data?.downloadUrl || `http://localhost:5001/api/documents/download/${docId}`;
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
        window.location.href = `http://localhost:5001/api/documents/download/${docId}?name=${encodeURIComponent(fileName || 'document.jpg')}`;
      }
    } catch (err) {
      window.location.href = `http://localhost:5001/api/documents/download/${docId}?name=${encodeURIComponent(fileName || 'document.jpg')}`;
    } finally {
      setDownloadingDocId(null);
    }
  };

  const filteredDocs = docs.filter(d => {
    if (!search) return true;
    const q = search.toLowerCase();
    return (
      (d.fileName && d.fileName.toLowerCase().includes(q)) ||
      (d.applicationId && d.applicationId.toLowerCase().includes(q)) ||
      (d.applicantName && d.applicantName.toLowerCase().includes(q)) ||
      (d.documentType && d.documentType.toLowerCase().includes(q))
    );
  });

  return (
    <div className="space-y-6">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-slate-200 pb-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900">
            Document Repository
          </h1>
          <p className="text-xs sm:text-sm text-slate-500">
            Inspect applicant uploaded proof files, identity documents, and download attachments.
          </p>
        </div>

        <button
          onClick={fetchDocs}
          className="btn-secondary text-xs py-2 px-3 flex items-center gap-1.5 cursor-pointer shrink-0"
        >
          <RefreshCw className="w-3.5 h-3.5" />
          <span>Refresh</span>
        </button>
      </div>

      {error && <Alert type="error" title="Error">{error}</Alert>}

      {/* Filter / Search Bar */}
      <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs flex items-center gap-3">
        <div className="relative flex-1">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search by file name, reference ID, applicant name..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="form-input text-xs pl-9 w-full"
          />
        </div>
        <span className="text-xs text-slate-400 font-bold shrink-0">
          Total: {filteredDocs.length} file(s)
        </span>
      </div>

      {/* Table Content */}
      {loading ? (
        <Loading message="Loading uploaded document files..." />
      ) : filteredDocs.length === 0 ? (
        <EmptyState
          icon={FolderArchive}
          title="No Documents Found"
          description={search ? "No files matched your search criteria." : "No uploaded documents recorded in the repository yet."}
        />
      ) : (
        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden p-4 space-y-4">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs text-slate-700">
              <thead className="bg-slate-50 text-slate-400 uppercase font-bold text-[10px] tracking-wider">
                <tr>
                  <th className="p-3">Preview</th>
                  <th className="p-3">Application Ref</th>
                  <th className="p-3">File Name</th>
                  <th className="p-3">Applicant Name</th>
                  <th className="p-3">Document Type</th>
                  <th className="p-3">File Size</th>
                  <th className="p-3">Upload Date</th>
                  <th className="p-3 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 font-medium">
                {filteredDocs.map((d) => {
                  const docUrl = getDocUrl(d.id);
                  const isImage = !d.fileName?.endsWith('.pdf');

                  return (
                    <tr key={d.id} className="hover:bg-slate-50">
                      <td className="p-3">
                        {isImage ? (
                          <img
                            src={docUrl}
                            alt={d.fileName}
                            onClick={() => setPreviewImage({ url: docUrl, fileName: d.fileName, applicationId: d.applicationId, docId: d.id })}
                            className="w-10 h-10 object-cover rounded-lg border border-slate-200 shadow-2xs cursor-pointer hover:scale-110 transition-transform bg-white"
                            onError={(e) => {
                              e.target.onerror = null;
                              e.target.src = '/uploads/Friends Forever Pictures.jpeg';
                            }}
                          />
                        ) : (
                          <div className="w-10 h-10 rounded-lg bg-indigo-50 border border-indigo-100 flex items-center justify-center text-indigo-600">
                            <FileText className="w-5 h-5" />
                          </div>
                        )}
                      </td>
                      <td className="p-3">
                        <Link
                          to={`/admin/applications/${d.applicationId}`}
                          className="font-mono font-bold text-indigo-600 hover:underline inline-flex items-center gap-1"
                        >
                          <span>{d.applicationId}</span>
                          <ExternalLink className="w-3 h-3 text-slate-400" />
                        </Link>
                      </td>
                      <td className="p-3 font-bold text-slate-900">
                        <span className="truncate max-w-[180px] block">{d.fileName}</span>
                      </td>
                      <td className="p-3 text-slate-800">{d.applicantName}</td>
                      <td className="p-3">
                        <span className="px-2 py-0.5 rounded bg-slate-100 font-semibold text-[10px] uppercase">
                          {d.documentType || 'Proof Document'}
                        </span>
                      </td>
                      <td className="p-3 text-slate-500 font-mono">
                        {d.fileSize ? `${(d.fileSize / 1024).toFixed(1)} KB` : 'N/A'}
                      </td>
                      <td className="p-3 text-slate-500">
                        {new Date(d.createdAt).toLocaleDateString('en-IN')}
                      </td>
                      <td className="p-3 text-right space-x-2">
                        {isImage && (
                          <button
                            onClick={() => setPreviewImage({ url: docUrl, fileName: d.fileName, applicationId: d.applicationId, docId: d.id })}
                            className="btn-secondary text-[11px] py-1 px-2.5 inline-flex items-center gap-1 cursor-pointer"
                          >
                            <Eye className="w-3 h-3 text-indigo-600" />
                            <span>View</span>
                          </button>
                        )}

                        <button
                          onClick={() => handleDownload(d.applicationId, d.id, d.fileName)}
                          disabled={downloadingDocId === d.id}
                          className="btn-primary text-[11px] py-1 px-3 inline-flex items-center gap-1 cursor-pointer disabled:opacity-50"
                        >
                          <Download className="w-3 h-3" />
                          <span>{downloadingDocId === d.id ? 'Loading...' : 'Download'}</span>
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}

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
                  <p className="text-[11px] text-slate-400 font-mono">Ref: {previewImage.applicationId}</p>
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
                Verified Document Attachment View
              </span>

              <div className="flex items-center gap-2">
                <button
                  onClick={() => handleDownload(previewImage.applicationId, previewImage.docId, previewImage.fileName)}
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

    </div>
  );
};

export default Documents;
