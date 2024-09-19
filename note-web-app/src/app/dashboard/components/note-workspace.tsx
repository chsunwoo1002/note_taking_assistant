import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import Summary from "./workspace/summary";
import Document from "./workspace/note";
import SegmentCollections from "./workspace/content-collection";

interface NoteWorkspaceProps {
  noteId: string;
}

export default function NoteWorkspace({ noteId }: NoteWorkspaceProps) {
  return (
    <Tabs defaultValue="summary">
      <TabsList>
        <TabsTrigger value="summary">Summary</TabsTrigger>
        <TabsTrigger value="document">Document</TabsTrigger>
        <TabsTrigger value="collections">Collections</TabsTrigger>
      </TabsList>
      <TabsContent value="summary">
        <Summary noteId={noteId} />
      </TabsContent>
      <TabsContent value="document">
        <Document noteId={noteId} />
      </TabsContent>
      <TabsContent value="collections">
        <SegmentCollections noteId={noteId} />
      </TabsContent>
    </Tabs>
  );
}
