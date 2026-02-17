import React, { useRef, useEffect } from "react";
import axiosInstance from "../../api/axiosInstance";
import { Camera, X } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

const ProfileImageUpload = ({
  imageFile,
  setImageFile,
  setUploadedImageUrl,
  uploadedImageUrl,
  imageLoadingState,
  setImageLoadingState,
  userName,
}) => {
  const inputRef = useRef(null);

  // Handle file selection
  const handleImageFileChange = (event) => {
    const file = event.target.files[0];
    if (file) {
      setImageFile(file);
      console.log("Selected file:", file);
    }
  };

  // Remove selected image
  const handleRemoveImage = () => {
    setImageFile(null);
    if (inputRef.current) {
      inputRef.current.value = "";
    }
    setUploadedImageUrl("");
  };

  async function uploadImageToCloudinary() {
    try {
      setImageLoadingState(true);

      const data = new FormData();
      data.append("my_file", imageFile);

      const response = await axiosInstance.post(
        "/api/user/info/upload-image",
        data,
        { headers: { "Content-Type": "multipart/form-data" } }
      );

      if (response?.data?.success) {
        setUploadedImageUrl(response.data.result.secure_url);
      } else {
        console.error("Upload failed:", response?.data?.message);
      }
    } catch (error) {
      console.error("Error uploading image:", error);
    } finally {
      setImageLoadingState(false);
    }
  }
  async function uploadImageToCloudinary() {
    try {
      setImageLoadingState(true);

      const data = new FormData();
      data.append("my_file", imageFile);

      const response = await axiosInstance.post(
        "/api/user/info/upload-image",
        data,
        { headers: { "Content-Type": "multipart/form-data" } }
      );

      if (response?.data?.success) {
        setUploadedImageUrl(response.data.result.secure_url);
      } else {
        console.error("Upload failed:", response?.data?.message);
      }
    } catch (error) {
      console.error("Error uploading image:", error);
    } finally {
      setImageLoadingState(false);
    }
  }

  // Trigger upload when file is selected
  useEffect(() => {
    if (imageFile) {
      uploadImageToCloudinary();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [imageFile]);

  // Get user initials for fallback
  const getInitials = (name) => {
    if (!name) return "U";
    const names = name.split(" ");
    return names.length > 1
      ? `${names[0][0]}${names[1][0]}`.toUpperCase()
      : names[0][0].toUpperCase();
  };

  return (
    <div className="relative w-36 h-36 mx-auto">
      {/* Hidden file input */}
      <input
        type="file"
        id="profile-image-upload"
        ref={inputRef}
        onChange={handleImageFileChange}
        className="hidden"
        accept="image/*"
      />

      {/* Profile Avatar */}
      <div className="relative group">
        {imageLoadingState ? (
          <div className="w-36 h-36 rounded-full bg-gradient-to-r from-gray-200 to-gray-300 animate-pulse flex items-center justify-center border-4 border-white shadow-xl">
            <Camera className="w-8 h-8 text-gray-400 animate-bounce" />
          </div>
        ) : (
          <Avatar className="w-36 h-36 border-4 border-white shadow-xl ring-2 ring-blue-100">
            <AvatarImage
              src={uploadedImageUrl || (imageFile && URL.createObjectURL(imageFile))}
              alt={userName}
              className="object-cover"
            />
            <AvatarFallback className="bg-[#EBAB09] text-[#0F2747] text-4xl font-bold flex items-center justify-center">
              {getInitials(userName)}
            </AvatarFallback>

          </Avatar>
        )}

        {/* Camera Icon Overlay */}
        <label
          htmlFor="profile-image-upload"
          className="absolute bottom-0 right-0 bg-blue-600 hover:bg-blue-700 text-white rounded-full p-2.5 cursor-pointer shadow-lg transition-all hover:scale-110 group"
        >
          <Camera className="w-5 h-5" />
        </label>

        {/* Remove Button (only if image exists) */}
        {(uploadedImageUrl || imageFile) && !imageLoadingState && (
          <button
            onClick={handleRemoveImage}
            className="absolute top-0 right-0 bg-red-500 hover:bg-red-600 text-white rounded-full p-1.5 shadow-lg transition-all hover:scale-110"
            type="button"
          >
            <X className="w-4 h-4" />
          </button>
        )}
      </div>
    </div>
  );
};

export default ProfileImageUpload;