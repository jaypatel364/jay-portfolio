import { apiBackendEngineering } from "./api-backend-engineering";
import { frontendDevelopment } from "./frontend-development";
import { fullStackProductDevelopment } from "./full-stack-product-development";
import { mernStackDevelopment } from "./mern-stack-development";
import { mvpDevelopment } from "./mvp-development";
import { performanceOptimization } from "./performance-optimization";
import { saasDevelopment } from "./saas-development";
import type { Service } from "@/lib/services/types";

export const ALL_SERVICES: Service[] = [
  fullStackProductDevelopment,
  saasDevelopment,
  mvpDevelopment,
  apiBackendEngineering,
  performanceOptimization,
  frontendDevelopment,
  mernStackDevelopment,
];

export {
  fullStackProductDevelopment,
  saasDevelopment,
  mvpDevelopment,
  apiBackendEngineering,
  performanceOptimization,
  frontendDevelopment,
  mernStackDevelopment,
};
