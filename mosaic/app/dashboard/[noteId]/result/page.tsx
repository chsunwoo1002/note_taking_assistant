import { RotateCw } from "lucide-react";
import { getNoteResult } from "@/utils/supabase/note";
import { createNoteResultAction } from "@/app/actions/note-actions";
import { SubmitButton } from "@/components/buttons/submit-button";
import {
  NoteTypography,
  NoteTypographyType,
} from "@/app/dashboard/[noteId]/result/components/note-typography";
import { ReferencePopover } from "@/app/dashboard/[noteId]/result/components/reference-popover";

interface ResultPageProps {
  params: { noteId: string };
}

export default async function ResultPage({ params }: ResultPageProps) {
  const { noteId } = params;
  const { data, error } = await getNoteResult(noteId);

  if (error || !data) {
    return <div>{error}</div>;
  }

  if (data.length === 0) {
    return (
      <div className="flex flex-col gap-4 justify-center items-center h-full">
        <div>Your note is not created yet.</div>
        <form action={createNoteResultAction}>
          <input type="hidden" name="noteId" value={noteId} />
          <SubmitButton pendingText="Creating Result...">
            Create Result
          </SubmitButton>
        </form>
      </div>
    );
  }

  return (
    <div>
      <div className="flex gap-4">
        <form action={createNoteResultAction}>
          <input type="hidden" name="noteId" value={noteId} />
          <SubmitButton
            className="flex flex-row gap-2 justify-center items-center"
            pendingText="Regenerating Result..."
          >
            <RotateCw size={16} />
            Regenerate
          </SubmitButton>
        </form>
      </div>
      <div>
        {data
          .sort((a, b) => a.order - b.order)
          .map((result) => (
            <div key={result.id} className="py-4">
              <NoteTypography
                type={result.note_type?.type as NoteTypographyType}
                text={result.content}
              />
              <div className="flex flex-row gap-1">
                {result.content_references.map((reference, index) => (
                  <ReferencePopover
                    key={index}
                    index={index}
                    source={reference.note_contents?.source_url}
                    content={reference.note_contents?.content}
                  />
                ))}
              </div>
            </div>
          ))}
      </div>
    </div>
  );
}
