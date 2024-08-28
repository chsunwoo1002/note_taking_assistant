import { Note } from "@/app/dashboard/page";
import { Card, CardTitle, CardContent } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import Summary from "./workspace/summary";
import NoteView from "./workspace/note";
import SegmentCollections from "./workspace/content-collection";

interface NoteWorkspaceProps {
  noteId: string;
}

export default function NoteWorkspace({ noteId }: NoteWorkspaceProps) {
  return (
    <Tabs defaultValue="account" className="w-[400px]">
      <TabsList>
        <TabsTrigger value="summary">Summary</TabsTrigger>
        <TabsTrigger value="notes">Notes</TabsTrigger>
        <TabsTrigger value="collections">Collections</TabsTrigger>
      </TabsList>
      <TabsContent value="summary">
        <Summary />
      </TabsContent>
      <TabsContent value="notes">
        <NoteView />
      </TabsContent>
      <TabsContent value="collections">
        <SegmentCollections />
      </TabsContent>
    </Tabs>
  );
}
