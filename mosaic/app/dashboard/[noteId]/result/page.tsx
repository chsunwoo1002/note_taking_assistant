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
import { RotateCw } from "lucide-react";
import { Popover } from "@radix-ui/react-popover";
import { PopoverContent, PopoverTrigger } from "@/components/ui/popover";
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
      {data.length !== 0 && (
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
      )}
      <div className="">
        {data.length === 0 ? (
          <div className="flex flex-col gap-4 justify-center items-center h-full">
            <div>Your note is not created yet.</div>
            <form action={createNoteResultAction}>
              <input type="hidden" name="noteId" value={noteId} />
              <SubmitButton pendingText="Creating Result...">
                Create Result
              </SubmitButton>
            </form>
          </div>
        ) : (
          data
            .sort((a, b) => a.order - b.order)
            .map((result) => (
              <div key={result.id} className="py-4">
                {result.note_type?.type === "heading1" && (
                  <>
                    <NoteHeading1 text={result.content} />
                    <div className="flex flex-row gap-2">
                      {result.content_references.map((reference, index) => (
                        <Popover key={index}>
                          <PopoverTrigger>{index + 1}</PopoverTrigger>
                          <PopoverContent>
                            {reference.note_contents?.content}
                          </PopoverContent>
                        </Popover>
                      ))}
                    </div>
                  </>
                )}
                {result.note_type?.type === "heading2" && (
                  <>
                    <NoteHeading2 text={result.content} />
                    <div className="flex flex-row gap-2">
                      {result.content_references.map((reference, index) => (
                        <Popover key={index}>
                          <PopoverTrigger>{index + 1}</PopoverTrigger>
                          <PopoverContent>
                            {reference.note_contents?.content}
                          </PopoverContent>
                        </Popover>
                      ))}
                    </div>
                  </>
                )}
                {result.note_type?.type === "heading3" && (
                  <>
                    <NoteHeading3 text={result.content} />
                    <div className="flex flex-row gap-2">
                      {result.content_references.map((reference, index) => (
                        <Popover key={index}>
                          <PopoverTrigger>{index + 1}</PopoverTrigger>
                          <PopoverContent>
                            {reference.note_contents?.content}
                          </PopoverContent>
                        </Popover>
                      ))}
                    </div>
                  </>
                )}
                {result.note_type?.type === "heading4" && (
                  <>
                    <NoteHeading4 text={result.content} />
                    <div className="flex flex-row gap-2">
                      {result.content_references.map((reference, index) => (
                        <Popover key={index}>
                          <PopoverTrigger>{index + 1}</PopoverTrigger>
                          <PopoverContent>
                            {reference.note_contents?.content}
                          </PopoverContent>
                        </Popover>
                      ))}
                    </div>
                  </>
                )}
                {result.note_type?.type === "heading5" && (
                  <>
                    <NoteHeading5 text={result.content} />
                    <div className="flex flex-row gap-2">
                      {result.content_references.map((reference, index) => (
                        <Popover key={index}>
                          <PopoverTrigger>{index + 1}</PopoverTrigger>
                          <PopoverContent>
                            {reference.note_contents?.content}
                          </PopoverContent>
                        </Popover>
                      ))}
                    </div>
                  </>
                )}
                {result.note_type?.type === "heading6" && (
                  <>
                    <NoteHeading6 text={result.content} />
                    <div className="flex flex-row gap-2">
                      {result.content_references.map((reference, index) => (
                        <Popover key={index}>
                          <PopoverTrigger>{index + 1}</PopoverTrigger>
                          <PopoverContent>
                            {reference.note_contents?.content}
                          </PopoverContent>
                        </Popover>
                      ))}
                    </div>
                  </>
                )}
                {result.note_type?.type === "paragraph" && (
                  <>
                    <NoteParagraph text={result.content} />
                    <div className="flex flex-row gap-2">
                      {result.content_references.map((reference, index) => (
                        <Popover key={index}>
                          <PopoverTrigger>{index + 1}</PopoverTrigger>
                          <PopoverContent>
                            {reference.note_contents?.content}
                          </PopoverContent>
                        </Popover>
                      ))}
                    </div>
                  </>
                )}
              </div>
            ))
        )}
      </div>
    </div>
  );
}
