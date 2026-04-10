import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "TrustFL — Privacy-Preserving Federated Learning",
  description:
    "A privacy-preserving federated learning platform with blockchain verification for secure multi-hospital collaborative model training.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        <link
          href="https://fonts.googleapis.com/css2?family=Space+Mono:wght@400;700&family=Outfit:wght@300;400;500;600;700;800&display=swap"
          rel="stylesheet"
        />
      </head>
      <body className="antialiased">{children}</body>
    </html>
  );
}
