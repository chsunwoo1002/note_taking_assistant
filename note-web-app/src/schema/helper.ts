import { z } from "zod";

// Helper functions to create nullable types
export const nullableString = () => z.string().nullable();
export const nullableUrl = () => z.string().url().nullable();

// Helper function to validate a schema
export const validateSchema = (schema: z.ZodType<any>, data: any) => {
  try {
    return schema.parse(data);
  } catch (error) {
    console.error(error);
    return null;
  }
};
