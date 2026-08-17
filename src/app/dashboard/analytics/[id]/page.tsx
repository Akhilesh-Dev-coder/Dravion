import React from "react";
import AnalyticsClient from "./AnalyticsClient";

interface AnalyticsPageProps {
  params: Promise<{ id: string }>;
}

export default async function AnalyticsPage({ params }: AnalyticsPageProps) {
  const { id } = await params;
  
  return <AnalyticsClient cardId={id} />;
}
