// components/join-banner.tsx
"use client";

import { useUser } from "@clerk/nextjs";
import { Button } from "@/components/ui/button";
import { SignInButton } from "@clerk/nextjs";
import { Sparkles } from "lucide-react";

export function JoinBanner() {
  const { isSignedIn } = useUser();

  // No mostrar si está logueado
  if (isSignedIn) {
    return null;
  }

  return (
    <div className="fixed bottom-0 left-0 right-0 z-[60] bg-gradient-to-r from-cyan-600 to-cyan-700 border-t border-cyan-500/30 shadow-2xl">
      <div className="max-w-screen-2xl mx-auto px-4 py-3 flex items-center justify-between gap-4 flex-wrap sm:flex-nowrap">
        <div className="flex items-center gap-3 flex-1 min-w-0">
          <div className="hidden sm:flex items-center justify-center w-10 h-10 bg-white/10 rounded-full flex-shrink-0">
            <Sparkles className="h-5 w-5 text-white" />
          </div>
          <div className="flex-1 min-w-0">
            <h3 className="text-white font-semibold text-sm sm:text-base truncate">
              ¡Únete a la comunidad de FacuGo! Stream!
            </h3>
            <p className="text-cyan-100 text-xs sm:text-sm truncate">
              Descubre las mejores transmisiones en vivo en cualquier lugar.
            </p>
          </div>
        </div>

        <SignInButton mode="modal">
          <Button 
            size="lg"
            className="bg-white text-cyan-700 hover:bg-cyan-50 font-semibold shadow-lg whitespace-nowrap flex-shrink-0"
          >
            Regístrate
          </Button>
        </SignInButton>
      </div>
    </div>
  );
}