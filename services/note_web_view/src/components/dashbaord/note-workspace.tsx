import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import Summary from "./workspace/summary";
import NoteView from "./workspace/note";
import SegmentCollections from "./workspace/content-collection";

interface NoteWorkspaceProps {
  noteId: string;
}

export default function NoteWorkspace({ noteId }: NoteWorkspaceProps) {
  return (
    <Tabs defaultValue="summary">
      <TabsList>
        <TabsTrigger value="summary">Summary</TabsTrigger>
        <TabsTrigger value="notes">Notes</TabsTrigger>
        <TabsTrigger value="collections">Collections</TabsTrigger>
      </TabsList>
      <TabsContent value="summary">
        <Summary noteId={noteId} />
      </TabsContent>
      <TabsContent value="notes">
        <NoteView noteId={noteId} />
      </TabsContent>
      <TabsContent value="collections">
        <SegmentCollections noteId={noteId} />
      </TabsContent>
    </Tabs>
  );
}
