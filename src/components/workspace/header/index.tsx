import { UserButton } from "@clerk/nextjs";
import { ArrowLeft, Brain, Keyboard } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";

const WorkspaceHeader = () => {
  return (
    <div className="shadow-md p-3 flex justify-between items-center">
      <div className="flex items-center gap-4">
        <Link href="/dashboard">
          <Button variant="ghost" size="icon">
            <ArrowLeft className="h-5 w-5" />
          </Button>
        </Link>
        <Link href="#" className="flex items-center gap-2">
          <div className="flex aspect-square size-8 items-center justify-center rounded-lg text-sidebar-primary-foreground">
            <Brain className="h-6 w-6 text-blue-600" />
          </div>
          <div className="grid flex-1 text-left text-sm leading-tight">
            <span className="truncate font-semibold">Notely.ai</span>
          </div>
        </Link>
      </div>
      <div className="flex items-center gap-4">
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger>
              <div className="flex items-center gap-1 text-sm text-muted-foreground">
                <Keyboard className="h-4 w-4" />
                <span>Ctrl + S</span>
              </div>
            </TooltipTrigger>
            <TooltipContent>
              <p>Save notes</p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
        <UserButton />
      </div>
    </div>
  );
};

export default WorkspaceHeader;