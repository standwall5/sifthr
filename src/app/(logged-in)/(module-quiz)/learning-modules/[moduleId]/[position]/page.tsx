"use client";
import { useParams, useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";
import MarkdownRenderer from "@/app/components/MarkdownRenderer";
import "../../../moduleQuiz.css";

type SectionData = {
  section: {
    position: number;
    title: string;
    content: string;
  };
  totalPages: number;
  error?: string;
};

export default function ModuleSectionPage() {
  const { moduleId, position } = useParams();
  const router = useRouter();
  const [data, setData] = useState<SectionData | null>(null);
  const [loading, setLoading] = useState(true);
  const [complete, setComplete] = useState(false);

  const pos = Number(position) || 1;

  useEffect(() => {
    setLoading(true);
    setComplete(false);
    fetch(`/api/getModuleSection/${moduleId}/${pos}`)
      .then((res) => res.json())
      .then((d: SectionData) => {
        setData(d);
        setLoading(false);
      })
      .catch(() => {
        setLoading(false);
      });
  }, [moduleId, pos]);

  if (loading) return <div>Loading...</div>;
  if (!data) return <div>Failed to load section.</div>;
  if (data.error)
    return (
      <div>
        <h2>{data.error}</h2>
      </div>
    );

  const progress = Math.min(
    100,
    Math.max(0, (data.section.position / data.totalPages) * 100),
  );

  const handleNext = () => {
    if (data.section.position < data.totalPages) {
      router.push(`/learning-modules/${moduleId}/${data.section.position + 1}`);
    }
  };

  const handlePrev = () => {
    if (data.section.position > 1) {
      router.push(`/learning-modules/${moduleId}/${data.section.position - 1}`);
    }
  };

  const handleComplete = () => {
    setComplete(true);
    setTimeout(() => {
      router.push("/learning-modules");
    }, 2000);
  };

  return (
    <div className="module-box">
      <div className="module-details">
        <div className="progress-container">
          <p>
            Page {data.section.position} of {data.totalPages}
          </p>
          <div
            style={{
              width: "50%",
              backgroundColor: "#eee",
              borderRadius: 8,
              height: 25,
              marginBottom: 20,
              boxShadow: "2px 2px 0 rgb(71, 71, 71)",
            }}
          >
            <div
              style={{
                width: `${progress}%`,
                backgroundColor: "rgb(153, 85, 235)",
                height: "100%",
                borderRadius: 8,
                transition: "width 0.3s",
                display: "flex",
                alignItems: "center",
              }}
            >
              <span
                style={{ color: "white", paddingLeft: 10, lineHeight: "25px" }}
              >
                {Math.round(progress)}%
              </span>
            </div>
          </div>
        </div>
        <h2>{data.section.title}</h2>
        <MarkdownRenderer content={data.section.content} />
      </div>
      <div className="nextPrev" style={{ marginTop: 24 }}>
        <button
          className="adeducate-button"
          onClick={handlePrev}
          disabled={data.section.position <= 1}
        >
          Previous
        </button>
        {data.section.position < data.totalPages ? (
          <button className="adeducate-button" onClick={handleNext}>
            Next
          </button>
        ) : !complete ? (
          <button className="adeducate-button" onClick={handleComplete}>
            Complete
          </button>
        ) : null}
      </div>
      {complete && (
        <div
          className="successPlayer"
          style={{
            width: "100%",
            height: "100%",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          {/* Add your Lottie player here */}
        </div>
      )}
    </div>
  );
}
