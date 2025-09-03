import { z } from "zod";

export const createGroupSchema = z.object({
  name: z.string().min(3, "Group name must be at least 3 characters"),
  code: z.string().min(3, "Group code must be at least 3 characters"),
});

export const joinGroupSchema = z.object({
  code: z.string().length(6, "Group code must be 6 characters"),
});

export const settleUpSchema = z.object({
  amount: z.number(),
  toUser: z.string().min(1, "Select a user"),
});
