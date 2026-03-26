import { useLocation } from "react-router-dom";
import { useEffect, useRef, useState } from "react";

const PageTransition = ({ children }) => {
  const { pathname } = useLocation();
  const [displayChildren, setDisplayChildren] = useState(children);
  const [phase, setPhase] = useState("idle"); // idle | enter
  const prevPathname = useRef(pathname);

  useEffect(() => {
    if (prevPathname.current === pathname) return;
    prevPathname.current = pathname;

    // Immediately swap content and trigger enter animation
    setDisplayChildren(children);
    setPhase("enter");

    const timer = setTimeout(() => setPhase("idle"), 400);
    return () => clearTimeout(timer);
  }, [pathname, children]);

  // On first mount, also animate in
  useEffect(() => {
    setPhase("enter");
    const timer = setTimeout(() => setPhase("idle"), 400);
    return () => clearTimeout(timer);
  }, []);

  return (
    <div
      style={{
        animation: phase === "enter" ? "pageEnter 0.4s ease forwards" : "none",
      }}
    >
      {displayChildren}
    </div>
  );
};

export default PageTransition;