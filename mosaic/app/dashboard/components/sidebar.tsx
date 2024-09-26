import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { getNotes } from "@/utils/supabase/note";
import { ScrollArea } from "@radix-ui/react-scroll-area";
import Link from "next/link";

export async function Sidebar() {
  const notes = await getNotes();

  if (notes.error || !notes.data) {
    return <div>{notes.error}</div>;
  }

  return (
    <div className="sticky left-2 top-20 h-[calc(100vh-6rem)]">
      <Card className="w-72 mr-4 p-4 flex flex-col gap-2 h-full">
        {/* Scrollable notes list */}
        <div className="flex flex-col gap-2 flex-1 overflow-y-auto scrollbar-hide">
          <Label className="px-2">Notes</Label>
          <Separator className="my-2" />
          {notes.data.map((note) => (
            <Link href={`/dashboard/${note.id}/result`} key={note.id}>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button variant="ghost" className="w-full justify-start p-2">
                    <span className="truncate">{note.title}</span>
                  </Button>
                </TooltipTrigger>
                <TooltipContent>
                  <p>{note.title}</p>
                </TooltipContent>
              </Tooltip>
            </Link>
          ))}
        </div>
        {/* Fixed "Create Note" button at the bottom */}
        <div className="flex-shrink-0">
          <Separator className="my-2" />
          <Link href="/dashboard/create-note">
            <Button className="w-full">Create Note</Button>
          </Link>
        </div>
      </Card>
    </div>
  );
}
