import CreationForm from "./components/creation-form";

export default function CreateNote() {
  return (
    <div className="flex flex-col gap-4 p-4">
      <h1 className="text-2xl font-bold">Create Note</h1>
      <CreationForm />
    </div>
  );
}
