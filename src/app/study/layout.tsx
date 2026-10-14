import React from "react";
import type { Metadata } from "next";
import StudyNavbar from "@/components/study/StudyNavbar";
import StudyFooter from "@/components/study/StudyFooter";
import AdBlockGuardWrapper from "@/components/study/AdBlockGuardWrapper";

export const metadata: Metadata = {
  title: {
    default: "Dravion Study | Semester Notes & Question Papers",
    template: "%s | Dravion Study",
  },
  description: "Study smarter. Prepare better. High quality notes, previous year question papers, MCQs, and important questions for semester exams.",
  keywords: [
    "Dravion Study",
    "semester notes",
    "previous year question papers",
    "BSc Computer Science notes",
    "important questions",
    "MCQs",
    "Java programming notes",
    "exam preparation",
  ],
  alternates: {
    canonical: "/study",
  },
  openGraph: {
    title: "Dravion Study | Study Smarter, Prepare Better",
    description: "Notes, previous year questions, and revision resources for semester exams.",
    url: "https://www.dravion.site/study",
    siteName: "Dravion Study",
    type: "website",
  },
};

export default function StudyLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex flex-col min-h-screen bg-slate-50 text-slate-900 font-sans selection:bg-blue-600 selection:text-white">
      <StudyNavbar />
      {/*
        AdBlockGuardWrapper is scoped to <main> only.
        StudyNavbar and StudyFooter remain interactive even when the overlay
        is visible, so a visitor can navigate away if they choose to.
      */}
      <AdBlockGuardWrapper>
        <main className="flex-grow">{children}</main>
      </AdBlockGuardWrapper>
      <StudyFooter />
    </div>
  );
}
