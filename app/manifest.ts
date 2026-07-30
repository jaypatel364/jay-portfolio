import type { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "Jay — Full Stack Developer",
    short_name: "Jay.dev",
    description:
      "Full Stack Developer crafting performant, scalable web applications with the MERN stack.",
    start_url: "/",
    display: "standalone",
    background_color: "#0e0f17",   // matches dark --background
    theme_color: "#0e0f17",
    orientation: "portrait-primary",
    icons: [
      {
        src: "/icons/icon-192.png",
        sizes: "192x192",
        type: "image/png",
        purpose: "maskable",
      },
      {
        src: "/icons/icon-512.png",
        sizes: "512x512",
        type: "image/png",
        purpose: "any",
      },
    ],
    shortcuts: [
      {
        name: "Resume",
        url: "/resume",
        description: "View print-friendly resume",
      },
    ],
    categories: ["portfolio", "developer", "technology"],
  };
}
