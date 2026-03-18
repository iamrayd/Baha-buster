"use client";

import { useState } from "react";
import { Search, Filter, ChevronRight, ChevronDown, Calendar, MapPin, Mail, User, Image as ImageIcon, X, Check } from "lucide-react";
import { FloodReport, ReportStatus, SeverityLevel } from "@/src/types/report";
import { MOCK_REPORTS } from "@/src/data/mockReports";

type FilterTab = "All Reports" | "Pending Verification" | "Approved" | "Disapproved";

const SEVERITY_STYLES: Record<SeverityLevel, { bg: string; text: string; dot: string }> = {
  High: {
    bg: "bg-red-50",
    text: "text-red-700",
    dot: "bg-red-500",
  },
  Medium: {
    bg: "bg-orange-50",
    text: "text-orange-700",
    dot: "bg-orange-500",
  },
  Low: {
    bg: "bg-green-50",
    text: "text-green-700",
    dot: "bg-green-500",
  },
};

const STATUS_STYLES: Record<ReportStatus, { bg: string; text: string }> = {
  Pending: {
    bg: "bg-blue-50",
    text: "text-blue-700",
  },
  Approved: {
    bg: "bg-green-50",
    text: "text-green-700",
  },
  Disapproved: {
    bg: "bg-red-50",
    text: "text-red-700",
  },
};

function formatDateTime(timestamp: string): { time: string; date: string } {
  const date = new Date(timestamp);
  const time = date.toLocaleTimeString("en-US", {
    hour: "2-digit",
    minute: "2-digit",
    hour12: true,
  });
  const dateStr = date.toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
  return { time, date: dateStr };
}

