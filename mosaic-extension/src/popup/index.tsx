import { createNote, getNotes } from "@/api/note"
import { Button } from "@/components/ui/button"
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Separator } from "@/components/ui/separator"
import { useUser } from "@/hooks/useUser"
import { Header } from "@/popup/components/header"
import { zodResolver } from "@hookform/resolvers/zod"
import { useEffect, useState } from "react"
import { useForm } from "react-hook-form"
import { z } from "zod"

import "@/style.css"

import { Card } from "@/components/ui/card"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Textarea } from "@/components/ui/textarea"
import { TooltipProvider } from "@/components/ui/tooltip"
import { useSelectedNote } from "@/hooks/useSelectedNote"

const formSchema = z.object({
  title: z.string().min(1),
  instruction: z.string().optional()
})

export default function IndexPopup() {
  const { user } = useUser()
  const [notes, setNotes] = useState<any[]>([])
  const { selectedNote, setSelectedNote } = useSelectedNote()
  const [mode, setMode] = useState<"edit" | "create">("edit")
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      title: "",
      instruction: ""
    }
  })

  const onSubmit = (data: z.infer<typeof formSchema>) => {
    const { title, instruction } = data
    createNote(title, instruction).then(({ data, error }) => {
      if (error) {
        console.error(error)
        // TODO: show error to user
      } else {
        setSelectedNote(data.id)
        setMode("edit")
        setNotes([...notes, data])
      }
    })
  }

  useEffect(() => {
    if (user) {
      getNotes().then(({ data, error }) => {
        if (error) {
          console.error(error)
        } else {
          setNotes(data)
        }
      })
    }
  }, [user])

  if (user === null)
    return (
      <div className="bg-primary text-primary-foreground w-96 h-96 flex items-center justify-center">
        <Button
          variant="secondary"
          onClick={() => {
            window.open("options.html", "_blank")
          }}>
          Log in / Sign up
        </Button>
      </div>
    )

  return (
    <div className="bg-primary text-primary-foreground w-96 h-96">
      <TooltipProvider>
        <Header
          mode={mode}
          toggleMode={() => setMode(mode === "create" ? "edit" : "create")}
        />
        <Separator />
        {mode === "create" ? (
          <div className="flex flex-col gap-2 p-2">
            <Form {...form}>
              <form
                className="flex flex-col gap-2"
                onSubmit={form.handleSubmit(onSubmit)}>
                <div className="flex flex-col gap-2 justify-between">
                  <FormField
                    control={form.control}
                    name="title"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Title</FormLabel>
                        <FormControl>
                          <Input
                            {...field}
                            className="bg-primary"
                            placeholder="Add a title"
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="instruction"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Instruction</FormLabel>
                        <FormControl className="flex-grow">
                          <Textarea
                            {...field}
                            className="bg-primary"
                            placeholder="Add a instruction (optional)"
                            rows={7}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
                <div className="flex flex-col">
                  <Button
                    className="flex flex-row gap-2"
                    variant="secondary"
                    type="submit">
                    Create
                  </Button>
                </div>
              </form>
            </Form>
          </div>
        ) : (
          <div className="h-72 gap-2 p-2">
            <h1 className="text-xl mb-2">Notes</h1>
            <ScrollArea className="h-full w-full rounded-md border">
              <div className="flex-col gap-2">
                {notes.map((note) => (
                  <Button
                    variant={selectedNote === note.id ? "secondary" : "ghost"}
                    className="flex w-11/12 justify-start truncate"
                    key={note.id}
                    onClick={() => setSelectedNote(note.id)}>
                    {note.title}
                    {/* <p className="text-ellipsis"></p> */}
                  </Button>
                ))}
              </div>
            </ScrollArea>
          </div>
        )}
      </TooltipProvider>
    </div>
  )
}
