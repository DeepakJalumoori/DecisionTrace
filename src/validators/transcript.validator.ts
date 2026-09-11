import { z } from "zod";

export const transcriptSchema = z.object({
  content: z
    .string()
    .nonempty()
    .refine(
      (content) => {
        return content.trim().length > 0;
      },
      {
        message: "Transcript cannot be empty!",
      },
    ),
});
