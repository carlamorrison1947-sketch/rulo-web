"use client";

import { useState, useRef, useEffect } from "react";
import { SignInButton } from "@clerk/nextjs";
import { Button } from "@/components/ui/button";
import { Globe, Moon, FileText, LogIn, User } from "lucide-react";
import { useTheme } from "next-themes";
import { Switch } from "@/components/ui/switch";

export function UserMenu() {
  const [isOpen, setIsOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);
  const { theme, setTheme } = useTheme();

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
      {/* Botón trigger */}
      <Button
        variant="ghost"
        size="icon"
        onClick={() => setIsOpen(!isOpen)}
        className="rounded-full bg-gray-700 hover:bg-gray-600"
      >
        <User className="h-5 w-5" />
      </Button>

      {/* Menú desplegable */}
      {isOpen && (
        <div className="absolute right-0 mt-2 w-64 bg-[#252731] border border-gray-700 rounded-lg shadow-xl p-2 z-50">
          {/* Botones de autenticación */}
          <div className="flex gap-2 p-2 mb-2">
            <SignInButton mode="modal">
              <Button
                variant="ghost"
                className="flex-1 bg-gray-700 hover:bg-gray-600"
                onClick={() => setIsOpen(false)}
              >
                Log In
              </Button>
            </SignInButton>
            
            <SignInButton mode="modal">
              <Button
                className="flex-1 bg-gradient-to-r from-blue-600 to-white-600 hover:from-white-200 hover:to-blue-500"
                onClick={() => setIsOpen(false)}
              >
                Sign Up
              </Button>
            </SignInButton>
          </div>

          <div className="h-px bg-gray-700 my-2" />

          {/* Language */}
          <button className="w-full flex items-center px-3 py-3 hover:bg-gray-700 rounded cursor-pointer transition-colors">
            <Globe className="h-4 w-4 mr-3" />
            <span className="flex-1 text-left">Language</span>
            <span className="text-gray-400">›</span>
          </button>

          {/* Dark Theme Toggle */}
          <div className="flex items-center px-3 py-3 hover:bg-gray-700 rounded cursor-pointer transition-colors">
            <Moon className="h-4 w-4 mr-3" />
            <span className="flex-1">Dark Theme</span>
            <Switch
              checked={theme === "dark"}
              onCheckedChange={(checked) => setTheme(checked ? "dark" : "light")}
              className="data-[state=checked]:bg-purple-600"
            />
          </div>

          {/* Labeled Content */}
          <button className="w-full flex items-center px-3 py-3 hover:bg-gray-700 rounded cursor-pointer transition-colors">
            <FileText className="h-4 w-4 mr-3" />
            <span className="flex-1 text-left">Labeled Content</span>
            <span className="text-gray-400">›</span>
          </button>

          <div className="h-px bg-gray-700 my-2" />

          {/* Log In alternativo */}
          <SignInButton mode="modal">
            <button 
              className="w-full flex items-center px-3 py-3 hover:bg-gray-700 rounded cursor-pointer transition-colors"
              onClick={() => setIsOpen(false)}
            >
              <LogIn className="h-4 w-4 mr-3" />
              <span>Log In</span>
            </button>
          </SignInButton>
        </div>
      )}
    </div>
  );
}