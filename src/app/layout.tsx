import "./globals.css";

export const metadata = {
  title: "PROFILE - Prince Fuwamocchi III",
  description: "Prince Fuwamocchi III profile",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="ja">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Italiana&family=Zen+Kaku+Gothic+New:wght@400;500;700&family=Playfair+Display:ital,wght@0,400;0,700;1,400&display=swap"
          rel="stylesheet"
        />
        <noscript>
          <style>{`
            body { overflow-y: auto; height: auto; }
            .page-container { opacity: 1; }
          `}</style>
        </noscript>
      </head>
      <body>{children}</body>
    </html>
  );
}
