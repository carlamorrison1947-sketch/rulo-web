// app/(browse)/[username]/about/navigation-menu.tsx
"use client";

import { useState } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { 
  TrendingUp, 
  FileText, 
  CalendarDays, 
  Video,
  Lock
} from "lucide-react";

interface NavigationMenuProps {
  username: string;
}

export function NavigationMenu({ username }: NavigationMenuProps) {
  const [openDialog, setOpenDialog] = useState<"calendar" | "videos" | null>(null);

  return (
    <>
      <Card className="border-cyan-500/20">
        <div className="p-2 space-y-1">
          <Link href={`/${username}`}>
            <Button 
              variant="ghost" 
              className="w-full justify-start hover:bg-cyan-500/10 hover:text-cyan-600"
            >
              <TrendingUp className="h-4 w-4 mr-2" />
              Inicio
            </Button>
          </Link>
          
          <Button 
            variant="ghost" 
            className="w-full justify-start bg-cyan-500/10 text-cyan-600 hover:bg-cyan-500/20"
          >
            <FileText className="h-4 w-4 mr-2" />
            Acerca de
          </Button>

          <Button 
            variant="ghost" 
            className="w-full justify-start hover:bg-cyan-500/10 hover:text-cyan-600"
            onClick={() => setOpenDialog("calendar")}
          >
            <CalendarDays className="h-4 w-4 mr-2" />
            Calendario
          </Button>

          <Button 
            variant="ghost" 
            className="w-full justify-start hover:bg-cyan-500/10 hover:text-cyan-600"
            onClick={() => setOpenDialog("videos")}
          >
            <Video className="h-4 w-4 mr-2" />
            Videos
          </Button>
        </div>
      </Card>

      {/* Dialog para Calendario */}
      <Dialog open={openDialog === "calendar"} onOpenChange={() => setOpenDialog(null)}>
        <DialogContent className="sm:max-w-md border-cyan-500/20">
          <DialogHeader>
            <div className="flex items-center justify-center mb-4">
              <div className="p-4 bg-cyan-500/10 rounded-full">
                <CalendarDays className="h-10 w-10 text-cyan-500" />
              </div>
            </div>
            <DialogTitle className="text-center text-xl">Calendario</DialogTitle>
            <DialogDescription className="text-center">
              <div className="space-y-4 pt-4">
                <div className="p-4 bg-cyan-500/5 rounded-lg border border-cyan-500/20">
                  <Lock className="h-8 w-8 text-cyan-500 mx-auto mb-3" />
                  <h3 className="font-semibold text-lg mb-2">Próximamente</h3>
                  <p className="text-sm text-muted-foreground">
                    Esta función estará disponible en una próxima actualización. 
                    Podrás ver el horario de streams programados.
                  </p>
                </div>
                <Badge className="bg-cyan-500/20 text-cyan-600">
                  En desarrollo
                </Badge>
              </div>
            </DialogDescription>
          </DialogHeader>
        </DialogContent>
      </Dialog>

      {/* Dialog para Videos */}
      <Dialog open={openDialog === "videos"} onOpenChange={() => setOpenDialog(null)}>
        <DialogContent className="sm:max-w-md border-cyan-500/20">
          <DialogHeader>
            <div className="flex items-center justify-center mb-4">
              <div className="p-4 bg-cyan-500/10 rounded-full">
                <Video className="h-10 w-10 text-cyan-500" />
              </div>
            </div>
            <DialogTitle className="text-center text-xl">Videos</DialogTitle>
            <DialogDescription className="text-center">
              <div className="space-y-4 pt-4">
                <div className="p-4 bg-cyan-500/5 rounded-lg border border-cyan-500/20">
                  <Lock className="h-8 w-8 text-cyan-500 mx-auto mb-3" />
                  <h3 className="font-semibold text-lg mb-2">Próximamente</h3>
                  <p className="text-sm text-muted-foreground">
                    Esta función estará disponible en una próxima actualización. 
                    Aquí encontrarás grabaciones y clips del canal.
                  </p>
                </div>
                <Badge className="bg-cyan-500/20 text-cyan-600">
                  En desarrollo
                </Badge>
              </div>
            </DialogDescription>
          </DialogHeader>
        </DialogContent>
      </Dialog>
    </>
  );
}