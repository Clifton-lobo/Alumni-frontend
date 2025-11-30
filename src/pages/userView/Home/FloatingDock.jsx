import React from "react";
import { FloatingDock } from "@/components/ui/floating-dock";
import { IconBrandFacebook, IconBrandInstagram, IconBrandLinkedin, IconBrandWhatsapp, IconBrandX, IconBrandYoutube } from "@tabler/icons-react";

export function FloatingDockHelper() {
    const links = [
      {
        title: "LinkedIn",
        href: "#",
        iconWrapperClass:
          "bg-[#0A66C2]/20 hover:shadow-[0_0_30px_#0A66C2] transition-all",
        icon: <IconBrandLinkedin className="h-12 w-12 text-[#0A66C2]" />,
      },

      {
        title: "Facebook",
        href: "#",
        iconWrapperClass:
          "bg-[#1877F2]/20 hover:shadow-[0_0_30px_#1877F2] transition-all",
        icon: <IconBrandFacebook className="h-12 w-12 text-[#1877F2]" />,
      },

      {
        title: "Instagram",
        href: "#",
        iconWrapperClass:
          "bg-gradient-to-br from-pink-500/30 via-purple-500/30 to-yellow-400/30 hover:shadow-[0_0_35px_rgba(225,48,108,0.7)] transition-all",
        icon: <IconBrandInstagram className="h-12 w-12 text-pink-500" />,
      },

      {
        title: "WhatsApp Group",
        href: "#",
        iconWrapperClass:
          "bg-[#25D366]/20 hover:shadow-[0_0_30px_#25D366] transition-all",
        icon: <IconBrandWhatsapp className="h-12 w-12 text-[#25D366]" />,
      },

      {
        title: "Twitter (X)",
        href: "#",
        iconWrapperClass:
          "bg-neutral-900/20 hover:shadow-[0_0_30px_#000000] transition-all",
        icon: <IconBrandX className="h-12 w-12 text-black dark:text-white" />,
      },

      {
        title: "YouTube",
        href: "#",
        iconWrapperClass:
          "bg-[#FF0000]/20 hover:shadow-[0_0_30px_#FF0000] transition-all",
        icon: <IconBrandYoutube className="h-12 w-12 text-[#FF0000]" />,
      },
    ];
      
      

  return (
    <div className="flex items-center justify-center w-full py-20">
      <FloatingDock
        mobileClassName=""
        className="scale-150 px-10 py-5 rounded-3xl shadow-xl bg-white/80 backdrop-blur-lg"
        items={links.map((item) => ({
          ...item,
          iconWrapperClass: item.colorClass, // pass bg class to dock
        }))}
      />
    </div>
  );
}
