import "./globals.css";

import "@fontsource-variable/inter";
import "@fontsource-variable/source-serif-4";
import "@fontsource/ibm-plex-mono";

import { ConvexClientProvider } from "./providers/ConvexClientProvider";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>
        <ConvexClientProvider>{children}</ConvexClientProvider>
      </body>
    </html>
  );
}
