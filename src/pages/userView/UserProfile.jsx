import { useState } from "react";
import {
  MapPin,
  Briefcase,
  GraduationCap,
  Mail,
  Phone,
  Linkedin,
  Edit2,
  Calendar,
  Award,
} from "lucide-react";

import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs";

export default function Profile() {
  const [isEditOpen, setIsEditOpen] = useState(false);

  const [userData, setUserData] = useState({
    name: "John Doe",
    avatar: "",
    currentRole: "Software Engineer",
    company: "Google",
    graduationYear: "2020",
    location: "Mumbai",
    department: "Computer Science",
    degree: "B.Tech",
    bio: "Passionate about building scalable web applications.",
    skills: ["React", "Node.js", "MongoDB"],
    interests: ["AI", "Open Source", "Mentoring"],
    email: "john@example.com",
    phone: "+91 9999999999",
    linkedin: "linkedin.com/in/johndoe",
  });

  return (
    <div className="min-h-screen bg-gray-50">
      {/* ================= HEADER ================= */}
      <section className="bg-gradient-to-br from-indigo-100 to-white py-12">
        <div className="max-w-6xl mx-auto px-6">
          <div className="flex flex-col md:flex-row gap-6 items-start md:items-center">
            <div className="h-32 w-32 rounded-full bg-gray-200 flex items-center justify-center text-3xl font-bold shadow-lg">
              {userData.name
                .split(" ")
                .map((n) => n[0])
                .join("")}
            </div>

            <div className="flex-1">
              <div className="flex flex-col sm:flex-row sm:items-center gap-4 mb-4">
                <h1 className="text-3xl font-bold">{userData.name}</h1>
                <button
                  onClick={() => setIsEditOpen(true)}
                  className="border px-4 py-2 rounded-lg text-sm flex items-center gap-2 hover:bg-gray-100"
                >
                  <Edit2 className="h-4 w-4" />
                  Edit Profile
                </button>
              </div>

              <p className="text-lg font-medium text-indigo-600 mb-2">
                {userData.currentRole} at {userData.company}
              </p>

              <div className="flex flex-wrap gap-4 text-sm text-gray-600">
                <span className="flex items-center gap-1">
                  <GraduationCap className="h-4 w-4" />
                  Class of {userData.graduationYear}
                </span>
                <span className="flex items-center gap-1">
                  <MapPin className="h-4 w-4" />
                  {userData.location}
                </span>
                <span className="flex items-center gap-1">
                  <Briefcase className="h-4 w-4" />
                  {userData.department}
                </span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ================= TABS ================= */}
      <section className="max-w-6xl mx-auto px-6 py-10">
        <Tabs defaultValue="about" className="space-y-8">
          <TabsList className="grid w-full max-w-md bg-gray-200 grid-cols-2">
            <TabsTrigger value="about">About</TabsTrigger>
            <TabsTrigger value="events">Events</TabsTrigger>
          </TabsList>

          {/* ================= ABOUT ================= */}
          <TabsContent value="about">
            <div className="grid lg:grid-cols-3 gap-8">
              <div className="lg:col-span-2 space-y-6">
                <div className="bg-white p-6 rounded-xl shadow">
                  <h2 className="font-semibold mb-2">About</h2>
                  <p className="text-gray-600">{userData.bio}</p>
                </div>

                <div className="bg-white p-6 rounded-xl shadow">
                  <h2 className="font-semibold mb-4">Education</h2>
                  <p className="font-semibold">{userData.degree}</p>
                  <p className="text-gray-600">{userData.department}</p>
                  <p className="text-sm text-gray-500">
                    Class of {userData.graduationYear}
                  </p>
                </div>

                <div className="bg-white p-6 rounded-xl shadow">
                  <h2 className="font-semibold mb-4">Skills</h2>
                  <div className="flex flex-wrap gap-2">
                    {userData.skills.map((skill) => (
                      <span
                        key={skill}
                        className="px-3 py-1 bg-indigo-100 text-indigo-700 rounded-full text-sm"
                      >
                        {skill}
                      </span>
                    ))}
                  </div>
                </div>
              </div>

              {/* Sidebar */}
              <div className="space-y-6">
                <div className="bg-white p-6 rounded-xl shadow">
                  <h2 className="font-semibold mb-4">Contact</h2>
                  <div className="space-y-3 text-sm">
                    <div className="flex items-center gap-2">
                      <Mail className="h-4 w-4 text-gray-500" />
                      {userData.email}
                    </div>
                    <div className="flex items-center gap-2">
                      <Phone className="h-4 w-4 text-gray-500" />
                      {userData.phone}
                    </div>
                    <div className="flex items-center gap-2">
                      <Linkedin className="h-4 w-4 text-gray-500" />
                      {userData.linkedin}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </TabsContent>

          {/* ================= EVENTS ================= */}
          <TabsContent value="events">
            <div className="bg-white p-12 text-center rounded-xl shadow">
              <Calendar className="h-12 w-12 mx-auto mb-4 text-gray-400" />
              <h3 className="font-semibold mb-2">Upcoming Events</h3>
              <p className="text-gray-500">
                Event registrations will appear here.
              </p>
            </div>
          </TabsContent>
        </Tabs>
      </section>
    </div>
  );
}
