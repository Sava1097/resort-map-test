import { useState } from "react";
import { z } from "zod";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Label } from "./ui/label";

interface BookingFormProps  {
  onSubmit: (data: {guestName: string, roomNumber: string}) => void;
  isPending: boolean;
  error: string | null;
  onClose: () => void
}

const bookingSchema = z.object({
  guestName: z.string().trim().min(1, "Name is required"),
  roomNumber: z.string().trim().min(1, "Room is required").regex(/^[0-9]+$/, "Must be a number")
});

export const BookingForm = ({ onSubmit, isPending, error,onClose }: BookingFormProps) => {
  const [name, setName] = useState("");
  const [room, setRoom] = useState("");
  const [localError, setLocalError] = useState<string | null>(null);

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();
    setLocalError(null);
    
    const result = bookingSchema.safeParse({ guestName: name, roomNumber: room });
    
    if (!result.success) {
      setLocalError(result.error.issues[0].message);
      return;
    }
    onSubmit({ guestName: name, roomNumber: room });
  };

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-4">
      <div className="flex flex-col gap-2 text-left">
        <Label htmlFor="guest-name">Guest Name</Label>
        <Input
          id="guest-name"
          value={name}
          onChange={e => setName(e.target.value)}
          placeholder="Enter full name"
          required
        />
      </div>
      <div className="flex flex-col gap-2 text-left">
        <Label htmlFor="room-number">Room Number</Label>
        <Input
          id="room-number"
          value={room}
          onChange={e => setRoom(e.target.value)}
          placeholder="Enter room"
          required
        />
      </div>

      {(error || localError) && <p className="m-0 text-left text-sm text-red-600">{error || localError}</p>}

      <div className="mt-1 flex justify-end gap-2">
        <Button className="hover:cursor-pointer" type="button" variant="outline" onClick={onClose}>Close</Button>
        <Button className="hover:cursor-pointer" type="submit" disabled={isPending}>
          {isPending ? "Booking..." : "Submit"} 
        </Button>
      </div>
    </form>
  );
};
