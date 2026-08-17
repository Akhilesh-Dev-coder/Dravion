import React from "react";
import EditCardClient from "./EditCardClient";

interface EditCardPageProps {
  params: Promise<{ id: string }>;
}

export default async function EditCardPage({ params }: EditCardPageProps) {
  const { id } = await params;
  
  return <EditCardClient cardId={id} />;
}
