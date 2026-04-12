import Sidebar from "@/src/components/layout/Sidebar";
import Header from "@/src/components/layout/Header";

export default function MainLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex min-h-screen" style={{ background: "var(--color-surface)" }}>
      <Sidebar />
      <div className="flex-1 ml-64 flex flex-col min-h-screen">
        <Header />
        <main className="flex-1 p-8 w-full animate-fade-in">
          {children}
        </main>
        <footer
          className="py-4 px-8 text-xs text-center"
          style={{ color: "var(--color-gray-400)", borderTop: "1px solid var(--color-gray-100)" }}
        >
          © {new Date().getFullYear()} Baha-Buster. Cebu City Flood Control System.
        </footer>
      </div>
    </div>
  );
}