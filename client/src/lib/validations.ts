import { z } from "zod";

export const bookingSchema = z.object({
  guestName: z.string().trim().min(1, "Name is required"),
  roomNumber: z
    .string()
    .trim()
    .min(1, "Room is required")
    .regex(/^[0-9]+$/, "Must be a number"),
});

export type BookingValues = z.infer<typeof bookingSchema>;
