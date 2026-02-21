"use client";
import React from "react";
import { usePermission } from "../../context/PermissionContext";

type Props = {
  permission: string;
  children: React.ReactNode;
  hide?: boolean; // when true hide, otherwise render disabled
};

export function PermissionGate({ permission, children, hide = true }: Props) {
  const { can } = usePermission();
  const allowed = can(permission);
  if (!allowed && hide) return null;
  if (!allowed && !hide) {
    // render children disabled where possible
    return <span aria-hidden="true" style={{ opacity: 0.5 }}>{children}</span>;
  }
  return <>{children}</>;
}
