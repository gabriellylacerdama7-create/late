import type { Metadata } from "next";
import "./globals.css";
import Sidebar from "@/components/Sidebar";
import { TaskProvider } from "@/contexts/TaskContext";

export const metadata: Metadata = {
  title: "TaskFlow",
  description: "Gestão de tarefas para Social Media, Fotografia e Edição de Vídeo",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="pt-BR">
      <body className="antialiased">
        <TaskProvider>
          <div className="flex min-h-screen">
            <Sidebar />
            <main className="flex-1 min-h-screen bg-[#FAF7F2] overflow-x-hidden pb-20 md:pb-0">
              <div className="p-4 md:p-8 max-w-7xl mx-auto">
                {children}
              </div>
            </main>
          </div>
        </TaskProvider>
      </body>
    </html>
  );
}
