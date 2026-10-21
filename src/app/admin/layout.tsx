import "@/app/globals.css";

export default function AdminRootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-slate-950 antialiased selection:bg-blue-600 selection:text-white">
      {children}
    </div>
  );
}
