"use client";

import { useEffect } from "react";
import Head from "next/head";
import { usePathname } from "next/navigation";

export default function DynamicMetaTags({ metadata }) {
  const pathname = usePathname();

  useEffect(() => {
    if (metadata) {
      document.title = metadata.title || "Hire.mn";

      updateMetaTag(
        "description",
        metadata.description || "Онлайн тест, хөндлөнгийн үнэлгээ"
      );
      updateMetaTag("og:title", metadata.title || "Hire.mn");
      updateMetaTag(
        "og:description",
        metadata.description || "Онлайн тест, хөндлөнгийн үнэлгээ"
      );
      updateMetaTag("og:url", metadata.url || `https://hire.mn${pathname}`);
      updateMetaTag("og:image", metadata.image || "https://hire.mn/misc.png");
      updateMetaTag("og:type", metadata.type || "website");
      updateMetaTag("twitter:card", metadata.title || "Hire.mn");
      updateMetaTag(
        "twitter:image",
        metadata.image || "https://hire.mn/misc.png"
      );
    }
  }, [metadata, pathname]);

  const updateMetaTag = (name, content) => {
    let meta = document.querySelector(`meta[property="${name}"]`);
    if (!meta) {
      meta = document.createElement("meta");
      meta.setAttribute("property", name);
      document.head.appendChild(meta);
    }
    meta.setAttribute("content", content);
  };

  return null;
}
