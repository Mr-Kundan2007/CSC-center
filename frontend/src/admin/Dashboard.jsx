import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import Alert from '../components/Alert';
import Loading from '../components/Loading';
import {
  getDashboardStats,
  getAdminApplications
} from '../services/api';
import {
  FileText,
  Clock,
  CheckCircle2,
  FolderArchive,
  Calendar,
  ArrowRight,
  ExternalLink,
  Shield,
  Eye
} from 'lucide-react';

const statusBadges = {
  pending: { label: 'Pending', color: 'bg-amber-50 text-amber-700 border-amber-200' },
  under_review: { label: 'Under Review', color: 'bg-blue-50 text-blue-700 border-blue-200' },
  document_required: { label: 'Doc Required', color: 'bg-purple-50 text-purple-700 border-purple-200' },
  approved: { label: 'Approved', color: 'bg-emerald-50 text-emerald-700 border-emerald-200' },
  completed: { label: 'Completed', color: 'bg-emerald-50 text-emerald-700 border-emerald-200' },
  rejected: { label: 'Rejected', color: 'bg-red-50 text-red-700 border-red-200' },
};

const Dashboard = () => {
  useEffect(() => {
    document.title = 'CSC Admin | Dashboard Overview';
  }, []);

  const [dateRange, setDateRange] = useState('all');
  const [stats, setStats] = useState(null);
  const [recentApps, setRecentApps] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const fetchDashboardData = async () => {
    setLoading(true);
    setError('');

    try {
      const [statsRes, appsRes] = await Promise.all([
        getDashboardStats({ range: dateRange }),
        getAdminApplications({ page: 1, limit: 10 })
      ]);

      if (statsRes && statsRes.success) setStats(statsRes.data);
      if (appsRes && appsRes.success) setRecentApps(appsRes.data || []);
    } catch (err) {
      console.error('[Dashboard.jsx] Error:', err);
      setError('Failed to load dashboard statistics.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDashboardData();
  }, [dateRange]);

  if (loading && !stats) {
    return <Loading message="Loading operational dashboard..." />;
  }

  const pendingTotal = (stats?.pendingApplications || 0) + (stats?.underReviewApplications || 0) + (stats?.documentRequiredApplications || 0);
  const completedTotal = (stats?.completedApplications || 0) + (stats?.approvedApplications || 0);

  return (
    <div className="space-y-8 max-w-7xl mx-auto">
      
      {/* Header & Date Range Filter */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-slate-200 pb-4">
        <div className="space-y-1">
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
            Operational Overview
          </h1>
          <p className="text-xs sm:text-sm text-slate-500">
            Real-time summary of citizen applications, documents, and assistance bookings.
          </p>
        </div>

        <div className="flex items-center gap-2 bg-white p-1.5 rounded-xl border border-slate-200 shadow-xs">
          <Calendar className="w-4 h-4 text-slate-400 ml-2" />
          <select
            value={dateRange}
            onChange={(e) => setDateRange(e.target.value)}
            className="text-xs font-bold text-slate-700 bg-transparent outline-none pr-2 cursor-pointer"
          >
            <option value="all">All Time</option>
            <option value="today">Today</option>
            <option value="7days">Last 7 Days</option>
            <option value="30days">Last 30 Days</option>
          </select>
        </div>
      </div>

      {error && <Alert type="error" title="Error">{error}</Alert>}

      {/* 4 Core Essential Stat Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        
        {/* Card 1: Total Applications */}
        <Link
          to="/admin/applications"
          className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm hover:shadow-md transition-all hover:border-indigo-300 group"
        >
          <div className="flex items-center justify-between">
            <span className="text-xs text-slate-500 font-bold uppercase tracking-wider">Total Applications</span>
            <div className="w-10 h-10 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center group-hover:scale-110 transition-transform">
              <FileText className="w-5 h-5" />
            </div>
          </div>
          <div className="text-3xl font-black text-slate-900 mt-3">{stats?.totalApplications || 0}</div>
          <p className="text-[11px] text-indigo-600 font-semibold mt-2 flex items-center gap-1">
            <span>View all submissions</span>
            <ArrowRight className="w-3 h-3 group-hover:translate-x-1 transition-transform" />
          </p>
        </Link>

        {/* Card 2: Pending Action */}
        <Link
          to="/admin/applications"
          className="bg-white p-6 rounded-2xl border border-amber-200/80 shadow-sm hover:shadow-md transition-all hover:border-amber-300 group bg-amber-50/30"
        >
          <div className="flex items-center justify-between">
            <span className="text-xs text-amber-800 font-bold uppercase tracking-wider">Pending Action</span>
            <div className="w-10 h-10 rounded-xl bg-amber-100 text-amber-700 flex items-center justify-center group-hover:scale-110 transition-transform">
              <Clock className="w-5 h-5" />
            </div>
          </div>
          <div className="text-3xl font-black text-amber-950 mt-3">{pendingTotal}</div>
          <p className="text-[11px] text-amber-700 font-semibold mt-2">
            Awaiting verification & review
          </p>
        </Link>

        {/* Card 3: Completed */}
        <Link
          to="/admin/applications"
          className="bg-white p-6 rounded-2xl border border-emerald-200/80 shadow-sm hover:shadow-md transition-all hover:border-emerald-300 group bg-emerald-50/30"
        >
          <div className="flex items-center justify-between">
            <span className="text-xs text-emerald-800 font-bold uppercase tracking-wider">Completed</span>
            <div className="w-10 h-10 rounded-xl bg-emerald-100 text-emerald-700 flex items-center justify-center group-hover:scale-110 transition-transform">
              <CheckCircle2 className="w-5 h-5" />
            </div>
          </div>
          <div className="text-3xl font-black text-emerald-950 mt-3">{completedTotal}</div>
          <p className="text-[11px] text-emerald-700 font-semibold mt-2">
            Successfully processed
          </p>
        </Link>

        {/* Card 4: Documents Attached */}
        <Link
          to="/admin/documents"
          className="bg-white p-6 rounded-2xl border border-purple-200/80 shadow-sm hover:shadow-md transition-all hover:border-purple-300 group bg-purple-50/30"
        >
          <div className="flex items-center justify-between">
            <span className="text-xs text-purple-800 font-bold uppercase tracking-wider">Attached Proofs</span>
            <div className="w-10 h-10 rounded-xl bg-purple-100 text-purple-700 flex items-center justify-center group-hover:scale-110 transition-transform">
              <FolderArchive className="w-5 h-5" />
            </div>
          </div>
          <div className="text-3xl font-black text-purple-950 mt-3">{stats?.totalDocuments || 1}</div>
          <p className="text-[11px] text-purple-700 font-semibold mt-2 flex items-center gap-1">
            <span>Inspect repository</span>
            <ArrowRight className="w-3 h-3 group-hover:translate-x-1 transition-transform" />
          </p>
        </Link>

      </div>

      {/* Quick Action Navigation Hub */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <Link
          to="/admin/applications"
          className="p-4 bg-white rounded-2xl border border-slate-200 shadow-xs flex items-center gap-3 hover:bg-slate-50 transition-colors"
        >
          <div className="w-10 h-10 rounded-xl bg-indigo-600 text-white flex items-center justify-center font-bold">
            <FileText className="w-5 h-5" />
          </div>
          <div>
            <p className="text-sm font-bold text-slate-900">Manage Applications</p>
            <p className="text-[11px] text-slate-500">Update status and review forms</p>
          </div>
        </Link>

        <Link
          to="/admin/documents"
          className="p-4 bg-white rounded-2xl border border-slate-200 shadow-xs flex items-center gap-3 hover:bg-slate-50 transition-colors"
        >
          <div className="w-10 h-10 rounded-xl bg-indigo-600 text-white flex items-center justify-center font-bold">
            <FolderArchive className="w-5 h-5" />
          </div>
          <div>
            <p className="text-sm font-bold text-slate-900">Document Repository</p>
            <p className="text-[11px] text-slate-500">View & download uploaded files</p>
          </div>
        </Link>

        <Link
          to="/admin/appointments"
          className="p-4 bg-white rounded-2xl border border-slate-200 shadow-xs flex items-center gap-3 hover:bg-slate-50 transition-colors"
        >
          <div className="w-10 h-10 rounded-xl bg-indigo-600 text-white flex items-center justify-center font-bold">
            <Calendar className="w-5 h-5" />
          </div>
          <div>
            <p className="text-sm font-bold text-slate-900">Assistance Appointments</p>
            <p className="text-[11px] text-slate-500">Schedule & manage consultations</p>
          </div>
        </Link>
      </div>

      {/* Recent Applications Table */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden p-6 space-y-4">
        <div className="flex items-center justify-between border-b border-slate-100 pb-3">
          <h2 className="text-lg font-bold text-slate-900">Recent Applications</h2>
          <Link
            to="/admin/applications"
            className="text-xs font-bold text-indigo-600 hover:text-indigo-700 flex items-center gap-1"
          >
            <span>View All Applications</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        {recentApps.length === 0 ? (
          <div className="py-8 text-center text-xs text-slate-400">
            No recent applications found.
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs text-slate-700">
              <thead className="bg-slate-50 text-slate-400 uppercase font-bold text-[10px] tracking-wider">
                <tr>
                  <th className="p-3">Reference ID</th>
                  <th className="p-3">Applicant</th>
                  <th className="p-3">Service</th>
                  <th className="p-3">Status</th>
                  <th className="p-3 text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 font-medium">
                {recentApps.map((app) => (
                  <tr key={app.id || app.applicationId} className="hover:bg-slate-50">
                    <td className="p-3 font-mono font-bold text-indigo-600">
                      {app.applicationId}
                    </td>
                    <td className="p-3 font-bold text-slate-800">
                      {app.fullName}
                    </td>
                    <td className="p-3 text-slate-700 font-medium">
                      {app.serviceTitle}
                    </td>
                    <td className="p-3">
                      <span className={`px-2.5 py-1 rounded-full border text-[10px] font-bold ${
                        statusBadges[app.status]?.color || 'bg-slate-100 text-slate-800'
                      }`}>
                        {statusBadges[app.status]?.label || app.status}
                      </span>
                    </td>
                    <td className="p-3 text-right">
                      <Link
                        to={`/admin/applications/${app.applicationId}`}
                        className="text-xs font-bold text-indigo-600 hover:text-indigo-800 py-1 px-3 bg-indigo-50 hover:bg-indigo-100 rounded-lg transition-colors inline-flex items-center gap-1"
                      >
                        <Eye className="w-3 h-3" />
                        <span>Details</span>
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

    </div>
  );
};

export default Dashboard;
