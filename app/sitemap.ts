import type { MetadataRoute } from "next";
import { SITE_URL } from "@/lib/contact";

export default function sitemap(): MetadataRoute.Sitemap {
  return ["/", "/services", "/software", "/contact"].map((path) => ({
    url: `${SITE_URL}${path}`,
  }));
}