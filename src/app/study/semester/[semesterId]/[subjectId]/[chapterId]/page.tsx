import { redirect } from "next/navigation";

export default async function ChapterDetailsPage({
  params,
}: {
  params: Promise<{ semesterId: string; subjectId: string; chapterId: string }>;
}) {
  const { semesterId, subjectId } = await params;
  redirect(`/study/semester/${semesterId}/${subjectId}`);
}
