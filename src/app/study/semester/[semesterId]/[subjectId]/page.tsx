import React from "react";
import { notFound } from "next/navigation";
import dbConnect from "@/lib/mongodb";
import Semester from "@/models/study/Semester";
import Subject from "@/models/study/Subject";
import Chapter from "@/models/study/Chapter";
import Question from "@/models/study/Question";
import StudyMaterial from "@/models/study/StudyMaterial";
import SubjectViewClient from "./SubjectViewClient";

export const revalidate = 60;

export default async function SubjectDetailsPage({
  params,
  searchParams,
}: {
  params: Promise<{ semesterId: string; subjectId: string }>;
  searchParams: Promise<{ material?: string; module?: string }>;
}) {
  const { semesterId, subjectId } = await params;
  const { material: materialParam, module: moduleParam } = await searchParams;
  await dbConnect();

  let semester = await Semester.findOne({ slug: semesterId, published: true }).lean();
  if (!semester && semesterId.match(/^[0-9a-fA-F]{24}$/)) {
    semester = await Semester.findById(semesterId).lean();
  }
  if (!semester) {
    const num = parseInt(semesterId.replace("semester-", ""));
    if (!isNaN(num)) semester = await Semester.findOne({ number: num }).lean();
  }

  if (!semester) notFound();

  let subject = await Subject.findOne({
    semesterId: semester._id,
    slug: subjectId,
    published: true,
  }).lean();

  if (!subject && subjectId.match(/^[0-9a-fA-F]{24}$/)) {
    subject = await Subject.findById(subjectId).lean();
  }

  if (!subject) notFound();

  const [chapters, studyMaterials, importantQuestions, pyqPapers] = await Promise.all([
    Chapter.find({ subjectId: subject._id, published: true }).sort({ chapterNumber: 1 }).lean(),
    StudyMaterial.find({ subjectId: subject._id, published: true, type: { $ne: "question-paper" } })
      .sort({ createdAt: 1 })
      .lean(),
    Question.find({ subjectId: subject._id, published: true }).lean(),
    StudyMaterial.find({ subjectId: subject._id, type: "question-paper", published: true })
      .sort({ year: -1 })
      .lean(),
  ]);

  // Combine StudyMaterials and Chapters into simple Modules (1 PDF per Module)
  let modulesList: any[] = [];

  if (studyMaterials.length > 0) {
    modulesList = studyMaterials;
  } else if (chapters.length > 0) {
    modulesList = chapters;
  }

  // Find requested initial module if specified in URL query
  let initialModule = modulesList[0] || null;
  if (materialParam || moduleParam) {
    const targetId = materialParam || moduleParam;
    const found = modulesList.find((m) => m._id.toString() === targetId);
    if (found) initialModule = found;
  }

  return (
    <SubjectViewClient
      semester={semester}
      subject={subject}
      modules={modulesList}
      initialModule={initialModule}
      pyqPapers={pyqPapers}
      importantQuestions={importantQuestions}
    />
  );
}
