import React, { useEffect, useState, useCallback } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  fetchUserProfile,
  createOrUpdateUserProfile,
  clearUserProfile,
} from "../../store/user-view/UserInfoSlice";
import { toast } from "sonner";
import ProfileImageUpload from "./ProfileImageUpload";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import {
  Mail,
  Linkedin,
  Building2,
  Edit2,
  Save,
  Briefcase,
  BookOpen,
  User,
  SquareUser,
  Users,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import ConnectionsList from "./Connectionlist";
import { fetchAcceptedConnections } from "../../store/user-view/ConnectionSlice";



const UserProfile = () => {
  const dispatch = useDispatch();
  const { userProfile, isLoading, error } = useSelector((state) => state.userProfile);
  const currentUser = useSelector((state) => state.auth?.user);

  const [open, setOpen] = useState(false);
  const [imageFile, setImageFile] = useState(null);
  const [uploadedImageUrl, setUploadedImageUrl] = useState("");
  const [imageLoadingState, setImageLoadingState] = useState(false);
  const [showConnections, setShowConnections] = useState(false);
  const { acceptedConnections } = useSelector((state) => state.connections);

  useEffect(() => {
    dispatch(fetchAcceptedConnections());
  }, []);

  useEffect(() => {
    if (error) {
      toast.error("Failed to load profile", {
        description: error,
      });
    }
  }, [error]);

  const [formData, setFormData] = useState({
    jobTitle: "",
    company: "",
    industry: "",
    about: "",
    linkedin: "",
  });

  useEffect(() => {
    console.log("Redux userProfile:", userProfile);
    console.log("Redux isLoading:", isLoading);
  }, [userProfile, isLoading]);


  /* ================= CLEAR & FETCH PROFILE ================= */
  useEffect(() => {
    dispatch(fetchUserProfile());
  }, []);



  /* ================= SYNC FORM ================= */
  const syncFromProfile = useCallback(() => {
    if (!userProfile) return;

    setFormData({
      jobTitle: userProfile.jobTitle || "",
      company: userProfile.company || "",
      industry: userProfile.industry || "",
      about: userProfile.about || "",
      linkedin: userProfile.linkedin || "",
    });

    setUploadedImageUrl(userProfile.profilePicture || "");
  }, [userProfile]);

  useEffect(() => {
    syncFromProfile();
  }, [syncFromProfile]);

  /* ================= HANDLERS ================= */
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSave = async () => {
    if (imageLoadingState) {
      toast.error("Image upload still in progress", {
        description: "Please wait until upload completes.",
      });
      return;
    }

    try {
      const payload = {
        ...formData,
        profilePicture: uploadedImageUrl || "",
      };

      await dispatch(createOrUpdateUserProfile(payload)).unwrap();

      toast.success("Profile updated successfully", {
        description: "Your changes have been saved.",
      });

      setOpen(false);
      setImageFile(null);
    } catch (err) {
      const message =
        err?.message ||
        err?.response?.data?.message ||
        "Failed to update profile";

      toast.error("Update failed", {
        description: message,
      });
    }
  };


  useEffect(() => {
    if (error) {
      toast.error("Failed to load profile", {
        description: error,
      });
    }
  }, [error]);


  // Wait for auth to exist first
  if (!currentUser) {
    return <div className="p-10 text-center">Loading...</div>;
  }

  // Then wait for profile fetch
  if (isLoading || !userProfile) {
    return <div className="p-10 text-center">Loading profile...</div>;
  }

  if (showConnections) {
    return <ConnectionsList onClose={() => setShowConnections(false)} />;
  }

  const profile = userProfile || {};
  const user = profile.user || {};

  return (
    <div className="min-h-screen bg-[#F5F6F8]">
      {/* ================= HERO ================= */}
      <div className="relative p-10 bg-[#152A5D] overflow-hidden">
        {/* Decorative Circles */}
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-1/2 left-1/2 
                    w-[400px] h-[400px] 
                    -translate-x-1/2 -translate-y-1/2 
                    rounded-full 
                    border-[1px] border-white/5" />

          <div className="absolute top-1/2 left-1/2 
                    w-[600px] h-[600px] 
                    -translate-x-1/2 -translate-y-1/2 
                    rounded-full 
                    border-[1px] border-white/5" />

          <div className="absolute top-1/2 left-1/2 
                    w-[900px] h-[900px] 
                    -translate-x-1/2 -translate-y-1/2 
                    rounded-full 
                    border-[1px] border-white/10" />
        </div>

        <div className="relative max-w-6xl mx-auto px-6 pt-5 pb-20 z-10">
          <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-6">
            <div className="flex items-center  gap-6">
              <Avatar className="w-36 h-36 rounded-full border-4 border-white shadow-xl">
                <AvatarImage
                  src={profile.profilePicture || undefined}
                  className="object-cover"
                />
                <AvatarFallback className="bg-[#EBAB09] text-[#0F2747] text-5xl font-bold flex items-center justify-center">
                  {user.fullname
                    ? user.fullname.charAt(0).toUpperCase()
                    : "U"}
                </AvatarFallback>
              </Avatar>


              <div>
                <h1 className="text-3xl md:text-5xl font-bold text-white/90">
                  {user.fullname || "User"}
                </h1>

                <p className="text-white/70 text-lg mt-2">
                  {profile.jobTitle || "Add your job title"}
                  {profile.company && ` at ${profile.company}`}
                </p>
              </div>
            </div>

            <Button
              onClick={() => setOpen(true)}
              className="bg-[#EBAB09] hover:bg-[#c4962f] cursor-pointer  text-white font-semibold px-6 rounded-xl"
            >
              <Edit2 className="h-4 w-4 mr-2" />
              Edit Profile
            </Button>
          </div>
        </div>
      </div>


      {/* ================= MAIN ================= */}
      <div className="max-w-6xl mx-auto px-6 -mt-16 pb-16 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* LEFT SIDEBAR */}
          <div className="space-y-6">
            <Card className="rounded-xl  border-none bg-white shadow-xl">
              <CardHeader className="items-center">
                <CardTitle>Contact Info</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4 text-sm">
                <div className="flex items-center gap-3">
                  <Mail className="h-4 w-4 text-[#D4A437]" />
                  <span>{user.email || "No email"}</span>
                </div>

                <div className="flex items-center gap-3">
                  <Linkedin className="h-4 w-4 text-[#D4A437]" />
                  {profile.linkedin ? (
                    <a
                      href={profile.linkedin.startsWith("http")
                        ? profile.linkedin
                        : `https://${profile.linkedin}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-blue-600 hover:underline break-all"
                    >
                      {profile.linkedin}
                    </a>
                  ) : (
                    <span className="text-gray-400 italic">
                      Not posted yet
                    </span>
                  )}
                </div>
              </CardContent>
            </Card>

            <Card className="rounded-2xl bg-white border-none shadow-xl">
              <CardContent className="p-6">
                <div className="grid grid-cols-2 gap-6">

                  {/* Jobs Posted */}
                  <div className="bg-[#F3F4F6] hover:bg-[#ECEEF2] transition-colors rounded-2xl p-6 text-center cursor-default">
                    <div className="w-10 h-10 mx-auto mb-3 flex items-center justify-center rounded-xl bg-white shadow-sm">
                      <Briefcase className="h-5 w-5 text-[#D4A437]" />
                    </div>

                    <p className="text-3xl font-bold text-[#0F2747]">12</p>
                    <p className="text-sm text-gray-500 mt-1">Jobs Posted</p>
                  </div>

                  {/* Connections */}
                  <div
                    onClick={() => setShowConnections(true)}
                    className="bg-[#F3F4F6] hover:bg-amber-50 transition-all duration-200 rounded-2xl p-6 text-center cursor-pointer hover:shadow-md"
                  >
                    <div className="w-10 h-10 mx-auto mb-3 flex items-center justify-center rounded-xl bg-white shadow-sm">
                      <Users className="h-5 w-5 text-[#D4A437]" />
                    </div>

                    <p className="text-3xl font-bold text-[#0F2747]">
                      {acceptedConnections.length}
                    </p>
                    <p className="text-sm text-gray-500 mt-1">Connections</p>
                  </div>

                </div>
              </CardContent>
            </Card>

          </div>

          {/* RIGHT CONTENT */}
          <div className="lg:col-span-2">
            <Tabs defaultValue="info">
              <TabsList className="bg-white w-full  rounded-md p-1 h-14">
                <TabsTrigger
                  value="info"
                  className="rounded-md cursor-pointer px-6 data-[state=active]:bg-[#152A5D] data-[state=active]:text-white"
                >
                  Info
                </TabsTrigger>
                <TabsTrigger
                  value="events"
                  className="rounded-md px-6 cursor-pointer data-[state=active]:bg-[#152A5D] data-[state=active]:text-white"
                >
                  Registered Events
                </TabsTrigger>
              </TabsList>

              <TabsContent value="info" className="mt-10 space-y-6">
                <Card className="rounded-2xl bg-white border-none  shadow-xl">
                  <CardHeader className="flex flex-row items-center gap-3">
                    <BookOpen className="h-5 w-5 text-[#D4A437]" />
                    <CardTitle className="text-lg font-semibold">
                      About
                    </CardTitle>
                  </CardHeader>

                  <CardContent>
                    <p className="text-gray-600">
                      {profile.about || "No information added yet."}
                    </p>
                  </CardContent>
                </Card>

                {/* PROFESSIONAL SECTION */}
                <Card className="rounded-3xl bg-white border-none shadow-xl overflow-hidden">
                  <CardHeader className="flex flex-row items-center gap-3 pb-4 border-b bg-gradient-to-r from-[#f8fafc] to-white">
                    <div className="w-10 h-10 rounded-xl text-[#D4A437] flex items-center justify-center">
                      <Building2 className="h-5 w-5 text-[#D4A437]" />
                    </div>
                    <CardTitle className="text-xl font-bold text-[#0F2747]">
                      Professional Overview
                    </CardTitle>
                  </CardHeader>

                  <CardContent className="space-y-8 pt-8">

                    {/* Current Role */}
                    <div className="group relative rounded-2xl p-6 bg-gradient-to-br from-[#EEF2F7] to-[#F8FAFC] hover:shadow-lg transition-all duration-300">
                      <div className="flex items-start gap-5">
                        <div className="w-14 h-14 rounded-2xl bg-white shadow-md flex items-center justify-center">
                          <Briefcase className="h-6 w-6 text-[#0F2747]" />
                        </div>

                        <div className="flex-1">
                          <p className="text-xs uppercase tracking-wider  text-gray-500 font-medium">
                            Current Position
                          </p>

                          <h3 className="text-xl font-semibold text-[#0F2747] mt-1">
                            {profile.jobTitle?.trim() || "Not specified"}
                          </h3>

                          <p className="text-gray-600 mt-1">
                            {profile.company?.trim() || "Company not specified"}
                          </p>


                        </div>
                      </div>
                    </div>

                    {/* Academic Info */}
                    <div className="group relative rounded-2xl p-6 bg-gradient-to-br from-[#EEF2F7] to-[#F8FAFC] hover:shadow-lg transition-all duration-300">
                      <div className="flex items-start gap-5">
                        <div className="w-14 h-14 rounded-2xl bg-white shadow-md flex items-center justify-center">
                          <BookOpen className="h-6 w-6 text-[#0F2747]" />
                        </div>

                        <div className="flex-1">
                          <p className="text-xs uppercase tracking-wider text-gray-500 font-medium">
                            Academic Background
                          </p>

                          <h3 className="text-xl font-semibold text-[#0F2747] mt-1">
                            {user.stream || "Stream not specified"}
                          </h3>

                          <p className="text-gray-600 mt-1">
                            Batch of {user.batch || "N/A"}
                          </p>
                        </div>
                      </div>
                    </div>

                  </CardContent>
                </Card>

              </TabsContent>

              <TabsContent value="events" className="mt-10">
                <Card className="rounded-2xl bg-whites border-none shadow-xl">
                  <CardContent className="py-16 text-center">
                    <Briefcase className="h-10 w-10 text-gray-300 mx-auto mb-4" />
                    <p className="text-gray-500">
                      Registered events will appear here.
                    </p>
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>
          </div>
        </div>
      </div>

      {/* ================= EDIT DIALOG ================= */}
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="sm:max-w-[750px] max-h-[90vh] overflow-y-auto p-0 rounded-2xl border-none shadow-2xl">

          {/* Header */}
          <div className="bg-gradient-to-r from-[#0F2747] to-[#1d3c7a] px-8 py-6 text-white rounded-t-2xl">
            <DialogTitle className="text-2xl font-bold tracking-tight">
              Edit Your Profile
            </DialogTitle>
            <p className="text-white/70 text-sm mt-1">
              Keep your professional details up to date.
            </p>
          </div>

          {/* Body */}
          <div className="px-8 py-8 bg-white space-y-8">

            {/* Profile Image Section */}
            <div className="flex flex-col items-center space-y-4">
              <ProfileImageUpload
                imageFile={imageFile}
                setImageFile={setImageFile}
                uploadedImageUrl={uploadedImageUrl}
                setUploadedImageUrl={setUploadedImageUrl}
                imageLoadingState={imageLoadingState}
                setImageLoadingState={setImageLoadingState}
                userName={user.fullname}
              />
              <p className="text-sm text-gray-500">
                Upload a professional profile picture.
              </p>
            </div>

            {/* Divider */}
            <div className="h-px bg-gray-200" />

            {/* Professional Info Section */}
            <div className="space-y-6">
              <h3 className="text-lg font-semibold text-[#0F2747]">
                Professional Information
              </h3>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label className="text-sm font-medium">Job Title</Label>
                  <Input
                    name="jobTitle"
                    value={formData.jobTitle}
                    onChange={handleChange}
                    className="h-11 rounded-xl border-gray-300 focus:ring-2 focus:ring-[#0F2747]"
                  />
                </div>

                <div className="space-y-2">
                  <Label className="text-sm font-medium">Company</Label>
                  <Input
                    name="company"
                    value={formData.company}
                    onChange={handleChange}
                    className="h-11 rounded-xl border-gray-300 focus:ring-2 focus:ring-[#0F2747]"
                  />
                </div>

                <div className="space-y-2">
                  <Label className="text-sm font-medium">Industry</Label>
                  <Input
                    name="industry"
                    value={formData.industry}
                    onChange={handleChange}
                    className="h-11 rounded-xl border-gray-300 focus:ring-2 focus:ring-[#0F2747]"
                  />
                </div>

                <div className="space-y-2">
                  <Label className="text-sm font-medium">LinkedIn Profile URL</Label>
                  <Input
                    name="linkedin"
                    value={formData.linkedin}
                    onChange={handleChange}
                    className="h-11 rounded-xl border-gray-300 focus:ring-2 focus:ring-[#0F2747]"
                  />
                </div>
              </div>
            </div>

            {/* About Section */}
            <div className="space-y-3">
              <h3 className="text-lg font-semibold text-[#0F2747]">
                About You
              </h3>
              <Textarea
                name="about"
                value={formData.about}
                onChange={handleChange}
                rows={5}
                className="rounded-xl border-gray-300 focus:ring-2 focus:ring-[#0F2747]"
              />
            </div>

          </div>

          {/* Footer */}
          <DialogFooter className="px-8 py-6 bg-gray-50  rounded-b-2xl flex justify-between">
            <Button
              variant="ghost"
              onClick={() => setOpen(false)}
              className="rounded-full hover:bg-transparent hover:outline-2 cursor-pointer hover:border px-6"
            >
              Cancel
            </Button>

            <Button
              onClick={handleSave}
              disabled={imageLoadingState}
              className="bg-yellow-500 hover:bg-[#c4962f] text-white font-semibold px-8 rounded-full shadow-lg hover:shadow-xl transition-all duration-300"
            >
              <Save className="h-4 w-4 mr-2" />
              Save Changes
            </Button>
          </DialogFooter>

        </DialogContent>
      </Dialog>

    </div>
  );
};

export default UserProfile;