export default function ReportsPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [activeFilter, setActiveFilter] = useState<FilterTab>("All Reports");
  const [reports] = useState<FloodReport[]>(MOCK_REPORTS);
  const [expandedReport, setExpandedReport] = useState<string | null>(null);

  const pendingCount = reports.filter((r) => r.status === "Pending").length;

  const toggleExpand = (reportId: string) => {
    setExpandedReport(expandedReport === reportId ? null : reportId);
  };

  const filteredReports = reports.filter((report) => {
    // Filter by status
    if (activeFilter === "Pending Verification" && report.status !== "Pending") return false;
    if (activeFilter === "Approved" && report.status !== "Approved") return false;
    if (activeFilter === "Disapproved" && report.status !== "Disapproved") return false;

    // Filter by search query
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      return (
        report.user_barangay.toLowerCase().includes(query) ||
        report.user_email.toLowerCase().includes(query) ||
        report.id.toLowerCase().includes(query)
      );
    }

    return true;
  });

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Prediction Verifications</h1>
          <p className="text-gray-500 mt-1 text-sm">
            Compare AI flood predictions against user-submitted ground reports to verify accuracy.
          </p>
        </div>

        {pendingCount > 0 && (
          <div className="flex items-center gap-2 px-4 py-2 bg-orange-50 border border-orange-200 rounded-lg">
            <div className="w-5 h-5 rounded-full bg-orange-100 flex items-center justify-center">
              <span className="text-orange-600 text-xs">⚠</span>
            </div>
            <span className="text-sm font-medium text-orange-800">
              {pendingCount} report{pendingCount !== 1 ? "s" : ""} awaiting review
            </span>
          </div>
        )}
      </div>

      {/* Search and Filter */}
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
          <input
            type="text"
            placeholder="Search barangay, email, or ID..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-4 py-2.5 text-sm border border-gray-200 rounded-lg bg-white focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
        <button className="flex items-center gap-2 px-4 py-2.5 border border-gray-200 rounded-lg bg-white hover:bg-gray-50 transition-colors text-sm font-medium text-gray-700">
          <Filter size={16} />
          <span className="hidden sm:inline">Filter</span>
        </button>
      </div>

      {/* Filter Tabs */}
      <div className="flex gap-2 overflow-x-auto pb-2">
        {(["All Reports", "Pending Verification", "Approved", "Disapproved"] as FilterTab[]).map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveFilter(tab)}
            className={`px-4 py-2 rounded-lg text-sm font-medium whitespace-nowrap transition-colors ${
              activeFilter === tab
                ? "bg-blue-600 text-white"
                : "bg-white text-gray-600 border border-gray-200 hover:bg-gray-50"
            }`}
          >
            {tab}
          </button>
        ))}
      </div>

      {/* Reports Table */}
      <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
        {/* Table Header */}
        <div className="grid grid-cols-[1fr_1.2fr_1fr_1fr_auto] gap-4 px-6 py-4 bg-gray-50 border-b border-gray-200 text-xs font-semibold text-gray-600 uppercase tracking-wide">
          <div className="flex items-center gap-2">
            <Calendar size={14} />
            <span>Date / Time</span>
          </div>
          <div className="flex items-center gap-2">
            <MapPin size={14} />
            <span>Barangay</span>
          </div>
          <div>Severity</div>
          <div>Status</div>
          <div></div>
        </div>

        {/* Table Body */}
        <div className="divide-y divide-gray-100">
          {filteredReports.length === 0 ? (
            <div className="px-6 py-16 text-center">
              <div className="w-12 h-12 rounded-full bg-gray-100 flex items-center justify-center mx-auto mb-3">
                <Search size={20} className="text-gray-400" />
              </div>
              <p className="text-gray-600 font-medium">No reports found</p>
              <p className="text-sm text-gray-400 mt-1">Try adjusting your search or filters</p>
            </div>
          ) : (
            filteredReports.map((report) => {
              const { time, date } = formatDateTime(report.timestamp);
              const severityStyle = SEVERITY_STYLES[report.severity];
              const statusStyle = STATUS_STYLES[report.status];
              const isExpanded = expandedReport === report.id;

              return (
                <div key={report.id} className="border-b border-gray-100 last:border-b-0">
                  {/* Main Row - Clickable */}
                  <div
                    onClick={() => toggleExpand(report.id)}
                    className="grid grid-cols-[1fr_1.2fr_1fr_1fr_auto] gap-4 px-6 py-4 hover:bg-gray-50 transition-colors cursor-pointer group"
                  >
                    {/* Date/Time */}
                    <div>
                      <p className="text-sm font-semibold text-gray-900">{time}</p>
                      <p className="text-xs text-gray-500 mt-0.5">{date}</p>
                    </div>

                    {/* Barangay */}
                    <div>
                      <p className="text-sm font-semibold text-gray-900">{report.user_barangay}</p>
                      <p className="text-xs text-gray-500 mt-0.5">{report.id}</p>
                    </div>

                    {/* Severity */}
                    <div>
                      <span
                        className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold ${severityStyle.bg} ${severityStyle.text}`}
                      >
                        <span className={`w-1.5 h-1.5 rounded-full ${severityStyle.dot}`}></span>
                        {report.severity}
                      </span>
                    </div>

                    {/* Status */}
                    <div>
                      <span
                        className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-semibold ${statusStyle.bg} ${statusStyle.text}`}
                      >
                        {report.status}
                      </span>
                    </div>

                    {/* Arrow */}
                    <div className="flex items-center justify-end">
                      {isExpanded ? (
                        <ChevronDown
                          size={18}
                          className="text-gray-600 transition-colors"
                        />
                      ) : (
                        <ChevronRight
                          size={18}
                          className="text-gray-400 group-hover:text-gray-600 transition-colors"
                        />
                      )}
                    </div>
                  </div>

                  {/* Expanded Details */}
                  {isExpanded && (
                    <div className="px-6 py-6 bg-gray-50 border-t border-gray-200">
                      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                        {/* Left Column - Details */}
                        <div className="space-y-4">
                          <div>
                            <h3 className="text-sm font-semibold text-gray-700 mb-3 flex items-center gap-2">
                              <User size={16} />
                              Report Details
                            </h3>
                            <div className="space-y-3">
                              <div className="flex items-start gap-3">
                                <Mail size={16} className="text-gray-400 mt-0.5 shrink-0" />
                                <div>
                                  <p className="text-xs text-gray-500">Submitted by</p>
                                  <p className="text-sm font-medium text-gray-900">{report.user_email}</p>
                                </div>
                              </div>
                              <div className="flex items-start gap-3">
                                <MapPin size={16} className="text-gray-400 mt-0.5 shrink-0" />
                                <div>
                                  <p className="text-xs text-gray-500">Location</p>
                                  <p className="text-sm font-medium text-gray-900">{report.user_barangay}</p>
                                </div>
                              </div>
                              <div className="flex items-start gap-3">
                                <Calendar size={16} className="text-gray-400 mt-0.5 shrink-0" />
                                <div>
                                  <p className="text-xs text-gray-500">Reported at</p>
                                  <p className="text-sm font-medium text-gray-900">
                                    {time} - {date}
                                  </p>
                                </div>
                              </div>
                            </div>
                          </div>

                          <div>
                            <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-2">
                              Description
                            </h3>
                            <p className="text-sm text-gray-700 leading-relaxed">
                              {report.description}
                            </p>
                          </div>

                          {/* Action Buttons - Only show for Pending reports */}
                          {report.status === "Pending" && (
                            <div className="flex gap-3 pt-2">
                              <button className="flex items-center gap-2 px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg text-sm font-medium transition-colors">
                                <Check size={16} />
                                Approve
                              </button>
                              <button className="flex items-center gap-2 px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg text-sm font-medium transition-colors">
                                <X size={16} />
                                Disapprove
                              </button>
                            </div>
                          )}
                        </div>

                        {/* Right Column - Photos */}
                        <div>
                          <h3 className="text-sm font-semibold text-gray-700 mb-3 flex items-center gap-2">
                            <ImageIcon size={16} />
                            Submitted Photos ({report.photos.length})
                          </h3>
                          {report.photos.length === 0 ? (
                            <div className="bg-white rounded-lg border-2 border-dashed border-gray-200 p-8 text-center">
                              <ImageIcon size={32} className="text-gray-300 mx-auto mb-2" />
                              <p className="text-sm text-gray-500">No photos submitted</p>
                            </div>
                          ) : (
                            <div className="grid grid-cols-2 gap-3">
                              {report.photos.map((photo, index) => (
                                <div
                                  key={index}
                                  className="aspect-square rounded-lg overflow-hidden border border-gray-200 bg-gray-100"
                                >
                                  <img
                                    src={photo}
                                    alt={`Report photo ${index + 1}`}
                                    className="w-full h-full object-cover hover:scale-105 transition-transform cursor-pointer"
                                  />
                                </div>
                              ))}
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              );
            })
          )}
        </div>
      </div>
    </div>
  );
}