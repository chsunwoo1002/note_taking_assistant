import { IconButton } from "@/components/buttons/icon-button";
import { Card, CardContent } from "@/components/ui/card";
import { getNoteContents } from "@/utils/supabase/note";
import { Trash2 } from "lucide-react";
import Link from "next/link";
import { deleteNoteAction } from "../../note-actions";
import { Button } from "@/components/ui/button";

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
    <div>
      <div className="flex gap-4">
        <Link href={`/dashboard/${noteId}/result`}>
          <Button>Result</Button>
        </Link>
      </div>
      <div>
        {data.length === 0 ? (
          <div>No contents</div>
        ) : (
          data.map((content) => (
            <Card key={content.id}>
              <CardContent>
                <div>{content.content}</div>
                <div>last updated at {content.created_at}</div>
                <form action={deleteNoteAction}>
                  <input type="hidden" name="contentId" value={content.id} />
                  <input type="hidden" name="noteId" value={noteId} />
                  <IconButton
                    type="submit"
                    icon={<Trash2 />}
                    ariaLabel="Delete Content"
                    tooltipContent="Delete Content"
                    variant="ghost"
                  />
                </form>
              </CardContent>
            </Card>
          ))
        )}
      </div>
    </div>
  );
}
