import React from "react";
import { notFound } from "next/navigation";
import dbConnect from "@/lib/mongodb";
import Semester from "@/models/study/Semester";
import Subject from "@/models/study/Subject";
import Chapter from "@/models/study/Chapter";
import StudyMaterial from "@/models/study/StudyMaterial";
import MCQ from "@/models/study/MCQ";
import Question from "@/models/study/Question";
import ChapterViewClient from "./ChapterViewClient";

export const revalidate = 60;

export default async function ChapterDetailsPage({
  params,
  searchParams,
}: {
  params: Promise<{ semesterId: string; subjectId: string; chapterId: string }>;
  searchParams: Promise<{ material?: string }>;
}) {
  const { semesterId, subjectId, chapterId } = await params;
  const { material: materialParam } = await searchParams;
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

  let chapter = await Chapter.findOne({
    subjectId: subject._id,
    slug: chapterId,
    published: true,
  }).lean();
  if (!chapter && chapterId.match(/^[0-9a-fA-F]{24}$/)) {
    chapter = await Chapter.findById(chapterId).lean();
  }

  const materials = await StudyMaterial.find({
    subjectId: subject._id,
    published: true,
  }).lean();

  let initialMaterial = materials.find((m: any) => m._id.toString() === materialParam);
  if (!initialMaterial) {
    if (chapter) {
      initialMaterial = materials.find(
        (m: any) => m.chapterId && m.chapterId.toString() === chapter!._id.toString()
      );
    }
    if (!initialMaterial && materials.length > 0) {
      initialMaterial = materials[0];
    }
  }

  // Fetch chapter MCQs and Questions
  const [mcqs, questions] = await Promise.all([
    MCQ.find({ subjectId: subject._id, published: true }).lean(),
    Question.find({ subjectId: subject._id, published: true }).lean(),
  ]);

  const formattedMCQs = mcqs.map((m: any) => ({
    id: m._id.toString(),
    question: m.question,
    options: m.options,
    correctAnswer: m.correctAnswer,
    explanation: m.explanation,
    difficulty: m.difficulty,
  }));

  return (
    <ChapterViewClient
      semester={JSON.parse(JSON.stringify(semester))}
      subject={JSON.parse(JSON.stringify(subject))}
      chapter={chapter ? JSON.parse(JSON.stringify(chapter)) : null}
      materials={JSON.parse(JSON.stringify(materials))}
      initialMaterial={initialMaterial ? JSON.parse(JSON.stringify(initialMaterial)) : null}
      formattedMCQs={JSON.parse(JSON.stringify(formattedMCQs))}
      questions={JSON.parse(JSON.stringify(questions))}
    />
  );
}
