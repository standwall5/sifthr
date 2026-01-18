"use client";

import React, { useState, useEffect } from "react";
import Button from "@/app/components/Button/Button";
import Loading from "@/app/components/Loading";
import styles from "./Forms.module.css";
import { supabase } from "@/app/lib/supabaseClient";
import Image from "next/image";
import RichTextEditor from "@/app/components/RichTextEditor/RichTextEditor";
import RichTextRenderer from "@/app/components/RichTextRenderer/RichTextRenderer";

type Module = {
  id: number;
  title: string;
  description: string;
  image_url?: string;
};

type Section = {
  id: number;
  module_id: number;
  title: string;
  content: string;
  media_url: string;
  image_url?: string;
  position: number;
};

export default function ModuleForm() {
  const [modules, setModules] = useState<Module[]>([]);
  const [sections, setSections] = useState<Section[]>([]);
  const [loading, setLoading] = useState(false);
  const [selectedModule, setSelectedModule] = useState<number | null>(null);
  const [uploadingImage, setUploadingImage] = useState(false);

  // Module form state
  const [moduleTitle, setModuleTitle] = useState("");
  const [moduleDescription, setModuleDescription] = useState("");
  const [moduleImageUrl, setModuleImageUrl] = useState("");
  const [moduleImageFile, setModuleImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);

  // Section form state
  const [sectionTitle, setSectionTitle] = useState("");
  const [sectionContent, setSectionContent] = useState("");
  const [mediaUrl, setMediaUrl] = useState("");
  const [mediaType, setMediaType] = useState<"text" | "video">("text");
  const [sectionImageUrl, setSectionImageUrl] = useState("");
  const [sectionImageFile, setSectionImageFile] = useState<File | null>(null);
  const [sectionImagePreview, setSectionImagePreview] = useState<string | null>(
    null,
  );
  const [showMarkdownPreview, setShowMarkdownPreview] = useState(false);

  useEffect(() => {
    fetchModules();
  }, []);

  useEffect(() => {
    if (selectedModule) {
      fetchSections(selectedModule);
    } else {
      setSections([]);
    }
  }, [selectedModule]);

  // Handle MODULE image file selection
  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      // Validate file type
      if (!file.type.startsWith("image/")) {
        alert("Please select an image file");
        return;
      }

      // Validate file size (max 5MB)
      if (file.size > 5 * 1024 * 1024) {
        alert("Image size must be less than 5MB");
        return;
      }

      setModuleImageFile(file);

      // Create preview
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  // Handle SECTION image file selection
  const handleSectionImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      // Validate file type
      if (!file.type.startsWith("image/")) {
        alert("Please select an image file");
        return;
      }

      // Validate file size (max 5MB)
      if (file.size > 5 * 1024 * 1024) {
        alert("Image size must be less than 5MB");
        return;
      }

      setSectionImageFile(file);

      // Create preview
      const reader = new FileReader();
      reader.onloadend = () => {
        setSectionImagePreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  // Upload image to Supabase Storage
  async function uploadModuleImage(file: File): Promise<string | null> {
    try {
      const fileExt = file.name.split(".").pop();
      const fileName = `${Date.now()}-${Math.random().toString(36).substring(7)}.${fileExt}`;
      const filePath = `${fileName}`;

      const { error } = await supabase.storage
        .from("module-images")
        .upload(filePath, file);

      if (error) {
        console.error("Upload error:", error);
        throw error;
      }

      // Get public URL
      const {
        data: { publicUrl },
      } = supabase.storage.from("module-images").getPublicUrl(filePath);

      return publicUrl;
    } catch (error) {
      console.error("Error uploading image:", error);
      return null;
    }
  }

  // Upload section image to Supabase Storage
  async function uploadSectionImage(file: File): Promise<string | null> {
    try {
      const fileExt = file.name.split(".").pop();
      const fileName = `${Date.now()}-${Math.random().toString(36).substring(7)}.${fileExt}`;
      const filePath = `${fileName}`;

      const { error } = await supabase.storage
        .from("section-images")
        .upload(filePath, file);

      if (error) {
        console.error("Upload error:", error);
        throw error;
      }

      // Get public URL
      const {
        data: { publicUrl },
      } = supabase.storage.from("section-images").getPublicUrl(filePath);

      return publicUrl;
    } catch (error) {
      console.error("Error uploading section image:", error);
      return null;
    }
  }

  async function fetchModules() {
    try {
      const res = await fetch("/api/admin/modules");
      const data = await res.json();
      setModules(data.modules || []);
    } catch (error) {
      console.error("Failed to fetch modules:", error);
    }
  }

  async function fetchSections(moduleId: number) {
    try {
      const res = await fetch(`/api/admin/sections?module_id=${moduleId}`);
      const data = await res.json();
      setSections(data.sections || []);
    } catch (error) {
      console.error("Failed to fetch sections:", error);
    }
  }

  async function handleCreateModule(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);

    try {
      let finalImageUrl = moduleImageUrl || null;

      // Upload image if file is selected
      if (moduleImageFile) {
        setUploadingImage(true);
        const uploadedUrl = await uploadModuleImage(moduleImageFile);
        setUploadingImage(false);

        if (uploadedUrl) {
          finalImageUrl = uploadedUrl;
        } else {
          alert("Failed to upload image. Creating module without image.");
        }
      }

      const res = await fetch("/api/admin/modules", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title: moduleTitle,
          description: moduleDescription,
          image_url: finalImageUrl,
        }),
      });

      if (res.ok) {
        alert("Module created successfully!");
        setModuleTitle("");
        setModuleDescription("");
        setModuleImageUrl("");
        setModuleImageFile(null);
        setImagePreview(null);
        fetchModules();
      } else {
        alert("Failed to create module");
      }
    } catch (error) {
      console.error("Error creating module:", error);
      alert("Error creating module");
    } finally {
      setLoading(false);
      setUploadingImage(false);
    }
  }

  async function handleCreateSection(e: React.FormEvent) {
    e.preventDefault();
    if (!selectedModule) {
      alert("Please select a module first");
      return;
    }

    setLoading(true);

    try {
      let finalSectionImageUrl = sectionImageUrl || null;

      // Upload section image if file is selected
      if (sectionImageFile) {
        setUploadingImage(true);
        const uploadedUrl = await uploadSectionImage(sectionImageFile);
        setUploadingImage(false);

        if (uploadedUrl) {
          finalSectionImageUrl = uploadedUrl;
        } else {
          alert(
            "Failed to upload section image. Creating section without image.",
          );
        }
      }

      const res = await fetch("/api/admin/sections", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          module_id: selectedModule,
          title: sectionTitle,
          content: sectionContent,
          media_url: mediaUrl,
          image_url: finalSectionImageUrl,
          position: sections.length + 1,
        }),
      });

      if (res.ok) {
        alert("Section created successfully!");
        setSectionTitle("");
        setSectionContent("");
        setMediaUrl("");
        setSectionImageUrl("");
        setSectionImageFile(null);
        setSectionImagePreview(null);
        fetchSections(selectedModule);
      } else {
        alert("Failed to create section");
      }
    } catch (error) {
      console.error("Error creating section:", error);
      alert("Error creating section");
    } finally {
      setLoading(false);
      setUploadingImage(false);
    }
  }

  async function handleDeleteSection(sectionId: number) {
    if (!confirm("Are you sure you want to delete this section?")) {
      return;
    }

    try {
      const res = await fetch(`/api/admin/sections/${sectionId}`, {
        method: "DELETE",
      });

      if (res.ok) {
        alert("Section deleted successfully!");
        if (selectedModule) {
          fetchSections(selectedModule);
        }
      } else {
        alert("Failed to delete section");
      }
    } catch (error) {
      console.error("Error deleting section:", error);
      alert("Error deleting section");
    }
  }

  return (
    <div className={styles.formContainer}>
      <div className={styles.section}>
        <h2>📚 Create New Module</h2>
        <form onSubmit={handleCreateModule} className={styles.form}>
          <div className={styles.formGroup}>
            <label htmlFor="moduleTitle">Module Title</label>
            <input
              id="moduleTitle"
              type="text"
              value={moduleTitle}
              onChange={(e) => setModuleTitle(e.target.value)}
              placeholder="e.g., Introduction to Phishing Scams"
              required
            />
          </div>

          <div className={styles.formGroup}>
            <label htmlFor="moduleDescription">Module Description</label>
            <textarea
              id="moduleDescription"
              value={moduleDescription}
              onChange={(e) => setModuleDescription(e.target.value)}
              placeholder="Brief description of what this module covers..."
              rows={4}
              required
            />
          </div>

          <div className={styles.formGroup}>
            <label htmlFor="moduleImage">Module Cover Image</label>

            {/* Image Upload */}
            <input
              id="moduleImage"
              type="file"
              accept="image/*"
              onChange={handleImageChange}
              className={styles.fileInput}
            />

            {/* OR URL Input */}
            <div style={{ marginTop: "12px" }}>
              <label
                htmlFor="moduleImageUrl"
                style={{ fontSize: "0.9rem", opacity: 0.8 }}
              >
                Or paste an image URL:
              </label>
              <input
                id="moduleImageUrl"
                type="url"
                value={moduleImageUrl}
                onChange={(e) => setModuleImageUrl(e.target.value)}
                placeholder="https://example.com/image.jpg"
                disabled={moduleImageFile !== null}
              />
            </div>

            {/* Image Preview */}
            {imagePreview && (
              <div className={styles.imagePreview}>
                <p style={{ fontSize: "0.9rem", marginBottom: "8px" }}>
                  Preview:
                </p>
                <Image
                  src={imagePreview}
                  alt="Module cover preview"
                  width={300}
                  height={200}
                  style={{ objectFit: "cover", borderRadius: "8px" }}
                />
                <button
                  type="button"
                  onClick={() => {
                    setModuleImageFile(null);
                    setImagePreview(null);
                  }}
                  className={styles.removeImageBtn}
                >
                  ❌ Remove
                </button>
              </div>
            )}

            {moduleImageUrl && !imagePreview && (
              <div className={styles.imagePreview}>
                <p style={{ fontSize: "0.9rem", marginBottom: "8px" }}>
                  Preview:
                </p>
                <Image
                  src={moduleImageUrl}
                  alt="Module cover preview"
                  width={300}
                  height={200}
                  style={{ objectFit: "cover", borderRadius: "8px" }}
                />
              </div>
            )}

            <small className={styles.hint}>
              Upload an image (max 5MB) or provide a URL. Recommended size:
              800x600px
            </small>
          </div>

          <Button
            type="submit"
            loading={loading || uploadingImage}
            loadingComponent={<Loading color="black" />}
          >
            {uploadingImage ? "Uploading Image..." : "Create Module"}
          </Button>
        </form>
      </div>

      <div className={styles.divider} />

      <div className={styles.section}>
        <h2>📄 Manage Module Sections</h2>

        <div className={styles.formGroup}>
          <label htmlFor="selectModule">Select Module</label>
          <select
            id="selectModule"
            value={selectedModule || ""}
            onChange={(e) => setSelectedModule(Number(e.target.value))}
            className={styles.select}
          >
            <option value="">-- Select a Module --</option>
            {modules.map((module) => (
              <option key={module.id} value={module.id}>
                {module.title}
              </option>
            ))}
          </select>
        </div>

        {selectedModule && (
          <>
            {sections.length > 0 && (
              <div className={styles.sectionsList}>
                <h3>Current Sections ({sections.length})</h3>
                <div className={styles.sectionsGrid}>
                  {sections.map((section, index) => (
                    <div key={section.id} className={styles.sectionCard}>
                      <div className={styles.sectionHeader}>
                        <span className={styles.sectionNumber}>
                          #{index + 1}
                        </span>
                        <h4>{section.title}</h4>
                      </div>
                      <div className={styles.sectionMeta}>
                        {section.media_url && (
                          <span className={styles.badge}>🎥 Video</span>
                        )}
                        {section.image_url && (
                          <span className={styles.badge}>🖼️ Image</span>
                        )}
                        {!section.media_url && !section.image_url && (
                          <span className={styles.badge}>📝 Text</span>
                        )}
                      </div>
                      {section.image_url && (
                        <div style={{ marginTop: "8px", marginBottom: "8px" }}>
                          <Image
                            src={section.image_url}
                            alt={section.title}
                            width={200}
                            height={150}
                            style={{ objectFit: "cover", borderRadius: "4px" }}
                          />
                        </div>
                      )}
                      {section.content && (
                        <p className={styles.sectionPreview}>
                          {section.content.substring(0, 100)}
                          {section.content.length > 100 ? "..." : ""}
                        </p>
                      )}
                      {section.media_url && (
                        <p className={styles.sectionPreview}>
                          🔗 {section.media_url}
                        </p>
                      )}
                      <button
                        onClick={() => handleDeleteSection(section.id)}
                        className={styles.deleteBtn}
                      >
                        🗑️ Delete
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            )}

            <div className={styles.addSectionForm}>
              <h3>➕ Add New Section</h3>
              <form onSubmit={handleCreateSection} className={styles.form}>
                <div className={styles.formGroup}>
                  <label htmlFor="sectionTitle">Section Title</label>
                  <input
                    id="sectionTitle"
                    type="text"
                    value={sectionTitle}
                    onChange={(e) => setSectionTitle(e.target.value)}
                    placeholder="e.g., What is Phishing?"
                    required
                  />
                </div>

                <div className={styles.formGroup}>
                  <label>Content Type</label>
                  <div className={styles.radioGroup}>
                    <label>
                      <input
                        type="radio"
                        value="text"
                        checked={mediaType === "text"}
                        onChange={() => setMediaType("text")}
                      />
                      Text Content
                    </label>
                    <label>
                      <input
                        type="radio"
                        value="video"
                        checked={mediaType === "video"}
                        onChange={() => setMediaType("video")}
                      />
                      YouTube Video
                    </label>
                  </div>
                </div>

                {mediaType === "text" ? (
                  <div className={styles.formGroup}>
                    <div
                      style={{
                        display: "flex",
                        justifyContent: "space-between",
                        alignItems: "center",
                        marginBottom: "0.5rem",
                      }}
                    >
                      <label htmlFor="sectionContent">
                        Section Content (Rich Text Supported)
                      </label>
                      <button
                        type="button"
                        onClick={() =>
                          setShowMarkdownPreview(!showMarkdownPreview)
                        }
                        className={styles.previewToggle}
                      >
                        {showMarkdownPreview ? "📝 Edit" : "👁️ Preview"}
                      </button>
                    </div>
                    {!showMarkdownPreview ? (
                      <RichTextEditor
                        content={sectionContent}
                        onChange={(content) => setSectionContent(content)}
                        placeholder="Enter the content for this section..."
                      />
                    ) : (
                      <div
                        style={{
                          backgroundColor: "var(--card-bg)",
                          border: "1px solid var(--border-color)",
                          borderRadius: "0.5rem",
                          padding: "1rem",
                          minHeight: "300px",
                          maxHeight: "500px",
                          overflowY: "auto",
                        }}
                      >
                        {sectionContent ? (
                          <RichTextRenderer content={sectionContent} />
                        ) : (
                          <p
                            style={{
                              color: "var(--text-secondary)",
                              fontStyle: "italic",
                            }}
                          >
                            No content to preview. Start typing in the editor.
                          </p>
                        )}
                      </div>
                    )}
                  </div>
                ) : (
                  <div className={styles.formGroup}>
                    <label htmlFor="mediaUrl">YouTube Video URL</label>
                    <input
                      id="mediaUrl"
                      type="url"
                      value={mediaUrl}
                      onChange={(e) => setMediaUrl(e.target.value)}
                      placeholder="https://www.youtube.com/watch?v=..."
                      required
                    />
                    <small className={styles.hint}>
                      Paste the full YouTube URL (e.g.,
                      https://www.youtube.com/watch?v=dQw4w9WgXcQ)
                    </small>
                  </div>
                )}

                {/* Section Image Upload */}
                <div className={styles.formGroup}>
                  <label htmlFor="sectionImage">Section Image (Optional)</label>

                  {/* Image Upload */}
                  <input
                    id="sectionImage"
                    type="file"
                    accept="image/*"
                    onChange={handleSectionImageChange}
                    className={styles.fileInput}
                  />

                  {/* OR URL Input */}
                  <div style={{ marginTop: "12px" }}>
                    <label
                      htmlFor="sectionImageUrl"
                      style={{ fontSize: "0.9rem", opacity: 0.8 }}
                    >
                      Or paste an image URL:
                    </label>
                    <input
                      id="sectionImageUrl"
                      type="url"
                      value={sectionImageUrl}
                      onChange={(e) => setSectionImageUrl(e.target.value)}
                      placeholder="https://example.com/image.jpg"
                      disabled={sectionImageFile !== null}
                    />
                  </div>

                  {/* Image Preview */}
                  {sectionImagePreview && (
                    <div className={styles.imagePreview}>
                      <p style={{ fontSize: "0.9rem", marginBottom: "8px" }}>
                        Preview:
                      </p>
                      <Image
                        src={sectionImagePreview}
                        alt="Section image preview"
                        width={300}
                        height={200}
                        style={{ objectFit: "cover", borderRadius: "8px" }}
                      />
                      <button
                        type="button"
                        onClick={() => {
                          setSectionImageFile(null);
                          setSectionImagePreview(null);
                        }}
                        className={styles.removeImageBtn}
                      >
                        ❌ Remove
                      </button>
                    </div>
                  )}

                  {sectionImageUrl && !sectionImagePreview && (
                    <div className={styles.imagePreview}>
                      <p style={{ fontSize: "0.9rem", marginBottom: "8px" }}>
                        Preview:
                      </p>
                      <Image
                        src={sectionImageUrl}
                        alt="Section image preview"
                        width={300}
                        height={200}
                        style={{ objectFit: "cover", borderRadius: "8px" }}
                      />
                    </div>
                  )}

                  <small className={styles.hint}>
                    Add an image to illustrate this section. Max 5MB.
                    Recommended size: 800x600px
                  </small>
                </div>

                <Button
                  type="submit"
                  loading={loading || uploadingImage}
                  loadingComponent={<Loading color="black" />}
                >
                  {uploadingImage ? "Uploading..." : "Add Section"}
                </Button>
              </form>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
