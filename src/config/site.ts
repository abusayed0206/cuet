type SiteConfig = {
  name: string;
  description: string;
  url: string;
  ogImage: string;

};

const baseUrl = process.env.NEXT_PUBLIC_BASE_URL!;

export const siteConfig: SiteConfig = {
  name: "CUET Profile",
  description: "CUET Profile",
  url: baseUrl,
  ogImage: `/CUETOG.png`, 

};
