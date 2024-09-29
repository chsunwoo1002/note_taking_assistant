"use client";

import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Button } from "@/components/ui/button";
import { NoteTypography } from "./note-typography";

interface ReferencePopoverProps {
  index: number;
  content?: string | null;
  source?: string | null;
}

export function ReferencePopover({
  index,
  content,
  source,
}: ReferencePopoverProps) {
  if (!content) return null;
  return (
    <Popover>
      <PopoverTrigger>
        <Button variant="outline" size={"sm"}>
          {/** increment index by 1 for display */}
          {index + 1}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="min-w-[600px]">
        {source ? (
          <a href={source} target="_blank" className="hover:underline">
            <NoteTypography type="paragraph" text={content} />
          </a>
        ) : (
          <NoteTypography type="paragraph" text={content} />
        )}
      </PopoverContent>
    </Popover>
  );
}
