import { useEffect } from "react";
import { useLocation } from "react-router-dom";

const ScrollToTop = () => {
  const { pathname, search } = useLocation();

  useEffect(() => {
    // If there's an eventId in the URL, let EventCard handle scrolling
    if (new URLSearchParams(search).get("eventId")) return;

    const start = window.scrollY;
    const duration = 500;
    const startTime = performance.now();

    const easeOutCubic = (t) => 1 - Math.pow(1 - t, 3);

    const animate = (currentTime) => {
      const elapsed = currentTime - startTime;
      const progress = Math.min(elapsed / duration, 1);
      window.scrollTo(0, start * (1 - easeOutCubic(progress)));
      if (progress < 1) requestAnimationFrame(animate);
    };

    requestAnimationFrame(animate);
  }, [pathname]); // search intentionally excluded — only re-run on page change

  return null;
};

export default ScrollToTop;
// import { useEffect } from "react";
// import { useLocation } from "react-router-dom";

// const ScrollToTop = () => {
//   const { pathname } = useLocation();

//   useEffect(() => {
//     const start = window.scrollY;
//     const duration = 500; // ms
//     const startTime = performance.now();

//     const easeOutCubic = (t) => 1 - Math.pow(1 - t, 3);

//     const animate = (currentTime) => {
//       const elapsed = currentTime - startTime;
//       const progress = Math.min(elapsed / duration, 1);

//       const eased = easeOutCubic(progress);
//       window.scrollTo(0, start * (1 - eased));

//       if (progress < 1) {
//         requestAnimationFrame(animate);
//       }
//     };

//     requestAnimationFrame(animate);
//   }, [pathname]);

//   return null;
// };

// export default ScrollToTop;
