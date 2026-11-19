import { Inter } from "next/font/google";
import "./globals.css";
import Header from "@/app/components/Layout/Header";
import Footer from "@/app/components/Layout/Footer";
import ScrollToTop from "@/app/components/ScrollToTop";
import NextTopLoader from "nextjs-toploader";
import { Metadata } from "next";
import Script from "next/script";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  icons: {
    icon: [
      {
        url: "/favicon-dark-32x32.png?v=2",
        sizes: "32x32",
        type: "image/png",
        media: "(prefers-color-scheme: dark)",
      },
      {
        url: "/favicon-light-32x32.png?v=2",
        sizes: "32x32",
        type: "image/png",
        media: "(prefers-color-scheme: light)",
      },
      {
        url: "/favicon-dark.png?v=2",
        sizes: "512x512",
        type: "image/png",
        media: "(prefers-color-scheme: dark)",
      },
      {
        url: "/favicon-light.png?v=2",
        sizes: "512x512",
        type: "image/png",
        media: "(prefers-color-scheme: light)",
      },
      {
        url: "/favicon.ico?v=2",
        sizes: "any",
      },
    ],
    shortcut: "/favicon.ico?v=2",
    apple: [
      { url: "/apple-touch-icon.png?v=2", sizes: "180x180", type: "image/png" },
    ],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${inter.className} bg-white text-slate-900 antialiased selection:bg-blue-100 selection:text-blue-900`}>
        {/* Dynamic Favicon Script for Theme Sync */}
        <Script
          id="theme-favicon"
          strategy="beforeInteractive"
          dangerouslySetInnerHTML={{
            __html: `
              (function() {
                function updateFavicon() {
                  try {
                    var isDark = window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches;
                    var target = isDark ? '/favicon-dark-32x32.png?v=2' : '/favicon-light-32x32.png?v=2';
                    var link = document.querySelector("link[data-dynamic-favicon='true']");
                    if (!link) {
                      link = document.createElement('link');
                      link.rel = 'icon';
                      link.type = 'image/png';
                      link.setAttribute('data-dynamic-favicon', 'true');
                      document.head.appendChild(link);
                    }
                    link.href = target;
                  } catch(e) {}
                }
                updateFavicon();
                if (window.matchMedia) {
                  window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', updateFavicon);
                }
              })();
            `,
          }}
        />
        {/* Meta Pixel Code */}
        <Script
          id="meta-pixel"
          strategy="afterInteractive"
          dangerouslySetInnerHTML={{
            __html: `
              !function(f,b,e,v,n,t,s)
              {if(f.fbq)return;n=f.fbq=function(){n.callMethod?
              n.callMethod.apply(n,arguments):n.queue.push(arguments)};
              if(!f._fbq)f._fbq=n;n.push=n;n.loaded=!0;n.version='2.0';
              n.queue=[];t=b.createElement(e);t.async=!0;
              t.src=v;s=b.getElementsByTagName(e)[0];
              s.parentNode.insertBefore(t,s)}(window, document,'script',
              'https://connect.facebook.net/en_US/fbevents.js');
              fbq('init', '1624236479411209');
              fbq('track', 'PageView');
            `,
          }}
        />
        <noscript>
          <img
            height="1"
            width="1"
            style={{ display: "none" }}
            src="https://www.facebook.com/tr?id=1624236479411209&ev=PageView&noscript=1"
            alt=""
          />
        </noscript>

        <NextTopLoader color="#0052cc" />
        <Header />
        {children}
        <Footer />
        <ScrollToTop />
      </body>
    </html>
  );
}