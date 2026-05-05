"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";

/**
 * Workspace entry point - redirects to new chat or existing workspace
 *
 * This page handles the initial landing at /workspace
 * - If user has existing threads, show a thread list or redirect to most recent
 * - Otherwise redirect to /workspace/new
 */
export default function WorkspaceEntryPage() {
  const router = useRouter();

  useEffect(() => {
    // Redirect to /workspace/new for new conversation
    // The actual thread creation happens when user sends first message
    router.replace("/workspace/new");
  }, [router]);

  // Loading state while redirecting
  return (
    <div className="h-screen w-screen flex items-center justify-center bg-gradient-to-br from-slate-100 via-slate-50 to-slate-100">
      <div className="flex flex-col items-center gap-4">
        <div className="w-10 h-10 rounded-full border-2 border-orange-500 border-t-transparent animate-spin" />
        <p className="text-slate-500">Loading...</p>
      </div>
    </div>
  );
}