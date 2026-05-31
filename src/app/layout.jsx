import "./globals.css";
import { Urbanist } from "next/font/google";
import Script from "next/script";
import SiteHeader from "@/components/ui/SiteHeader";
import SmoothScroll from "@/components/ui/SmoothScroll";
import Preloader from "@/components/ui/Preloader";

const urbanist = Urbanist({ subsets: ["latin"], display: "swap" });

export const metadata = {
  title: "Krish | Video Editor & Motion Designer",
  description: "Cinematic 3D portfolio for a premium motion designer.",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className={urbanist.className}>
        <Script src="https://cdnjs.cloudflare.com/ajax/libs/three.js/r121/three.min.js" strategy="beforeInteractive" />
        <Script src="https://cdn.jsdelivr.net/npm/vanta@latest/dist/vanta.net.min.js" strategy="beforeInteractive" />
        <Preloader />
        <SmoothScroll />
        <SiteHeader />
        <main>{children}</main>
      </body>
    </html>
  );
}
