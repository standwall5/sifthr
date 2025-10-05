"use client";
import { useParams, useRouter } from "next/navigation";
import { useEffect } from "react";
import Image from "next/image";

export default function ModuleRedirectPage() {
  const { moduleId } = useParams();
  const router = useRouter();

  useEffect(() => {
    // Redirect to position 1 by default
    router.replace(`/learning-modules/${moduleId}/1`);
  }, [moduleId, router]);

  return (
    <div className="module-container">
      <Image
        src="/assets/images/loading.gif"
        alt="loading"
        width={64}
        height={64}
      />
    </div>
  );
}
