import type { ModuleSection } from "@/lib/models/types";
import Image from "next/image";

type SectionContentProps = {
  section: ModuleSection;
};

export default function SectionContent({ section }: SectionContentProps) {
  // Function to extract YouTube video ID from URL
  const getYouTubeId = (url: string) => {
    const regExp =
      /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|&v=)([^#&?]*).*/;
    const match = url.match(regExp);
    return match && match[2].length === 11 ? match[2] : null;
  };

  // Function to extract Google Drive video ID from URL
  const getGoogleDriveId = (url: string) => {
    // Matches URLs like:
    // https://drive.google.com/file/d/FILE_ID/view
    // https://drive.google.com/open?id=FILE_ID
    const regExp = /\/file\/d\/([^\/]+)|[?&]id=([^&]+)/;
    const match = url.match(regExp);
    return match ? match[1] || match[2] : null;
  };

  // Determine video type and ID
  const getVideoEmbed = (url: string) => {
    if (!url) return null;

    // Check for YouTube
    const youtubeId = getYouTubeId(url);
    if (youtubeId) {
      return {
        type: "youtube",
        embedUrl: `https://www.youtube.com/embed/${youtubeId}`,
      };
    }

    // Check for Google Drive
    if (url.includes("drive.google.com")) {
      const driveId = getGoogleDriveId(url);
      if (driveId) {
        return {
          type: "googledrive",
          embedUrl: `https://drive.google.com/file/d/${driveId}/preview`,
        };
      }
    }

    return null;
  };

  const videoEmbed = section.media_url
    ? getVideoEmbed(section.media_url)
    : null;

  return (
    <>
      <h2>{section.title}</h2>

      {/* Display section image if it exists */}
      {section.image_url && (
        <div style={{ margin: "20px 0", textAlign: "center" }}>
          <Image
            src={section.image_url}
            alt={section.title}
            width={300}
            height={300}
            style={{
              maxWidth: "100%",
              height: "auto",
              borderRadius: "8px",
              objectFit: "contain",
            }}
          />
        </div>
      )}

      {/* Display text content */}
      {section.content && <p>{section.content}</p>}

      {/* Display video if media_url exists */}
      {videoEmbed && (
        <div style={{ margin: "30px auto", maxWidth: "100%" }}>
          <iframe
            src={videoEmbed.embedUrl}
            title={section.title}
            frameBorder="0"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
            style={{
              width: "600px",
              height: "350px",
              display: "block",
              borderRadius: "8px",
              border: "none",
            }}
          />
        </div>
      )}

      {/* Show a message if media_url exists but couldn't be parsed */}
      {section.media_url && !videoEmbed && (
        <div
          style={{
            margin: "20px 0",
            padding: "10px",
            background: "#f0f0f0",
            borderRadius: "8px",
          }}
        >
          <p style={{ margin: 0 }}>
            📹 Video URL provided but format not recognized. Supported: YouTube
            and Google Drive.
          </p>
          <a
            href={section.media_url}
            target="_blank"
            rel="noopener noreferrer"
            style={{ color: "#0070f3" }}
          >
            Open video in new tab →
          </a>
        </div>
      )}
    </>
  );
}
