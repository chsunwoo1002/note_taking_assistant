import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { getNoteContents } from "@/utils/supabase/note";
import Link from "next/link";
import { deleteNoteAction } from "@/app/actions/note-actions";
import { Button } from "@/components/ui/button";
import Image from "next/image";

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
                {content.content_types?.type === "image" ? (
                  content.signedUrl ? (
                    <div className="flex justify-center items-center">
                      <Image
                        src={content.signedUrl}
                        alt="note image"
                        width={500}
                        height={500}
                      />
                    </div>
                  ) : (
                    <div>No image</div>
                  )
                ) : (
                  <div>{content.content}</div>
                )}
                <div>{content.content}</div>
              </CardContent>
              <CardFooter className="flex flex-row justify-between py-0">
                <div className="flex flex-row gap-2">
                  <form action={deleteNoteAction}>
                    <input type="hidden" name="contentId" value={content.id} />
                    <input type="hidden" name="noteId" value={noteId} />
                    <input
                      type="hidden"
                      name="fileUrl"
                      value={content.file_url || undefined}
                    />
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
