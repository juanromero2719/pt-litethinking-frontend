"use client";

import { ReactNode } from "react";
import { usePermissions } from "@/application/auth/usePermissions";

type ProtectedActionProps = {
  permission: boolean;
  fallback?: ReactNode;
  children: ReactNode;
};

export default function ProtectedAction({
  permission,
  fallback = null,
  children,
}: ProtectedActionProps) {
  if (!permission) {
    return <>{fallback}</>;
  }

  return <>{children}</>;
}
