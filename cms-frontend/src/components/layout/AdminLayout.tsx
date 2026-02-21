"use client";
import React from "react";
import Link from "next/link";
import { useAuth } from "../../context/AuthContext";
import { usePermission } from "../../context/PermissionContext";
import { useLanguage } from "../../context/LanguageContext";
import { useTranslation } from "../../lib/i18n";

export function AdminLayout({ children }: { children: React.ReactNode }) {
  const { user, loading, logout } = useAuth();
  const { can } = usePermission();
  const { language, setLanguage, dir } = useLanguage();
  const { t } = useTranslation();
  const router = require("next/navigation").useRouter();
  
  React.useEffect(() => {
    console.log("[AdminLayout] Auth state - loading:", loading, "user:", user ? "yes" : "no");
    if (!loading && !user) {
      console.log("[AdminLayout] Redirecting to login - no authenticated user");
      router.replace("/admin/login");
    }
  }, [loading, user, router]);

  if (loading) {
    return <div className="min-h-screen flex items-center justify-center">Loading...</div>;
  }

  if (!user) {
    return null;
  }

  return (
    <div className="min-h-screen flex bg-gray-50">
      <aside className="w-64 bg-slate-900 text-white p-6 shadow-lg">
        {/* Logo/Title */}
        <div className="mb-8 pb-6 border-b border-slate-700">
          <h1 className="text-xl font-bold text-white">{t.admin.cmsAdmin}</h1>
          <p className="text-sm text-slate-400 mt-1">{t.admin.contentManagement}</p>
        </div>

        {/* User Info */}
        <div className="mb-8 p-3 bg-slate-800 rounded">
          <div className="font-medium text-white text-sm">{user?.email || "User"}</div>
          <div className="text-xs text-slate-400 mt-1">{(user as any)?.roles?.join?.(", ") || "User"}</div>
        </div>

        {/* Navigation */}
        <nav className="space-y-2 mb-8">
          {can("user.manage") && <NavLink href="/admin/users" label={t.admin.users} />}
          {can("role.manage") && <NavLink href="/admin/roles" label={t.admin.roles} />}
          {can("permission.manage") && <NavLink href="/admin/permissions" label={t.admin.permissions} />}
          {can("blog.read") && <NavLink href="/admin/blogs" label={t.admin.blogs} />}
          {can("news.read") && <NavLink href="/admin/news" label={t.admin.news} />}
        </nav>

        {/* Divider */}
        <div className="border-t border-slate-700 pt-4 space-y-3">
          
          <button
            onClick={logout}
            className="w-full text-left px-3 py-2 text-sm text-slate-300 hover:bg-slate-800 hover:text-red-400 rounded transition"
          >
            {t.admin.logout}
          </button>
        </div>
      </aside>

      <main className="flex-1">
        <header className="bg-white border-b border-gray-200 px-6 py-4 shadow-sm flex justify-between items-center">
          <h2 className="text-2xl font-bold text-gray-900">{t.admin.dashboard}</h2>
          <div className="flex gap-2">
            <button
              onClick={() => setLanguage("en")}
              className={`px-3 py-2 rounded text-sm font-medium transition ${
                language === "en" ? "bg-blue-500 text-white" : "bg-gray-200 text-gray-700 hover:bg-gray-300"
              }`}
            >
              English
            </button>
            <button
              onClick={() => setLanguage("ar")}
              className={`px-3 py-2 rounded text-sm font-medium transition ${
                language === "ar" ? "bg-blue-500 text-white" : "bg-gray-200 text-gray-700 hover:bg-gray-300"
              }`}
            >
              العربية
            </button>
          </div>
        </header>
        <div className="p-6">{children}</div>
      </main>
    </div>
  );
}

function NavLink({ href, label }: { href: string; label: string }) {
  return (
    <Link
      href={href}
      className="block px-3 py-2 text-sm text-slate-300 hover:bg-slate-800 hover:text-white rounded transition"
    >
      {label}
    </Link>
  );
}
