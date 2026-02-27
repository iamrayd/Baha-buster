import "./globals.css";
import Sidebar from "./components/layout/Sidebar";

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html>
      <body className="antialiased bg-gray-50">
        <div className="flex">
          <Sidebar />
                <main className="flex-1 ml-64 min-h-screen">
            {children}
          </main>
        </div>
      </body>
    </html>

  );
}