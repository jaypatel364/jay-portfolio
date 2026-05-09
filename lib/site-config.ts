export const siteConfig = {
  name: "Jay",
  title: "Jay.dev",
  description: "Full Stack Developer crafting performant, scalable web applications with the MERN stack.",
  
  // Contact & Social Links - Update these in one place
  email: "pjay99909@gmail.com",
  github: "https://github.com/jaypatel364",
  linkedin: "hthttps://www.linkedin.com/in/jaypatel7014",
  
  // Location
  location: "Ahmedabad, India",
  
  // Resume
  resumeUrl: "https://drive.google.com/file/d/1851jdeXSi_n8plN3oTTbjqzBwg0brHBI/view?usp=sharing",
} as const;

export type SiteConfig = typeof siteConfig;
