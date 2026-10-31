import React, { useState } from 'react';
import { ShieldCheck, Users, DollarSign, Package, CheckCircle2, AlertCircle, FileText, Scale, RefreshCw } from 'lucide-react';
import { User, FarmerProfile, Product, Order, AdminAuditLog } from '../types';
import { db } from '../services/db';
import { useToast } from './Toast';

interface AdminDashboardProps {
  currentUser: User;
  onViewFarmerProfile: (farmerId: string) => void;
}

export const AdminDashboard: React.FC<AdminDashboardProps> = ({
  currentUser,
  onViewFarmerProfile,
}) => {
  const { success } = useToast();
  const [activeTab, setActiveTab] = useState<'verification' | 'users' | 'fair-price' | 'audit'>('verification');

  const farmers = db.getFarmers();
  const users = db.getUsers();
  const orders = db.getOrders();
  const products = db.getProducts();
  const auditLogs = db.getAuditLogs();

  const totalGMV = orders.reduce((sum, o) => sum + o.total, 0);
  const totalFarmerPayouts = orders.reduce((sum, o) => sum + o.kisanDirectPayout, 0);
  const verifiedFarmsCount = farmers.filter(f => f.isVerified).length;

  const handleToggleVerification = (farmerId: string, currentStatus: boolean) => {
    db.verifyFarmer(farmerId, !currentStatus);
    success(
      'Verification Status Changed',
      `Farmer status set to ${!currentStatus ? 'VERIFIED' : 'PENDING'}. Logged in Mandi Board audit.`
    );
  };

  return (
    <div className="max-w-6xl mx-auto space-y-6 pb-16">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-200 pb-4">
        <div className="flex items-center gap-3">
          <div className="p-3 bg-purple-100 border border-purple-200 rounded-2xl">
            <ShieldCheck className="w-6 h-6 text-purple-800" />
          </div>
          <div>
            <h1 className="text-xl sm:text-2xl font-extrabold font-serif-display text-slate-900">
              Mandi Board & Agricultural Regulatory Console
            </h1>
            <p className="text-xs text-slate-500 mt-0.5">
              APMC Compliance Oversight · Zero-Middleman Audit · Jaivik Bharat Certification Registry
            </p>
          </div>
        </div>

        <span className="text-xs text-purple-800 font-bold bg-purple-50 border border-purple-200 px-3 py-1 rounded-xl">
          Director: Vikramaditya Rao
        </span>
      </div>

      {/* KPI Cards in ₹ */}
      <div className="grid grid-cols-1 sm:grid-cols-4 gap-3.5">
        <div className="bg-white border border-slate-200 p-4 rounded-xl shadow-2xs space-y-1">
          <p className="text-xs text-slate-500 font-semibold">Total GMV (₹)</p>
          <p className="text-2xl font-black font-mono text-slate-900 tabular-nums">
            ₹{totalGMV.toFixed(0)}
          </p>
          <p className="text-[11px] text-slate-400">Across {orders.length} direct orders</p>
        </div>

        <div className="bg-white border border-slate-200 p-4 rounded-xl shadow-2xs space-y-1">
          <p className="text-xs text-slate-500 font-semibold">Direct Kisan Payouts (₹)</p>
          <p className="text-2xl font-black font-mono text-emerald-700 tabular-nums">
            ₹{totalFarmerPayouts.toFixed(0)}
          </p>
          <p className="text-[11px] text-slate-400">85.2% average direct payout</p>
        </div>

        <div className="bg-white border border-slate-200 p-4 rounded-xl shadow-2xs space-y-1">
          <p className="text-xs text-slate-500 font-semibold">Verified Jaivik Farms</p>
          <p className="text-2xl font-black font-mono text-slate-900 tabular-nums">
            {verifiedFarmsCount} / {farmers.length}
          </p>
          <p className="text-[11px] text-slate-400">NPOP & PGS India certified</p>
        </div>

        <div className="bg-white border border-slate-200 p-4 rounded-xl shadow-2xs space-y-1">
          <p className="text-xs text-slate-500 font-semibold">Registered Stakeholders</p>
          <p className="text-2xl font-black font-mono text-slate-900 tabular-nums">
            {users.length}
          </p>
          <p className="text-[11px] text-slate-400">Kisans, Consumers & Mandi staff</p>
        </div>
      </div>

      {/* Segmented Tabs */}
      <div className="flex border-b border-slate-200 gap-4 text-xs font-bold">
        <button
          onClick={() => setActiveTab('verification')}
          className={`pb-3 border-b-2 transition-colors ${
            activeTab === 'verification'
              ? 'border-purple-600 text-purple-800 font-extrabold'
              : 'border-transparent text-slate-500 hover:text-slate-800'
          }`}
        >
          Kisan Verification & NPOP Audits ({farmers.length})
        </button>
        <button
          onClick={() => setActiveTab('users')}
          className={`pb-3 border-b-2 transition-colors ${
            activeTab === 'users'
              ? 'border-purple-600 text-purple-800 font-extrabold'
              : 'border-transparent text-slate-500 hover:text-slate-800'
          }`}
        >
          Stakeholders & Distinct Credentials ({users.length})
        </button>
        <button
          onClick={() => setActiveTab('fair-price')}
          className={`pb-3 border-b-2 transition-colors ${
            activeTab === 'fair-price'
              ? 'border-purple-600 text-purple-800 font-extrabold'
              : 'border-transparent text-slate-500 hover:text-slate-800'
          }`}
        >
          Mandi Dalal vs KisanDirect Audit
        </button>
        <button
          onClick={() => setActiveTab('audit')}
          className={`pb-3 border-b-2 transition-colors ${
            activeTab === 'audit'
              ? 'border-purple-600 text-purple-800 font-extrabold'
              : 'border-transparent text-slate-500 hover:text-slate-800'
          }`}
        >
          System Audit Logs ({auditLogs.length})
        </button>
      </div>

      {/* Tab 1: Verification */}
      {activeTab === 'verification' && (
        <div className="bg-white border border-slate-200 rounded-2xl overflow-hidden shadow-xs">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs text-slate-700">
              <thead className="bg-slate-50 border-b border-slate-200 text-[11px] uppercase tracking-wider text-slate-500 font-bold">
                <tr>
                  <th className="py-3 px-4">Kisan Farm</th>
                  <th className="py-3 px-4">Acreage & Soil</th>
                  <th className="py-3 px-4">Certificates</th>
                  <th className="py-3 px-4">Status</th>
                  <th className="py-3 px-4 text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {farmers.map(farmer => (
                  <tr key={farmer.id} className="hover:bg-slate-50 transition-colors">
                    <td className="py-3 px-4">
                      <div className="flex items-center gap-3">
                        <img
                          src={farmer.avatarImage}
                          alt={farmer.farmName}
                          referrerPolicy="no-referrer"
                          className="w-10 h-10 rounded-xl object-cover bg-slate-100 shrink-0 border border-slate-200"
                        />
                        <div>
                          <p className="font-bold text-slate-800">{farmer.farmName}</p>
                          <p className="text-[10px] text-slate-400">{farmer.city}, {farmer.state}</p>
                        </div>
                      </div>
                    </td>
                    <td className="py-3 px-4">
                      <p className="font-semibold text-slate-800">{farmer.acreage} Acres</p>
                      <p className="text-[10px] text-slate-500">{farmer.soilType}</p>
                    </td>
                    <td className="py-3 px-4">
                      {farmer.certifications.map(c => (
                        <div key={c.id} className="text-[11px] text-slate-600 flex items-center gap-1">
                          <span className="text-emerald-700 font-bold">✓</span>
                          <span>{c.name}</span>
                        </div>
                      ))}
                    </td>
                    <td className="py-3 px-4">
                      {farmer.isVerified ? (
                        <span className="px-2.5 py-0.5 rounded bg-emerald-100 text-emerald-800 font-bold text-[10px]">
                          ✓ Verified
                        </span>
                      ) : (
                        <span className="px-2.5 py-0.5 rounded bg-amber-100 text-amber-800 font-bold text-[10px]">
                          Pending Audit
                        </span>
                      )}
                    </td>
                    <td className="py-3 px-4 text-right">
                      <button
                        onClick={() => handleToggleVerification(farmer.id, farmer.isVerified)}
                        className={`px-3 py-1 rounded-lg font-bold text-xs ${
                          farmer.isVerified
                            ? 'bg-slate-100 hover:bg-rose-100 text-slate-700 hover:text-rose-700'
                            : 'bg-emerald-700 hover:bg-emerald-800 text-white'
                        }`}
                      >
                        {farmer.isVerified ? 'Revoke Status' : 'Approve Farm'}
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Tab 2: Users & Distinct Credentials */}
      {activeTab === 'users' && (
        <div className="bg-white border border-slate-200 rounded-2xl overflow-hidden shadow-xs">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs text-slate-700">
              <thead className="bg-slate-50 border-b border-slate-200 text-[11px] uppercase tracking-wider text-slate-500 font-bold">
                <tr>
                  <th className="py-3 px-4">Stakeholder</th>
                  <th className="py-3 px-4">Email ID (Login Credential)</th>
                  <th className="py-3 px-4">Role</th>
                  <th className="py-3 px-4">Salted SHA-256 Hash</th>
                  <th className="py-3 px-4">Joined Date</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {users.map(u => (
                  <tr key={u.id} className="hover:bg-slate-50 transition-colors">
                    <td className="py-3 px-4 font-bold text-slate-800">{u.name}</td>
                    <td className="py-3 px-4 font-mono text-emerald-800 font-semibold">{u.email}</td>
                    <td className="py-3 px-4">
                      <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase ${
                        u.role === 'admin'
                          ? 'bg-purple-100 text-purple-800'
                          : u.role === 'farmer'
                          ? 'bg-amber-100 text-amber-800'
                          : 'bg-emerald-100 text-emerald-800'
                      }`}>
                        {u.role}
                      </span>
                    </td>
                    <td className="py-3 px-4 font-mono text-[10px] text-slate-400">
                      {u.passwordHash.substring(0, 16)}...
                    </td>
                    <td className="py-3 px-4 text-slate-500">{new Date(u.createdAt).toLocaleDateString()}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Tab 3: Mandi vs KisanDirect */}
      {activeTab === 'fair-price' && (
        <div className="bg-white border border-slate-200 rounded-2xl p-6 space-y-4 shadow-xs text-xs">
          <h3 className="text-sm font-bold text-slate-900">APMC Mandi vs KisanDirect Direct Settlement Index</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="p-4 bg-emerald-50 rounded-xl border border-emerald-200 space-y-2">
              <p className="font-bold text-emerald-800 text-sm">KisanDirect Direct Model (₹)</p>
              <div className="flex justify-between border-b border-emerald-100 pb-1">
                <span>Direct Farmer Payout:</span>
                <strong className="text-emerald-700 font-mono">85.0%</strong>
              </div>
              <div className="flex justify-between border-b border-emerald-100 pb-1">
                <span>Temperature Cold Van Delivery:</span>
                <span className="font-mono">6.0%</span>
              </div>
              <div className="flex justify-between border-b border-emerald-100 pb-1">
                <span>Jute Breathable Crates:</span>
                <span className="font-mono">4.0%</span>
              </div>
              <div className="flex justify-between">
                <span>Platform Tech & Compliance:</span>
                <span className="font-mono">5.0%</span>
              </div>
            </div>

            <div className="p-4 bg-rose-50 rounded-xl border border-rose-200 space-y-2">
              <p className="font-bold text-rose-800 text-sm">Conventional APMC Mandi Chain (₹)</p>
              <div className="flex justify-between border-b border-rose-100 pb-1">
                <span>Farmer Realisation:</span>
                <strong className="text-rose-700 font-mono">18.0%</strong>
              </div>
              <div className="flex justify-between border-b border-rose-100 pb-1">
                <span>Mandi Dalal / Commission Agent:</span>
                <span className="font-mono">28.0%</span>
              </div>
              <div className="flex justify-between border-b border-rose-100 pb-1">
                <span>Secondary Wholesaler & Freight:</span>
                <span className="font-mono">22.0%</span>
              </div>
              <div className="flex justify-between">
                <span>City Retail Store Markup:</span>
                <span className="font-mono">32.0%</span>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Tab 4: Audit Logs */}
      {activeTab === 'audit' && (
        <div className="bg-white border border-slate-200 rounded-2xl overflow-hidden shadow-xs">
          <div className="divide-y divide-slate-100">
            {auditLogs.map(log => (
              <div key={log.id} className="p-4 flex items-start justify-between gap-3 text-xs">
                <div>
                  <span className="font-mono font-bold text-purple-800 text-[11px] bg-purple-50 px-2 py-0.5 rounded">
                    {log.action}
                  </span>
                  <span className="text-slate-500 ml-2">by <strong>{log.actor}</strong></span>
                  <p className="text-slate-700 mt-1">{log.details}</p>
                </div>
                <span className="text-[10px] text-slate-400 font-mono shrink-0">
                  {new Date(log.timestamp).toLocaleTimeString()}
                </span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
