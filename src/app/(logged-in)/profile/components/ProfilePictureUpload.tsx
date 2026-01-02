"use client";

import React, { useState, useCallback } from "react";
import { useDropzone } from "react-dropzone";
import { supabase } from "@/app/lib/supabaseClient";
import styles from "./ProfilePictureUpload.module.css";

type ProfilePictureUploadProps = {
  currentImageUrl: string;
  userId: string;
  onUploadSuccess: (newImageUrl: string) => void;
};

export default function ProfilePictureUpload({
  currentImageUrl,
  userId,
  onUploadSuccess,
}: ProfilePictureUploadProps) {
  const [uploading, setUploading] = useState(false);
  const [preview, setPreview] = useState<string | null>(null);
  const [isOpen, setIsOpen] = useState(false);

  const onDrop = useCallback((acceptedFiles: File[]) => {
    if (acceptedFiles.length === 0) return;

    const file = acceptedFiles[0];

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

    // Create preview
    const reader = new FileReader();
    reader.onloadend = () => {
      setPreview(reader.result as string);
    };
    reader.readAsDataURL(file);
  }, []);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      "image/*": [".png", ".jpg", ".jpeg", ".gif", ".webp"],
    },
    multiple: false,
  });

  const handleUpload = async () => {
    if (!preview) return;

    setUploading(true);

    try {
      // Convert base64 to blob
      const response = await fetch(preview);
      const blob = await response.blob();

      // Generate unique filename
      const fileExt = blob.type.split("/")[1];
      const fileName = `${userId}-${Date.now()}.${fileExt}`;
      const filePath = `profile-pictures/${fileName}`;

      // Upload to Supabase Storage
      const { error: uploadError } = await supabase.storage
        .from("profile-pictures")
        .upload(filePath, blob, {
          contentType: blob.type,
          upsert: false,
        });

      if (uploadError) {
        console.error("Upload error:", uploadError);
        throw uploadError;
      }

      // Get public URL
      const {
        data: { publicUrl },
      } = supabase.storage.from("profile-pictures").getPublicUrl(filePath);

      // Update user profile in database
      const { error: updateError } = await supabase
        .from("users")
        .update({ profile_picture_url: publicUrl })
        .eq("id", userId);

      if (updateError) {
        console.error("Update error:", updateError);
        throw updateError;
      }

      // Success!
      onUploadSuccess(publicUrl);
      setIsOpen(false);
      setPreview(null);

      window.dispatchEvent(
        new CustomEvent("toast:show", {
          detail: {
            message: "Profile picture updated successfully!",
            type: "success",
          },
        }),
      );
    } catch (error) {
      console.error("Error uploading profile picture:", error);
      alert("Failed to upload profile picture. Please try again.");
    } finally {
      setUploading(false);
    }
  };

  const handleCancel = () => {
    setIsOpen(false);
    setPreview(null);
  };

  return (
    <div className={styles.uploadContainer}>
      {!isOpen && (
        <button
          onClick={() => setIsOpen(true)}
          className={styles.changeButton}
          title="Change profile picture"
        >
          📷 Change Photo
        </button>
      )}

      {isOpen && (
        <div className={styles.modal}>
          <div className={styles.modalContent}>
            <h3>Upload Profile Picture</h3>

            {!preview ? (
              <div
                {...getRootProps()}
                className={`${styles.dropzone} ${
                  isDragActive ? styles.dropzoneActive : ""
                }`}
              >
                <input {...getInputProps()} />
                <div className={styles.dropzoneContent}>
                  <div className={styles.uploadIcon}>📁</div>
                  {isDragActive ? (
                    <p>Drop the image here...</p>
                  ) : (
                    <>
                      <p>Drag & drop an image here</p>
                      <p className={styles.orText}>or</p>
                      <button type="button" className={styles.browseButton}>
                        Browse Files
                      </button>
                    </>
                  )}
                  <small className={styles.hint}>
                    Supported: PNG, JPG, GIF, WebP (Max 5MB)
                  </small>
                </div>
              </div>
            ) : (
              <div className={styles.previewContainer}>
                <img
                  src={preview}
                  alt="Preview"
                  className={styles.previewImage}
                />
              </div>
            )}

            <div className={styles.buttonGroup}>
              {preview && (
                <>
                  <button
                    onClick={handleUpload}
                    disabled={uploading}
                    className={styles.uploadButton}
                  >
                    {uploading ? "Uploading..." : "Set as Profile Picture"}
                  </button>
                  <button
                    onClick={() => setPreview(null)}
                    disabled={uploading}
                    className={styles.secondaryButton}
                  >
                    Choose Different Image
                  </button>
                </>
              )}
              <button
                onClick={handleCancel}
                disabled={uploading}
                className={styles.cancelButton}
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
