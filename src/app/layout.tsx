export const metadata = {
  title: "Sigla Cargo - Pepsico",
};

import { Providers } from "@/providers";

import { Open_Sans } from "next/font/google";

const openSans = Open_Sans({
  weight: ["400", "500", "700"],
  style: ["normal", "italic"],
  subsets: ["latin"],
  variable: "--font-openSans",
});

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={openSans.className}>
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
