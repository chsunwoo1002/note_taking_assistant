import { IconButton } from "@/components/buttons/icon-button";
import { Card, CardContent, CardFooter, CardTitle } from "@/components/ui/card";
import { getNoteContents } from "@/utils/supabase/note";
import { Trash2 } from "lucide-react";
import Link from "next/link";
import { deleteNoteAction } from "@/app/actions/note-actions";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";

export default async function ContentsPage({
  params,
}: {
  params: { noteId: string };
}) {
  const { noteId } = params;
  const { data, error } = await getNoteContents(noteId);

  if (error || !data) {
    return <div>{error}</div>;
  }

  return (
    <div className="flex flex-col gap-4 justify-center items-center h-full">
      {data.length === 0 ? (
        <div>There is no content in this note.</div>
      ) : (
        <div>
          {data.map((content) => (
            <Card className="p-4 my-4" key={content.id}>
              <CardContent>
                <div>{content.content}</div>
              </CardContent>
              <CardFooter className="flex flex-row justify-between py-0">
                <div className="flex flex-row gap-2">
                  <form action={deleteNoteAction}>
                    <input type="hidden" name="contentId" value={content.id} />
                    <input type="hidden" name="noteId" value={noteId} />
                    <Button type="submit" variant="destructive">
                      Delete
                    </Button>
                  </form>
                  {content.source_url && (
                    <Button>
                      <Link href={content.source_url} target="_blank">
                        Source
                      </Link>
                    </Button>
                  )}
                </div>
                <div className="text-muted-foreground justify-center items-center">
                  added at:{" "}
                  {`${new Date(content.created_at).toLocaleDateString()} ${new Date(content.created_at).toLocaleTimeString()}`}
                </div>
              </CardFooter>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
