import { useState } from "react";
import { z } from "zod";

interface BookingFormProps  {
  onSubmit: (data: {guestName: string, roomNumber: string}) => void;
  isPending: boolean;
  error: string | null
}

const bookingSchema = z.object({
  guestName: z.string().trim().min(1, "Name is required"),
  roomNumber: z.string().trim().min(1, "Room is required").regex(/^[0-9]+$/, "Must be a number")
});

export const BookingForm = ({ onSubmit, isPending, error }: BookingFormProps) => {
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
    <form onSubmit={handleSubmit} className="booking-form">
      <label>
        Guest Name
        <input 
          value={name} 
          onChange={e => setName(e.target.value)} 
          placeholder="Enter full name" 
          required 
        />
      </label>
      <label>
        Room Number
        <input 
          value={room} 
          onChange={e => setRoom(e.target.value)} 
          placeholder="Enter room" 
          required 
        />
      </label>

      {(error || localError) && <p className="booking-error">{error || localError}</p>}

      <div className="modal-actions">
        <button type="submit" disabled={isPending}>
          {isPending ? "Booking..." : "Submit"} 
        </button>
      </div>
    </form>
  );
};
