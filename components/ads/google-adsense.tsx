"use client";

import { usePathname } from "next/navigation";
import Script from "next/script";

export function GoogleAdSenseClient() {
  const pathname = usePathname();

  // Exclude /login authentication screen
  if (pathname === "/login") {
    return null;
  }

  return (
    <Script
      id="google-adsense-script"
      src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-7449708956977518"
      strategy="afterInteractive"
      crossOrigin="anonymous"
    />
  );
}

export default GoogleAdSenseClient;
