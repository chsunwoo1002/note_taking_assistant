import { SubmitButton } from "@/components/buttons/submit-button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { createNoteAction } from "../note-actions";

export default function CreateNote() {
  return (
    <div>
      CreateNote
      <form>
        <Label htmlFor="title">Title</Label>
        <Input name="title" placeholder="Title" required />
        <Label htmlFor="instruction">Instruction</Label>
        <Input name="instruction" placeholder="Instruction" />
        <SubmitButton pendingText="Creating..." formAction={createNoteAction}>
          Create
        </SubmitButton>
      </form>
    </div>
  );
}
