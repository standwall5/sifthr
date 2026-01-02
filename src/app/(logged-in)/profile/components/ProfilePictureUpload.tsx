"use client";

import React, { useState, useCallback } from "react";
import { useDropzone } from "react-dropzone";
import { supabase } from "@/app/lib/supabaseClient";
import styles from "./ProfilePictureUpload.module.css";
import Cropper from "react-easy-crop";
import { Area } from "react-easy-crop";

type ProfilePictureUploadProps = {
  currentImageUrl: string;
  userId: string;
  onUploadSuccess: (newImageUrl: string) => void;
};

// Helper function to create image element from URL
const createImage = (url: string): Promise<HTMLImageElement> =>
  new Promise((resolve, reject) => {
    const image = new Image();
    image.addEventListener("load", () => resolve(image));
    image.addEventListener("error", (error) => reject(error));
    image.setAttribute("crossOrigin", "anonymous");
    image.src = url;
  });

// Helper function to get cropped image
async function getCroppedImg(
  imageSrc: string,
  pixelCrop: Area,
): Promise<string> {
  const image = await createImage(imageSrc);
  const canvas = document.createElement("canvas");
  const ctx = canvas.getContext("2d");

  if (!ctx) {
    throw new Error("No 2d context");
  }

  // Set canvas size to the cropped area
  canvas.width = pixelCrop.width;
  canvas.height = pixelCrop.height;

  // Draw the cropped image
  ctx.drawImage(
    image,
    pixelCrop.x,
    pixelCrop.y,
    pixelCrop.width,
    pixelCrop.height,
    0,
    0,
    pixelCrop.width,
    pixelCrop.height,
  );

  // Return as base64
  return canvas.toDataURL("image/jpeg", 0.95);
}

export default function ProfilePictureUpload({
  currentImageUrl,
  userId,
  onUploadSuccess,
}: ProfilePictureUploadProps) {
  const [uploading, setUploading] = useState(false);
  const [originalImage, setOriginalImage] = useState<string | null>(null);
  const [croppedImage, setCroppedImage] = useState<string | null>(null);
  const [isOpen, setIsOpen] = useState(false);
  const [crop, setCrop] = useState({ x: 0, y: 0 });
  const [zoom, setZoom] = useState(1);
  const [croppedAreaPixels, setCroppedAreaPixels] = useState<Area | null>(null);
  const [showCropper, setShowCropper] = useState(false);

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

    // Create preview from the raw file
    const reader = new FileReader();
    reader.onloadend = () => {
      setOriginalImage(reader.result as string);
      setCroppedImage(null);
      setShowCropper(true);
      // Reset crop settings
      setCrop({ x: 0, y: 0 });
      setZoom(1);
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

  const onCropComplete = useCallback(
    (croppedArea: Area, croppedAreaPixels: Area) => {
      setCroppedAreaPixels(croppedAreaPixels);
    },
    [],
  );

  const handleCropConfirm = async () => {
    if (!originalImage || !croppedAreaPixels) return;

    try {
      const croppedImageData = await getCroppedImg(
        originalImage,
        croppedAreaPixels,
      );
      setCroppedImage(croppedImageData);
      setShowCropper(false);
    } catch (error) {
      console.error("Error cropping image:", error);
      alert("Failed to crop image. Please try again.");
    }
  };

  const handleUpload = async () => {
    if (!croppedImage) return;

    setUploading(true);

    try {
      // Convert base64 to blob
      const response = await fetch(croppedImage);
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
      setOriginalImage(null);
      setCroppedImage(null);
      setShowCropper(false);
      setCrop({ x: 0, y: 0 });
      setZoom(1);

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
    setOriginalImage(null);
    setCroppedImage(null);
    setShowCropper(false);
    setCrop({ x: 0, y: 0 });
    setZoom(1);
  };

  const handleRecrop = () => {
    setShowCropper(true);
    setCroppedImage(null);
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

            {!originalImage ? (
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
            ) : showCropper ? (
              <div className={styles.cropContainer}>
                <div className={styles.cropperWrapper}>
                  <Cropper
                    image={originalImage}
                    crop={crop}
                    zoom={zoom}
                    aspect={1}
                    onCropChange={setCrop}
                    onZoomChange={setZoom}
                    onCropComplete={onCropComplete}
                    cropShape="round"
                    showGrid={false}
                  />
                </div>
                <div className={styles.controls}>
                  <label className={styles.zoomLabel}>
                    Zoom:
                    <input
                      type="range"
                      min={1}
                      max={3}
                      step={0.1}
                      value={zoom}
                      onChange={(e) => setZoom(Number(e.target.value))}
                      className={styles.zoomSlider}
                    />
                  </label>
                </div>
              </div>
            ) : (
              <div className={styles.previewContainer}>
                <img
                  src={croppedImage || originalImage}
                  alt="Preview"
                  className={styles.previewImage}
                />
              </div>
            )}

            <div className={styles.buttonGroup}>
              {originalImage && (
                <>
                  {showCropper ? (
                    <button
                      onClick={handleCropConfirm}
                      className={styles.uploadButton}
                    >
                      Confirm Crop
                    </button>
                  ) : (
                    <>
                      <button
                        onClick={handleUpload}
                        disabled={uploading || !croppedImage}
                        className={styles.uploadButton}
                      >
                        {uploading ? "Uploading..." : "Set as Profile Picture"}
                      </button>
                      <button
                        onClick={handleRecrop}
                        disabled={uploading}
                        className={styles.secondaryButton}
                      >
                        Adjust Crop
                      </button>
                      <button
                        onClick={() => {
                          setOriginalImage(null);
                          setCroppedImage(null);
                          setShowCropper(false);
                        }}
                        disabled={uploading}
                        className={styles.secondaryButton}
                      >
                        Choose Different Image
                      </button>
                    </>
                  )}
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
