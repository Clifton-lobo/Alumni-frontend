import React, { useEffect, useState, useCallback } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  fetchUserProfile,
  createOrUpdateUserProfile,
} from "../../store/user-view/UserInfoSlice";

import ProfileImageUpload from "./ProfileImageUpload";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import {
  Mail,
  Phone,
  Linkedin,
  Building2,
  Edit2,
  Save,
  Briefcase,
  BookOpen,
  User,
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

const UserProfile = () => {
  const dispatch = useDispatch();
  const { userProfile, isLoading } = useSelector((state) => state.userProfile);
  const currentUser = useSelector((state) => state.auth?.user);

  const [open, setOpen] = useState(false);
  const [imageFile, setImageFile] = useState(null);
  const [uploadedImageUrl, setUploadedImageUrl] = useState("");

  const [formData, setFormData] = useState({
    jobTitle: "",
    company: "",
    industry: "",
    about: "",
    linkedin: "",
  });

  /* ================= FETCH PROFILE ================= */
  useEffect(() => {
    if (currentUser?._id) {
      dispatch(fetchUserProfile(currentUser._id));
    }
  }, [dispatch, currentUser?._id]);

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
    try {
      await dispatch(
        createOrUpdateUserProfile({
          userId: currentUser._id,
          profileData: {
            ...formData,
            profilePicture: uploadedImageUrl,
          },
        })
      ).unwrap();

      setOpen(false);
      setImageFile(null);
    } catch (err) {
      alert(err?.message || "Failed to save profile");
    }
  };

  if (isLoading) {
    return <div className="p-10 text-center">Loading profile...</div>;
  }

  const profile = userProfile || {};

  return (
    <div className="min-h-screen  bg-[#F5F6F8]">
      {/* ================= HERO ================= */}
      <div className="relative p10 bg-[#0F2747] overflow-hidden">
        <div className="absolute inset-0">
          <div className="absolute top-1/2 left-1/2 w-[600px] h-[600px] -translate-x-1/2 -translate-y-1/2 border border-[#D4A437]/10 rounded-full" />
        </div>

        <div className="relative max-w-6xl mx-auto px-6 pt-12 pb-28">
          <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-6">
            <div className="flex items-center  gap-6">
              <Avatar className="w-35 h-35 rounded-full border-4 shadow-sm border[#0F2747] shadow-yellow-500">
                <AvatarImage src={profile.profilePicture} />
                <AvatarFallback className="bg-[#D4A437] text-[#0F2747] text-6xl font-bold">
                  {currentUser?.fullname?.charAt(0) || "U"}
                </AvatarFallback>
              </Avatar>

              <div>
                <h1 className="text-3xl md:text-6xl font-bold text-white">
                  {currentUser?.fullname || "User"}
                </h1>
                <p className="text-white/70 font-normal text-lg mt-2">
                  {profile.jobTitle || "Add your job title"}
                  {profile.company && ` at ${profile.company}`}
                </p>
              </div>
            </div>

            <Button
              onClick={() => setOpen(true)}
              className="bg-[#D4A437] hover:bg-[#c4962f] text-[#0F2747] font-semibold px-6 rounded-xl"
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
            <Card className="rounded-2xl bg-white border shadow-sm">
              <CardHeader>
                <CardTitle>Contact Info</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4 text-sm">
                <div className="flex items-center gap-3">
                  <Mail className="h-4 w-4 text-[#D4A437]" />
                  <span>{currentUser?.email}</span>
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

            <Card className="rounded-2xl bg-white border shadow-sm">
              <CardContent className="p-6">
                <div className="grid grid-cols-2 gap-6">

                  {/* Jobs Posted */}
                  <div className="bg-[#F3F4F6] rounded-2xl p-6 text-center">
                    <Briefcase className="h-6 w-6 text-[#D4A437] mx-auto mb-4" />
                    <p className="text-3xl font-bold text-[#0F2747]">
                      12
                    </p>
                    <p className="text-sm text-gray-500 mt-1">
                      Jobs Posted
                    </p>
                  </div>

                  {/* Connections */}
                  <div className="bg-[#F3F4F6] rounded-2xl p-6 text-center">
                    <User className="h-6 w-6 text-[#D4A437] mx-auto mb-4" />
                    <p className="text-3xl font-bold text-[#0F2747]">
                      340
                    </p>
                    <p className="text-sm text-gray-500 mt-1">
                      Connections
                    </p>
                  </div>

                </div>
              </CardContent>
            </Card>

          </div>

          {/* RIGHT CONTENT */}
          <div className="lg:col-span-2">
            <Tabs defaultValue="info">
              <TabsList className="bg-white w-full  border rounded-md p-1 h-14">
                <TabsTrigger
                  value="info"
                  className="rounded-md cursor-pointer pmdx-6 data-[state=active]:bg-[#0F2747] data-[state=active]:text-white"
                >
                  Info
                </TabsTrigger>
                <TabsTrigger
                  value="events"
                  className="rounded-md px-6 cursor-pointer  data-[state=active]:bg-[#0F2747] data-[state=active]:text-white"
                >
                  Registered Events
                </TabsTrigger>
              </TabsList>

              <TabsContent value="info" className="mt-10 space-y-6">
                <Card className="rounded-2xl bg-white border shadow-sm">
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
                <Card className="rounded-2xl bg-white border shadow-sm">
                  <CardHeader className="flex flex-row items-center gap-3 pb-2">
                    <Building2 className="h-5 w-5 text-[#D4A437]" />
                    <CardTitle className="text-lg font-semibold">
                      Professional
                    </CardTitle>
                  </CardHeader>

                  <CardContent className="space-y-6 pt-4">

                    {/* Job Block */}
                    <div className="flex items-center gap-5 bg-[#EEF0F3] p-6 rounded-2xl">
                      <div className="w-12 h-12 flex items-center justify-center rounded-xl bg-gray-300">
                        <Briefcase className="h-6 w-6 text-[#0F2747]" />
                      </div>

                      <div>
                        <p className="text-lg font-semibold text-[#0F2747]">
                          {profile.jobTitle?.trim() || "Not specified"}
                        </p>
                        <p className="text-gray-500">
                          {profile.company?.trim() || "Not specified"}
                        </p>
                      </div>
                    </div>

                    {/* Academic Block */}
                    <div className="flex items-center gap-5 bg-[#EEF0F3] p-6 rounded-2xl">
                      <div className="w-12 h-12 flex items-center justify-center rounded-xl bg-gray-300">
                        <Building2 className="h-6 w-6 text-[#0F2747]" />
                      </div>

                      <div>
                        <p className="text-lg font-semibold text-[#0F2747]">
                          {profile.user?.stream || "Not specified"}
                        </p>
                        <p className="text-gray-500">
                          Batch {profile.user?.batch || "Not specified"}
                        </p>
                      </div>
                    </div>

                  </CardContent>
                </Card>


              </TabsContent>

              <TabsContent value="events" className="mt-10">
                <Card className="rounded-2xl bg-white border shadow-sm">
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
        <DialogContent className="sm:max-w-[600px] max-h-[85vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Edit Profile</DialogTitle>
          </DialogHeader>

          <div className="space-y-4 py-4">
            <ProfileImageUpload
              imageFile={imageFile}
              setImageFile={setImageFile}
              uploadedImageUrl={uploadedImageUrl}
              setUploadedImageUrl={setUploadedImageUrl}
            />

            <div>
              <Label>Job Title</Label>
              <Input
                name="jobTitle"
                value={formData.jobTitle}
                onChange={handleChange}
              />
            </div>

            <div>
              <Label>Company</Label>
              <Input
                name="company"
                value={formData.company}
                onChange={handleChange}
              />
            </div>

            <div>
              <Label>Industry</Label>
              <Input
                name="industry"
                value={formData.industry}
                onChange={handleChange}
              />
            </div>

            <div>
              <Label>LinkedIn</Label>
              <Input
                name="linkedin"
                value={formData.linkedin}
                onChange={handleChange}
              />
            </div>

            <div>
              <Label>About</Label>
              <Textarea
                name="about"
                value={formData.about}
                onChange={handleChange}
                rows={4}
              />
            </div>
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => setOpen(false)}>
              Cancel
            </Button>
            <Button
              onClick={handleSave}
              className="bg-[#D4A437] hover:bg-[#c4962f] text-[#0F2747]"
            >
              <Save className="h-4 w-4 mr-2" />
              Save
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default UserProfile;
