"use client";

import { useEffect } from "react";

export function ScrollToAnchor() {
  useEffect(() => {
    // URLにハッシュ（#res-1など）がある場合
    if (window.location.hash) {
      const id = window.location.hash.substring(1);
      const element = document.getElementById(id);
      
      if (element) {
        // 少し遅延させてDOMが完全に読み込まれてから実行
        setTimeout(() => {
          const headerOffset = 80;
          const elementPosition = element.getBoundingClientRect().top;
          const offsetPosition = elementPosition + window.scrollY - headerOffset;
          
          window.scrollTo({
            top: offsetPosition,
            behavior: "smooth"
          });
        }, 100);
      }
    }
  }, []);

  return null;
}