import { getNoteResult } from "@/utils/supabase/note";
import Link from "next/link";
import { createNoteResultAction } from "../../note-actions";
import { SubmitButton } from "@/components/buttons/submit-button";
import { Card } from "@/components/ui/card";
import {
  NoteHeading1,
  NoteHeading2,
  NoteHeading3,
  NoteHeading4,
  NoteHeading5,
  NoteHeading6,
  NoteParagraph,
} from "@/components/typography/note-typography";
import { Button } from "@/components/ui/button";

export default async function ResultPage({
  params,
}: {
  params: { noteId: string };
}) {
  const { noteId } = params;
  const { data, error } = await getNoteResult(noteId);

  if (error || !data) {
    return <div>{error}</div>;
  }

  return (
    <div>
      <div className="flex gap-4">
        <Link href={`/dashboard/${noteId}/contents`}>
          <Button>Contents</Button>
        </Link>
        <form action={createNoteResultAction}>
          <input type="hidden" name="noteId" value={noteId} />
          <SubmitButton pendingText="Creating Result...">
            Create Result
          </SubmitButton>
        </form>
      </div>
      <div>
        {data.length === 0 ? (
          <div>No results</div>
        ) : (
          data
            .sort((a, b) => a.order - b.order)
            .map((result) => (
              <div key={result.id} className="p-4">
                {result.note_type?.type === "heading1" && (
                  <NoteHeading1 text={result.content} />
                )}
                {result.note_type?.type === "heading2" && (
                  <NoteHeading2 text={result.content} />
                )}
                {result.note_type?.type === "heading3" && (
                  <NoteHeading3 text={result.content} />
                )}
                {result.note_type?.type === "heading4" && (
                  <NoteHeading4 text={result.content} />
                )}
                {result.note_type?.type === "heading5" && (
                  <NoteHeading5 text={result.content} />
                )}
                {result.note_type?.type === "heading6" && (
                  <NoteHeading6 text={result.content} />
                )}
                {result.note_type?.type === "paragraph" && (
                  <NoteParagraph text={result.content} />
                )}
              </div>
            ))
        )}
      </div>
    </div>
  );
}
