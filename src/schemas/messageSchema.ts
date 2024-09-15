import { z } from "zod";

export const messageValidation = z.object({
    content: z.string()
        .min(10, { message: "Content must be of atleast 10 chars long" }).max(300, { message: "Content must be not more than 300 chars long" })
})