"use client";
import { AdminLayout } from "../../src/components/layout/AdminLayout";
import { usePermission } from "../../src/context/PermissionContext";
import { useTranslation } from "../../src/lib/i18n";

export default function AdminPage() {
  const { can } = usePermission();
  const { t } = useTranslation();

  return (
    <AdminLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">{t.admin.welcomeTitle}</h1>
          <p className="text-gray-600 mt-2">{t.admin.welcomeSubtitle}</p>
        </div>

        {/* Quick Links */}
        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">{t.admin.quickActions}</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {can("user.manage") && <ActionLink href="/admin/users" label={t.admin.manageUsers} icon="👥" />}
            {can("role.manage") && <ActionLink href="/admin/roles" label={t.admin.manageRoles} icon="🔐" />}
            {can("blog.read") && <ActionLink href="/admin/blogs" label={t.admin.manageBlogs} icon="📝" />}
            {can("news.read") && <ActionLink href="/admin/news" label={t.admin.manageNews} icon="📰" />}
          </div>
        </div>
      </div>
    </AdminLayout>
  );
}

function StatCard({ title, value, icon }: { title: string; value: string; icon: string }) {
  return (
    <div className="bg-white rounded-lg shadow p-6">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm text-gray-600">{title}</p>
          <p className="text-3xl font-bold text-gray-900 mt-1">{value}</p>
        </div>
        <div className="text-4xl">{icon}</div>
      </div>
    </div>
  );
}

function ActionLink({ href, label, icon }: { href: string; label: string; icon: string }) {
  return (
    <a
      href={href}
      className="p-4 border border-gray-200 rounded-lg hover:border-blue-500 hover:bg-blue-50 transition"
    >
      <div className="text-2xl mb-2">{icon}</div>
      <p className="text-sm font-medium text-gray-900">{label}</p>
    </a>
  );
}
