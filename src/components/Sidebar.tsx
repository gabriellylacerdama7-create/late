'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  LayoutDashboard,
  CheckSquare,
  Columns3,
  Calendar,
  Settings,
  ClipboardList,
} from 'lucide-react';

const navItems = [
  { href: '/', label: 'Início', icon: LayoutDashboard },
  { href: '/tarefas', label: 'Tarefas', icon: CheckSquare },
  { href: '/kanban', label: 'Kanban', icon: Columns3 },
  { href: '/calendario', label: 'Calendário', icon: Calendar },
  { href: '/configuracoes', label: 'Configurações', icon: Settings },
];

export default function Sidebar() {
  const pathname = usePathname();

  return (
    <>
      {/* Desktop sidebar */}
      <aside className="hidden md:flex flex-col w-64 min-h-screen bg-[#3D2B1F] text-white">
        <div className="flex items-center gap-3 px-6 py-6 border-b border-white/10">
          <div className="w-9 h-9 bg-[#A0845C] rounded-lg flex items-center justify-center">
            <ClipboardList className="w-5 h-5 text-white" />
          </div>
          <span className="text-xl font-bold tracking-tight">TaskFlow</span>
        </div>

        <nav className="flex-1 px-3 py-4 space-y-1">
          {navItems.map((item) => {
            const isActive =
              item.href === '/'
                ? pathname === '/'
                : pathname.startsWith(item.href);
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition-colors ${
                  isActive
                    ? 'bg-[#A0845C] text-white'
                    : 'text-white/70 hover:bg-white/10 hover:text-white'
                }`}
              >
                <item.icon className="w-5 h-5" />
                {item.label}
              </Link>
            );
          })}
        </nav>

        <div className="px-6 py-4 border-t border-white/10">
          <p className="text-xs text-white/40">TaskFlow v1.0</p>
        </div>
      </aside>

      {/* Mobile bottom nav */}
      <nav className="md:hidden fixed bottom-0 left-0 right-0 z-50 bg-[#3D2B1F] border-t border-white/10 flex justify-around py-2 px-1">
        {navItems.map((item) => {
          const isActive =
            item.href === '/'
              ? pathname === '/'
              : pathname.startsWith(item.href);
          return (
            <Link
              key={item.href}
              href={item.href}
              className={`flex flex-col items-center gap-1 px-2 py-1 rounded-lg text-xs transition-colors ${
                isActive
                  ? 'text-[#C4A882]'
                  : 'text-white/50 hover:text-white/80'
              }`}
            >
              <item.icon className="w-5 h-5" />
              <span className="truncate">{item.label}</span>
            </Link>
          );
        })}
      </nav>
    </>
  );
}
