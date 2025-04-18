import "./globals.css";

const metadata = {
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
      <head>
        <title>{metadata.title}</title>
        <meta name="description" content={metadata.description} />
      </head>
      <body>
        <main className="container mx-auto py-8 px-4">{children}</main>
        <footer className="text-center py-4 text-sm text-gray-500">
          FIFA Song Quiz &copy; {new Date().getFullYear()}
        </footer>
      </body>
    </html>
  );
}
