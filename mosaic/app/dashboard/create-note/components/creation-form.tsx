"use client";

import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { createNoteAction } from "@/app/actions/note-actions";
import { SubmitButton } from "@/components/buttons/submit-button";
import { FormButton } from "@/components/buttons/form-button";

export const CreationFormSchema = z.object({
  title: z.string().min(1, { message: "Title is required" }),
  instruction: z.string().optional().describe("Optional instruction"),
});

export type CreationFormFields = z.infer<typeof CreationFormSchema>;

export default function CreationForm() {
  const form = useForm<CreationFormFields>({
    resolver: zodResolver(CreationFormSchema),
    defaultValues: {
      title: "",
      instruction: undefined,
    },
  });

  const onSubmit = async (data: CreationFormFields) => {
    await createNoteAction(data);
    form.reset();
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
        <FormField
          control={form.control}
          name="title"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Title</FormLabel>
              <FormControl>
                <Input placeholder="Title" {...field} />
              </FormControl>
              <FormDescription>This is the title of the note.</FormDescription>
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
              <FormControl>
                <Textarea
                  placeholder="Instruction (Optional)"
                  rows={10}
                  {...field}
                />
              </FormControl>
              <FormDescription>
                This is the instruction of the note during the creation process.
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormButton
          pending={form.formState.isSubmitting}
          pendingText="Creating..."
        >
          Create
        </FormButton>
      </form>
    </Form>
  );
}
