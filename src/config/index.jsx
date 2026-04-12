import { 
  LayoutDashboard, 
  CalendarDays, 
  BriefcaseBusiness, 
  Newspaper, 
  ImageIcon,
  UserSquare,
  Frown
} from 'lucide-react';

export const AdminSidebarMenuItems = [
  {
    id: "dashboard",
    label: "Dashboard",
    path: "/admin/dashboard",
    icon: LayoutDashboard, // ✅ component reference
  },
  {
    id: "events",
    label: "Events",
    path: "/admin/events",
    icon: CalendarDays,
  },
  {
    id: "jobs",
    label: "Jobs/Internships",
    path: "/admin/jobs",
    icon: BriefcaseBusiness,
  },
  {
    id: "news",
    label: "News",
    path: "/admin/news",
    icon: Newspaper,
  },
  {
    id: "gallery",
    label: "Gallery",
    path: "/admin/gallery",
    icon: ImageIcon,
  },
  {
    id: "alumni",
    label: "Alumi directory",
    path: "/admin/directory",
    icon: UserSquare,
  },
   {
    id: "feedback",
    label: "Feedback",
    path: "/admin/feedback",
    icon: Frown ,
  }
];

export const addEventFormElements = [
  {
    label: "Event Image",
    name: "image",
    componentType: "file",
    placeholder: "Upload event image",
  },
  {
    label: "Event Title",
    name: "title",
    componentType: "input",
    type: "text",
    placeholder: "Enter event title",
  },
  {
    label: "Date",
    name: "date",
    componentType: "input",
    type: "date",
    placeholder: "Select event date",
  },
  {
    label: "Time",
    name: "time",
    componentType: "input",
    type: "time",
    placeholder: "Select event time",
  },
  {
    label: "Category",
    name: "category",
    componentType: "select",
    options: [
      { id: "networking", label: "Networking" },
      { id: "career", label: "Career" },
      { id: "reunion", label: "Reunion" },
      { id: "webinar", label: "Webinar" },
      { id: "social", label: "Social" },
    ],
  },
  {
    label: "Location",
    name: "location",
    componentType: "input",
    type: "text",
    placeholder: "Enter event location/venue",
  },
  {
    label: "Description",
    name: "description",
    componentType: "textarea",
    placeholder: "Enter event description",
  },
  {
  label: "Status",
  name: "status",
  componentType: "select",
  options: [
    { id: "upcoming", label: "Upcoming" },
    { id: "ongoing", label: "Ongoing" },
    { id: "completed", label: "Completed" },
    { id: "cancelled", label: "Cancelled" },
  ],
},
];

export const UserNavItems = [
  {
    id: "home",
    label: "Home",
    path: "/user/home",
    type: "link",
  },
  {
    id: "about",
    label: "About us",
    path: "/user/about",
    type: "link",
  },

  {
    id: "events",
    label: "Events",
    path: "/user/events",
    type: "link",
  },

  {
    id: "community",
    label: "Alumni Directory",
    path: "/user/community",
    type: "link",
  },
  {
    id: "jobs",
    label: "Jobs Search ",
    type: "link",
    path: "/user/jobs",
  },
  {
    id: "gallery",
    label: "Gallery ",
    type: "link",
    path: "/user/gallery",
  },
  {
    id: "donate",
    label: "Donate",
    path: "/user/donate",
    type: "link",
  },
  {
    id: "news",
    label: "News",
    path: "/user/News",
    type: "link",
  },
  {
    id: "feedback",
    label: "Feedback",
    path: "/user/Feedback",
    type: "link",
  },
];
