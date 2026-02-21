"use client";
import React, { createContext, useContext, useMemo } from "react";
import { useAuth } from "./AuthContext";
import { hasPermission } from "../lib/rbac/permissions";

type PermissionContextValue = {
  can: (permissionKey: string) => boolean;
};

const PermissionContext = createContext<PermissionContextValue | undefined>(undefined);

export function PermissionProvider({ children }: { children: React.ReactNode }) {
  const { user } = useAuth();

  const can = useMemo(() => {
    return (permissionKey: string) => {
      return hasPermission(user, permissionKey);
    };
  }, [user]);

  return <PermissionContext.Provider value={{ can }}>{children}</PermissionContext.Provider>;
}

export function usePermission() {
  const ctx = useContext(PermissionContext);
  if (!ctx) throw new Error("usePermission must be used within PermissionProvider");
  return ctx;
}
