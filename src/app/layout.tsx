import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "FIFA Song Quiz",
  description: "Test your knowledge of FIFA soundtrack songs daily!",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <main className="container mx-auto py-8 px-4">{children}</main>
        <footer className="text-center py-4 text-sm text-gray-500">
          FIFA Song Quiz &copy; {new Date().getFullYear()}
        </footer>
      </body>
    </html>
  );
}
