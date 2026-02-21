"use client";
import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "../../context/AuthContext";
import { useTranslation } from "../../lib/i18n";

export function LoginForm() {
  const { login } = useAuth();
  const router = useRouter();
  const { t } = useTranslation();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setLoading(true);
    try {
      console.log("[LoginForm] Attempting login for:", email);
      await login(email, password);
      console.log("[LoginForm] Login successful, refreshing router and redirecting to /admin");
      try {
        router.refresh();
      } catch (e) {
        console.warn("router.refresh() not available", e);
      }
      router.push("/admin");
    } catch (err: any) {
      const errMsg = err?.message || "Login failed";
      console.error("[LoginForm] Login error:", errMsg, err);
      setError(errMsg);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen bg-linear-to-br from-slate-900 via-slate-800 to-slate-900 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-white mb-2">{t.admin.cmsAdmin}</h1>
          <p className="text-slate-400">{t.admin.contentManagementSystem}</p>
        </div>

        {/* Form Card */}
        <form
          onSubmit={handleSubmit}
          className="bg-white rounded-lg shadow-xl p-8 space-y-6"
        >
          <h2 className="text-2xl font-semibold text-gray-900 text-center">
            {t.admin.signIn}
          </h2>

          {/* Error Alert */}
          {error && (
            <div className="p-4 bg-red-50 border border-red-200 rounded text-red-700 text-sm">
              {error}
            </div>
          )}

          {/* Email Input */}
          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-700">
              {t.admin.emailAddress}
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="admin@example.com"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition"
              required
            />
          </div>

          {/* Password Input */}
          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-700">
              {t.admin.password}
            </label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition"
              required
            />
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={loading}
            className="w-full px-4 py-2 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 disabled:bg-blue-400 transition duration-200"
          >
            {loading ? t.admin.signingIn : t.admin.signIn}
          </button>

          {/* Footer */}
          <p className="text-center text-sm text-gray-500">
            {t.admin.demoCredentials}
          </p>
        </form>
      </div>
    </div>
  );
}
