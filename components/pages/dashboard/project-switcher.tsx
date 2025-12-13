"use client";

import { useEffect, useState } from "react"
import Link from "next/link";
import { Project } from "@prisma/client";
import { Check, ChevronsUpDown, Plus } from "lucide-react";
import { useSession } from "next-auth/react";
import { cn } from "@/lib/utils";
import { useMediaQuery } from "@/hooks/use-media-query";
import { Button, buttonVariants } from "@/components/ui/button";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"

export default function ProjectSwitcher({ large = false, projects = [] }: { large?: boolean, projects: Project[] }) {
  const { data: session, status, update } = useSession()
  const [openPopover, setOpenPopover] = useState(false)
  const media = useMediaQuery()

  const selectedId = session?.user?.selectedProjectId;
  const selectedProject = projects.find(p => p.id === selectedId) || projects[0];

  useEffect(() => {
    if (status === "loading" || projects.length === 0) {
      return;
    }
    const needsDefaultUpdate = selectedId !== selectedProject.id;
    if (needsDefaultUpdate) {
      try {
        update({ selectedProjectId: selectedProject.id });
      } catch (error) {
      }
    }
  }, [status, selectedId, projects, selectedProject.id, update]);

  const handleProjectChange = async (newProjectId: string) => {
    if (newProjectId === selectedId) {
      setOpenPopover(false);
      return;
    }

    try {
      await update({ selectedProjectId: newProjectId });
      setOpenPopover(false);
    } catch {}
  };

  if (status === "loading") {
    return <ProjectSwitcherPlaceholder />
  }

  if(projects.length === 0) {
    return(
      <Button
        variant="outline"
        className="w-full"
        onClick={() => {}}
      >
        <Plus size={18} className="mr-2" />
        <span className="truncate">New Project</span>
      </Button>
    )
  }

  return (
    <div>
      <Popover open={openPopover} onOpenChange={setOpenPopover}>
        <PopoverTrigger asChild>
          <Button
            variant={openPopover ? "secondary" : "ghost"}
            onClick={() => setOpenPopover(!openPopover)}
          >
            <div className="flex items-center space-x-3 pr-2">
              {media.isMobile ? null : (
                <div className="flex size-8 items-center justify-center rounded-md bg-primary">
                  {selectedProject.name[0].toUpperCase()}
                </div>
              )}
              <div className="flex items-center space-x-3">
                <span
                  className={cn(
                    "inline-block truncate text-sm font-medium xl:max-w-[120px]",
                    large ? "w-full" : "max-w-[80px]",
                  )}
                >
                  {selectedProject.name}
                </span>
              </div>
            </div>
            <ChevronsUpDown
              className="size-4 text-muted-foreground"
              aria-hidden="true"
            />
          </Button>
        </PopoverTrigger>
        <PopoverContent align="start" className="max-w-60 p-2">
          <ProjectList
            selectedId={selectedId}
            projects={projects}
            onSelectProject={handleProjectChange}
          />
        </PopoverContent>
      </Popover>
    </div>
  )
}


function ProjectList({
                       selectedId,
                       projects,
                       onSelectProject,
                     }: {
  selectedId: string | null | undefined;
  projects: Project[]
  onSelectProject: (id: string) => void
}) {
  return (
    <div className="flex flex-col gap-1">
      {projects.map(({ id, name }) => (
        <Link
          key={id}
          className={cn(
            buttonVariants({ variant: "ghost" }),
            "relative flex h-9 items-center gap-3 p-3 text-muted-foreground hover:text-foreground",
          )}
          href="#"
          onClick={(e) => {
            e.preventDefault();
            onSelectProject(id);
          }}
        >
          <span
            className={`flex-1 truncate text-sm ${
              selectedId === id
                ? "font-medium text-foreground"
                : "font-normal"
            }`}
          >
            {name}
          </span>
          {selectedId === id && (
            <span className="absolute inset-y-0 right-0 flex items-center pr-3 text-foreground">
              <Check size={18} aria-hidden="true" />
            </span>
          )}
        </Link>
      ))}
      <Button
        variant="outline"
        className="relative flex h-9 items-center justify-center gap-2 p-2"
        onClick={() => {}}
      >
        <Plus size={18} className="absolute left-2.5 top-2" />
        <span className="flex-1 truncate text-center">New Project</span>
      </Button>
    </div>
  )
}

function ProjectSwitcherPlaceholder() {
  return (
    <div className="flex animate-pulse items-center space-x-1.5 rounded-lg px-1.5 py-2 sm:w-60">
      <div className="h-8 w-36 animate-pulse rounded-md bg-muted xl:w-[180px]" />
    </div>
  )
}
