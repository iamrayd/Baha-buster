"use client";

import { useEffect, useState } from "react";
import { useAuth } from "@/src/contexts/AuthContext";
import { getAllUsers, deleteUser, updateUser, User } from "@/src/services/api";
import { Loader2, Search, Edit2, Trash2, AlertCircle, X } from "lucide-react";
import { createPortal } from "react-dom";

export default function UsersPage() {
  const { user: currentUser } = useAuth();
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [isMounted, setIsMounted] = useState(false);

  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [editingUser, setEditingUser] = useState<User | null>(null);

  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [deletingUserId, setDeletingUserId] = useState<number | null>(null);

  const [editFormData, setEditFormData] = useState({ name: "", email: "", password: "" });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [resultModal, setResultModal] = useState<{ type: "success" | "error", title: string, message: string } | null>(null);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  const fetchUsers = async () => {
    try {
      setLoading(true);
      const allUsers = await getAllUsers();
      // Only show users in the same barangay and with role USER
      const filtered = allUsers.filter(u =>
        u.barangay?.toLowerCase() === currentUser?.barangay?.toLowerCase() &&
        u.role?.toUpperCase() === "USER"
      );
      setUsers(filtered);
      setError(null);
    } catch (err: any) {
      setError(err.message || "Failed to load users.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (currentUser?.barangay) {
      fetchUsers();
    }
  }, [currentUser]);

  const handleEditClick = (user: User) => {
    setEditingUser(user);
    setEditFormData({ name: user.name, email: user.email, password: "" });
    setIsEditModalOpen(true);
  };

  const handleDeleteClick = (userId: number) => {
    setDeletingUserId(userId);
    setIsDeleteModalOpen(true);
  };

  const handleEditSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingUser) return;

    setIsSubmitting(true);
    try {
      const payload: Partial<User & { password?: string }> = {
        name: editFormData.name,
        email: editFormData.email,
      };
      if (editFormData.password.trim() !== "") {
        payload.password = editFormData.password;
      }

      await updateUser(editingUser.user_id, payload);
      setIsEditModalOpen(false);
      setEditingUser(null);
      await fetchUsers();
      setResultModal({ type: "success", title: "Success", message: "User updated successfully!" });
    } catch (err: any) {
      setIsEditModalOpen(false);
      setResultModal({ type: "error", title: "Update Failed", message: err.message || "Failed to update user." });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleConfirmDelete = async () => {
    if (!deletingUserId) return;
    setIsSubmitting(true);
    try {
      await deleteUser(deletingUserId);
      setIsDeleteModalOpen(false);
      setDeletingUserId(null);
      await fetchUsers();
      setResultModal({ type: "success", title: "Success", message: "User deleted successfully!" });
    } catch (err: any) {
      setIsDeleteModalOpen(false);
      setResultModal({ type: "error", title: "Delete Failed", message: err.message || "Failed to delete user." });
    } finally {
      setIsSubmitting(false);
    }
  };

  const filteredUsers = users.filter((u) =>
    u.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    u.email.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="space-y-6 w-full pb-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 tracking-tight">User Management</h1>
          <p className="text-sm text-gray-500 mt-1">
            Manage users within your barangay {currentUser?.barangay || "..."}.
          </p>
        </div>
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
          <input
            type="text"
            placeholder="Search users..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-9 pr-4 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent w-full sm:w-64"
          />
        </div>
      </div>

      {error && (
        <div className="bg-red-50 border border-red-100 text-red-700 p-4 rounded-xl flex items-center gap-3 text-sm">
          <AlertCircle className="w-5 h-5 shrink-0" />
          <span className="font-medium">{error}</span>
        </div>
      )}

      {/* Table */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm whitespace-nowrap">
            <thead className="bg-gray-50/50 border-b border-gray-100">
              <tr>
                <th className="px-6 py-4 font-semibold text-gray-600">Name</th>
                <th className="px-6 py-4 font-semibold text-gray-600">Email</th>
                <th className="px-6 py-4 font-semibold text-gray-600">Role</th>
                <th className="px-6 py-4 font-semibold text-gray-600">Joined</th>
                <th className="px-6 py-4 font-semibold text-gray-600 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {loading ? (
                <tr>
                  <td colSpan={5} className="px-6 py-12 text-center text-gray-500">
                    <Loader2 className="w-6 h-6 animate-spin mx-auto mb-2 text-blue-500" />
                    Loading users...
                  </td>
                </tr>
              ) : filteredUsers.length === 0 ? (
                <tr>
                  <td colSpan={5} className="px-6 py-12 text-center text-gray-500">
                    No users found matching your search.
                  </td>
                </tr>
              ) : (
                filteredUsers.map((u) => (
                  <tr key={u.user_id} className="hover:bg-gray-50/50 transition-colors">
                    <td className="px-6 py-4 font-medium text-gray-900">{u.name}</td>
                    <td className="px-6 py-4 text-gray-600">{u.email}</td>
                    <td className="px-6 py-4">
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-50 text-blue-700 capitalize">
                        {u.role}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-gray-500">
                      {new Date(u.created_at).toLocaleDateString()}
                    </td>
                    <td className="px-6 py-4 text-right space-x-2">
                      <button
                        onClick={() => handleEditClick(u)}
                        className="p-1.5 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                        title="Edit User"
                      >
                        <Edit2 className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => handleDeleteClick(u.user_id)}
                        disabled={u.user_id === currentUser?.user_id}
                        className="p-1.5 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                        title={u.user_id === currentUser?.user_id ? "Cannot delete yourself" : "Delete User"}
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Edit Modal */}
      {isMounted && isEditModalOpen && createPortal(
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-[9999] flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl shadow-xl w-full max-w-md overflow-hidden">
            <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100">
              <h3 className="text-lg font-bold text-gray-900">Edit User</h3>
              <button
                onClick={() => setIsEditModalOpen(false)}
                className="text-gray-400 hover:text-gray-600 p-1 rounded-lg hover:bg-gray-100 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            <form onSubmit={handleEditSubmit} className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Full Name</label>
                <input
                  type="text"
                  required
                  value={editFormData.name}
                  onChange={(e) => setEditFormData({ ...editFormData, name: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Email Address</label>
                <input
                  type="email"
                  required
                  value={editFormData.email}
                  onChange={(e) => setEditFormData({ ...editFormData, email: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">New Password (Optional)</label>
                <input
                  type="password"
                  placeholder="Leave blank to keep current password"
                  value={editFormData.password}
                  onChange={(e) => setEditFormData({ ...editFormData, password: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div className="pt-4 flex justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setIsEditModalOpen(false)}
                  className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="px-4 py-2 text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 rounded-lg transition-colors disabled:opacity-50 flex items-center gap-2"
                >
                  {isSubmitting && <Loader2 className="w-4 h-4 animate-spin" />}
                  Save Changes
                </button>
              </div>
            </form>
          </div>
        </div>,
        document.body
      )}

      {/* Delete Modal */}
      {isMounted && isDeleteModalOpen && createPortal(
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-[9999] flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl shadow-xl w-full max-w-sm p-6 text-center">
            <div className="w-12 h-12 rounded-full bg-red-100 flex items-center justify-center mx-auto mb-4">
              <AlertCircle className="w-6 h-6 text-red-600" />
            </div>
            <h3 className="text-lg font-bold text-gray-900 mb-2">Delete User?</h3>
            <p className="text-sm text-gray-500 mb-6">
              Are you sure you want to delete this user? This action cannot be undone.
            </p>
            <div className="flex gap-3 justify-center">
              <button
                onClick={() => setIsDeleteModalOpen(false)}
                className="px-4 py-2 flex-1 text-sm font-medium text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleConfirmDelete}
                disabled={isSubmitting}
                className="px-4 py-2 flex-1 text-sm font-medium text-white bg-red-600 hover:bg-red-700 rounded-lg transition-colors disabled:opacity-50 flex items-center justify-center gap-2"
              >
                {isSubmitting ? <Loader2 className="w-4 h-4 animate-spin" /> : 'Delete'}
              </button>
            </div>
          </div>
        </div>,
        document.body
      )}

      {/* Result Modal */}
      {isMounted && resultModal && createPortal(
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-[99999] flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl shadow-xl w-full max-w-sm p-6 text-center">
            <div className={`w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-4 ${resultModal.type === 'success' ? 'bg-blue-100' : 'bg-red-100'}`}>
              {resultModal.type === 'success' ? (
                <svg className="w-6 h-6 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
              ) : (
                <AlertCircle className="w-6 h-6 text-red-600" />
              )}
            </div>
            <h3 className="text-lg font-bold text-gray-900 mb-2">{resultModal.title}</h3>
            <p className="text-sm text-gray-500 mb-6">{resultModal.message}</p>
            <button
              onClick={() => {
                setResultModal(null);
                setIsEditModalOpen(false);
                setIsDeleteModalOpen(false);
              }}
              className={`w-full py-2.5 px-4 rounded-xl text-sm font-semibold text-white transition-colors ${resultModal.type === 'success' ? 'bg-blue-600 hover:bg-blue-700' : 'bg-red-600 hover:bg-red-700'
                }`}
            >
              Okay
            </button>
          </div>
        </div>,
        document.body
      )}

    </div>
  );
}
