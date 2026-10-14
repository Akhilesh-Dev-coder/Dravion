/**
 * AdBlockGuardWrapper
 *
 * A minimal client component that allows the server-only study layout to
 * mount AdBlockGuard (which requires browser APIs) without turning the
 * entire layout into a client component.
 *
 * Usage: import this in the study layout server component.
 */
"use client";

import React from "react";
import AdBlockGuard from "./AdBlockGuard";

export default function AdBlockGuardWrapper({
  children,
}: {
  children: React.ReactNode;
}) {
  return <AdBlockGuard>{children}</AdBlockGuard>;
}
