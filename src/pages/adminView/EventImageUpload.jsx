import React, { useRef, useEffect } from "react";
import axios from "axios";
import { Label } from "../../components/ui/Label";
import { UploadCloudIcon, XIcon } from "lucide-react";
import { Skeleton } from "../../components/ui/skeleton";

const EventImageUpload = ({
  imageFile,
  setImageFile,
  setUploadedImageUrl,
  uploadedImageUrl,
  ImageLoadingState,
  setImageLoadingState,
}) => {
  const inputRef = useRef(null);

  // ✅ Handle file selection
  const handleImageFileChange = (event) => {
    const file = event.target.files[0];
    if (file) {
      setImageFile(file);
      console.log("Selected file:", file);
    }
  };

  // ✅ Handle drag-and-drop
  const handleDragOver = (event) => {
    event.preventDefault();
  };

  const handleOnDrop = (event) => {
    event.preventDefault();
    const droppedFile = event.dataTransfer.files?.[0];
    if (droppedFile) setImageFile(droppedFile);
  };

  // ✅ Remove selected image
  const handleRemoveImage = () => {
    setImageFile(null);
    if (inputRef.current) {
      inputRef.current.value = "";
    }
    setUploadedImageUrl(""); // clear uploaded URL if any
  };

  // ✅ Upload image to Cloudinary via your backend
  async function uploadImageToCloudinary() {
    try {
      setImageLoadingState(true);

      const data = new FormData();
      data.append("my_file", imageFile);

      const response = await axios.post(
        "http://localhost:5000/api/admin/events/upload-image",
        data,
        {
          headers:{"Content-Type": "multipart/form-data"},
        }
      );

      console.log(response, "response");

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

  // ✅ Trigger upload when a file is selected
  useEffect(() => {
    if (imageFile) {
      uploadImageToCloudinary();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [imageFile]);

  return (
    <div className="w-full px-5 max-w-md mx-auto">
      <Label className="font-semibold text-gray-800 text-lg mb-2 block">
        Event Image
      </Label>

      <div
        className={`border-2 border-dashed rounded-2xl p-6 transition-all duration-300 
          flex flex-col items-center justify-center text-center 
          ${
            imageFile
              ? "border-blue-200 bg-blue-50/30 shadow-sm"
              : "border-gray-300 hover:border-blue-400 hover:bg-blue-50/30"
          }`}
        onDragOver={handleDragOver}
        onDrop={handleOnDrop}
      >
        {/* Hidden file input */}
        <input
          type="file"
          id="image-upload"
          ref={inputRef}
          onChange={handleImageFileChange}
          className="hidden"
          accept="image/*"
        />

        {/* No image selected */}
        {!imageFile ? (
          <Label
            htmlFor="image-upload"
            className="flex flex-col justify-center items-center cursor-pointer group"
          >
            <div className="bg-blue-100 group-hover:bg-blue-200 transition-colors p-4 rounded-full">
              <UploadCloudIcon className="w-8 h-8 text-blue-500" />
            </div>
            <span className="mt-3 text-gray-600 text-sm font-medium">
              Drag & drop or <span className="text-blue-600">browse</span> to
              upload
            </span>
            <span className="text-xs text-gray-400 mt-1">
              (PNG, JPG up to 5MB)
            </span>
          </Label>
        ) : ImageLoadingState ? (
          <div className="w-48 h-48 bg-gradient-to-r from-gray-200 to-gray-300 rounded-xl animate-pulse flex items-center justify-center">
            <UploadCloudIcon className="w-8 h-8 text-gray-400 animate-bounce" />
          </div>
        ) : (
          // ✅ Preview section
          <div className="flex flex-col items-center gap-3">
            <div className="relative group">
              <img
                src={uploadedImageUrl || URL.createObjectURL(imageFile)}
                alt="Preview"
                className="w-48 h-48 object-cover rounded-xl shadow-md border border-gray-200"
              />
              <button
                onClick={handleRemoveImage}
                className="absolute top-2 right-2 bg-white/80 hover:bg-red-100 text-red-600 rounded-full p-1 shadow-sm transition"
              >
                <XIcon className="w-5 h-5" />
              </button>
            </div>

            <div className="text-sm font-medium text-gray-700 truncate max-w-[12rem]">
              {imageFile.name}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default EventImageUpload;
