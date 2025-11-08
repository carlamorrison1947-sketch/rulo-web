"use client";

import { useState, useRef, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { 
  User, 
  Tv, 
  LayoutDashboard, 
  FileVideo, 
  Shield, 
  Scale, 
  Star, 
  Wallet, 
  Settings, 
  SlidersHorizontal, 
  Moon, 
  LogOut,
  Clapperboard
} from "lucide-react";
import { useTheme } from "next-themes";
import { Switch } from "@/components/ui/switch";
import Link from "next/link";
import { useClerk } from "@clerk/nextjs";

interface AuthUserMenuProps {
  user: {
    username: string;
    imageUrl?: string;
    isStreamer: boolean;
  };
}

export function AuthUserMenu({ user }: AuthUserMenuProps) {
  const [isOpen, setIsOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);
  const { theme, setTheme } = useTheme();
  const { signOut } = useClerk();

  // Cerrar menú al hacer clic fuera
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }

    if (isOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isOpen]);

  return (
    <div className="relative" ref={menuRef}>
      {/* Botón trigger con avatar - Círculo azul celeste */}
      <Button
        variant="ghost"
        size="icon"
        onClick={() => setIsOpen(!isOpen)}
        className="rounded-full bg-cyan-600 hover:bg-cyan-500 overflow-hidden transition-colors"
      >
        {user.imageUrl ? (
          <img 
            src={user.imageUrl} 
            alt={user.username}
            className="w-full h-full object-cover"
          />
        ) : (
          <User className="h-5 w-5 text-white" />
        )}
      </Button>

      {/* Menú desplegable */}
      {isOpen && (
        <div className="absolute right-0 mt-2 w-72 bg-[#252731] border border-gray-700 rounded-lg shadow-xl overflow-hidden z-50">
          {/* Header con usuario */}
          <div className="p-4 border-b border-gray-700">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-cyan-600 flex items-center justify-center overflow-hidden">
                {user.imageUrl ? (
                  <img 
                    src={user.imageUrl} 
                    alt={user.username}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <User className="h-5 w-5 text-white" />
                )}
              </div>
              <div className="flex-1">
                <p className="font-semibold">{user.username}</p>
              </div>
            </div>
          </div>

          {/* Opciones del menú */}
          <div className="py-2">
            {/* Dashboard o Ser Streamer */}
            <Link href={`/u/${user.username}/studio`}>
              <button 
                className="w-full flex items-center px-4 py-2.5 hover:bg-gray-700 transition-colors relative"
                onClick={() => setIsOpen(false)}
              >
                {user.isStreamer ? (
                  <>
                    <LayoutDashboard className="h-5 w-5 mr-3" />
                    <span>Dashboard</span>
                  </>
                ) : (
                  <>
                    <Clapperboard className="h-5 w-5 mr-3" />
                    <span>Ser Streamer</span>
                    {/* Círculo azul celeste */}
                    <span className="absolute top-2 right-4 h-2 w-2 bg-cyan-400 rounded-full shadow-lg shadow-cyan-400/50 animate-pulse"></span>
                  </>
                )}
              </button>
            </Link>

            {/* Canal */}
            <Link href={`/${user.username}`}>
              <button 
                className="w-full flex items-center px-4 py-2.5 hover:bg-gray-700 transition-colors"
                onClick={() => setIsOpen(false)}
              >
                <Tv className="h-5 w-5 mr-3" />
                <span>Canal</span>
              </button>
            </Link>

            {/* Resumen de stream */}
            <Link href={`/u/${user.username}/stream-summary`}>
              <button 
                className="w-full flex items-center px-4 py-2.5 hover:bg-gray-700 transition-colors"
                onClick={() => setIsOpen(false)}
              >
                <FileVideo className="h-5 w-5 mr-3" />
                <span>Resumen de stream</span>
              </button>
            </Link>

            {/* Centro de privacidad */}
            <Link href="/privacy">
              <button 
                className="w-full flex items-center px-4 py-2.5 hover:bg-gray-700 transition-colors"
                onClick={() => setIsOpen(false)}
              >
                <Shield className="h-5 w-5 mr-3" />
                <span>Centro de privacidad</span>
              </button>
            </Link>

            {/* Portal de apelaciones */}
            <Link href="/appeals">
              <button 
                className="w-full flex items-center px-4 py-2.5 hover:bg-gray-700 transition-colors"
                onClick={() => setIsOpen(false)}
              >
                <Scale className="h-5 w-5 mr-3" />
                <span>Portal de apelaciones</span>
              </button>
            </Link>

            <div className="h-px bg-gray-700 my-2" />

            {/* Suscripciones */}
            <Link href="/subscriptions">
              <button 
                className="w-full flex items-center px-4 py-2.5 hover:bg-gray-700 transition-colors"
                onClick={() => setIsOpen(false)}
              >
                <Star className="h-5 w-5 mr-3" />
                <span>Suscripciones</span>
              </button>
            </Link>

            {/* Twitch Wallet */}
            <Link href="/wallet">
              <button 
                className="w-full flex items-center px-4 py-2.5 hover:bg-gray-700 transition-colors"
                onClick={() => setIsOpen(false)}
              >
                <Wallet className="h-5 w-5 mr-3" />
                <span>FacuGo! Wallet</span>
              </button>
            </Link>

            <div className="h-px bg-gray-700 my-2" />

            {/* Configuración */}
            <Link href="/settings">
              <button 
                className="w-full flex items-center px-4 py-2.5 hover:bg-gray-700 transition-colors"
                onClick={() => setIsOpen(false)}
              >
                <Settings className="h-5 w-5 mr-3" />
                <span>Configuración</span>
              </button>
            </Link>

            {/* Ajuste de contenido */}
            <Link href="/content-settings">
              <button 
                className="w-full flex items-center px-4 py-2.5 hover:bg-gray-700 transition-colors"
                onClick={() => setIsOpen(false)}
              >
                <SlidersHorizontal className="h-5 w-5 mr-3" />
                <span>Ajuste de contenido</span>
              </button>
            </Link>

            {/* Fondo oscuro con toggle */}
            <div className="flex items-center px-4 py-2.5 hover:bg-gray-700 transition-colors">
              <Moon className="h-5 w-5 mr-3" />
              <span className="flex-1">Fondo oscuro</span>
              <Switch
                checked={theme === "dark"}
                onCheckedChange={(checked) => setTheme(checked ? "dark" : "light")}
                className="data-[state=checked]:bg-purple-600"
              />
            </div>

            <div className="h-px bg-gray-700 my-2" />

            {/* Cerrar sesión */}
            <button 
              className="w-full flex items-center px-4 py-2.5 hover:bg-gray-700 transition-colors text-red-400 hover:text-red-300"
              onClick={() => {
                setIsOpen(false);
                signOut();
              }}
            >
              <LogOut className="h-5 w-5 mr-3" />
              <span>Cerrar sesión</span>
            </button>
          </div>
        </div>
      )}
    </div>
  );
}