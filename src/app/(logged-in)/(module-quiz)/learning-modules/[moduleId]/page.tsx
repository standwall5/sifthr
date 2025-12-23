"use client";
import { useParams } from "next/navigation";
import ModuleSpecific from "./components/ModuleSpecific";

export default function ModulePage() {
  const { moduleId } = useParams();

  if (!moduleId) {
    return <div>Module not found</div>;
  }

  return <ModuleSpecific id={moduleId as string} />;
}
