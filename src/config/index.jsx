import { 
  LayoutDashboard, 
  CalendarDays, 
  BriefcaseBusiness, 
  Newspaper 
} from 'lucide-react';

export const AdminSidebarMenuItems = [
  {
    id: 'dashboard',
    label: 'Dashboard',
    path: '/admin/dashboard',
    icon: LayoutDashboard, // ✅ component reference
  },
  {
    id: 'events',
    label: 'Events',
    path: '/admin/events',
    icon: CalendarDays,
  },
  {
    id: 'jobs',
    label: 'Jobs/Internships',
    path: '/admin/jobs',
    icon: BriefcaseBusiness,
  },
  {
    id: 'newsletter',
    label: 'Newsletter',
    path: '/admin/newsletter',
    icon: Newspaper,
  },
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

