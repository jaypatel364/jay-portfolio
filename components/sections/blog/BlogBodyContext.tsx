"use client";

import { createContext, useContext } from "react";
import type { PortableTextBlock } from "@portabletext/types";

const BlogBodyContext = createContext<PortableTextBlock[] | null>(null);

export function BlogBodyProvider({
  body,
  children,
}: {
  body: PortableTextBlock[];
  children: React.ReactNode;
}) {
  return <BlogBodyContext.Provider value={body}>{children}</BlogBodyContext.Provider>;
}

export function useBlogBody() {
  return useContext(BlogBodyContext);
}
