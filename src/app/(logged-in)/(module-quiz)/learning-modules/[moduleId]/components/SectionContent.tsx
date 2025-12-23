import type { ModuleSection } from "@/lib/models/types";

type SectionContentProps = {
  section: ModuleSection;
};

export default function SectionContent({ section }: SectionContentProps) {
  return (
    <>
      <h2>{section.title}</h2>
      <p>{section.content}</p>
      {section.media_url && <img src={section.media_url} alt={section.title} />}
    </>
  );
}
