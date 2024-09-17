import type { Metadata } from "next";
import "./globals.css";


export const metadata: Metadata = {
  title: "Bioverse Questionnaire App",
  description: "",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className="min-h-screen flex justify-center items-center"
      >
        {children}
      </body>
    </html>
  );
}
