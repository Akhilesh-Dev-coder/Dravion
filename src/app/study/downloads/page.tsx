import React from "react";
import Link from "next/link";
import dbConnect from "@/lib/mongodb";
import StudyMaterial from "@/models/study/StudyMaterial";
import { Download, FileText, ArrowRight } from "lucide-react";

export const revalidate = 60;

export default async function DownloadsPage() {
  await dbConnect();

  const downloadedMaterials = await StudyMaterial.find({ published: true, downloadCount: { $gt: 0 } })
    .populate("subjectId", "name code slug")
    .populate("chapterId", "name chapterNumber slug")
    .sort({ downloadCount: -1 })
    .limit(20)
    .lean();

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8 bg-slate-50 text-slate-900 min-h-screen">
      <div className="border-b border-slate-200 pb-6 space-y-2">
        <div className="inline-flex items-center space-x-2 px-3 py-1 bg-emerald-50 border border-emerald-200 text-emerald-800 rounded-lg text-xs font-bold">
          <Download className="w-3.5 h-3.5 text-emerald-600" />
          <span>Offline Study Vault</span>
        </div>
        <h1 className="text-3xl font-extrabold text-slate-900">Downloaded Study Materials</h1>
        <p className="text-sm text-slate-600 font-medium">Popular materials downloaded by students for exam preparation.</p>
      </div>

      {downloadedMaterials.length === 0 ? (
        <div className="p-12 text-center bg-white border border-slate-200 rounded-2xl text-slate-500 space-y-3 shadow-sm">
          <Download className="w-12 h-12 text-slate-400 mx-auto" />
          <h3 className="text-base font-bold text-slate-900">No Downloads Tracked Yet</h3>
          <p className="text-xs max-w-sm mx-auto font-medium">
            When you download notes or question papers, they will be listed here for quick retrieval.
          </p>
          <Link
            href="/study/semesters"
            className="inline-flex items-center space-x-2 bg-blue-600 hover:bg-blue-700 text-white text-xs font-extrabold px-5 py-2.5 rounded-xl transition-all shadow-md shadow-blue-500/20"
          >
            <span>Browse Subjects</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {downloadedMaterials.map((mat: any) => (
            <div
              key={mat._id.toString()}
              className="bg-white border border-slate-200 p-5 rounded-xl flex items-center justify-between gap-4 shadow-xs"
            >
              <div className="space-y-1.5 min-w-0">
                <div className="flex items-center space-x-2">
                  <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded bg-emerald-50 text-emerald-800 border border-emerald-200">
                    {mat.type}
                  </span>
                  <span className="text-xs text-slate-500 font-medium">
                    {mat.downloadCount} downloads
                  </span>
                </div>
                <h3 className="text-sm font-bold text-slate-900 truncate">{mat.title}</h3>
                <p className="text-xs text-slate-500 truncate font-medium">
                  {(mat.subjectId as any)?.name} • {(mat.chapterId as any)?.name}
                </p>
              </div>

              <a
                href={`/api/study/pdf-proxy?url=${encodeURIComponent(mat.fileUrl)}`}
                download
                target="_blank"
                rel="noopener noreferrer"
                className="shrink-0 flex items-center space-x-1.5 bg-blue-600 hover:bg-blue-700 text-white text-xs font-extrabold px-4 py-2 rounded-lg transition-all shadow-md shadow-blue-500/20 cursor-pointer"
              >
                <Download className="w-3.5 h-3.5" />
                <span>Download</span>
              </a>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
