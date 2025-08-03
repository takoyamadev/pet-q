"use client";

import { ChevronUp } from "lucide-react";
import { useEffect, useState } from "react";

/**
 * Renders a floating button that appears after scrolling down, allowing users to smoothly scroll back to the top of the page.
 *
 * The button is only visible when the user has scrolled more than 300 pixels vertically. Clicking the button scrolls the window to the top with a smooth animation. The button includes an accessible label in Japanese.
 */
export function ScrollToTopButton() {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const toggleVisibility = () => {
      if (window.scrollY > 300) {
        setIsVisible(true);
      } else {
        setIsVisible(false);
      }
    };

    window.addEventListener("scroll", toggleVisibility);

    return () => window.removeEventListener("scroll", toggleVisibility);
  }, []);

  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  if (!isVisible) {
    return null;
  }

  return (
    <button
      onClick={scrollToTop}
      className="fixed bottom-6 right-6 z-50 p-3 bg-primary text-primary-foreground rounded-full shadow-lg hover:bg-primary/90 transition-all duration-300 hover:scale-110 cursor-pointer"
      aria-label="画面上まで戻る"
    >
      <ChevronUp className="h-6 w-6" />
    </button>
  );
}
