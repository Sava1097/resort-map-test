import { useState } from 'react';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import { bookingSchema, type BookingValues } from '@/lib/validations';

type BookingFormProps = {
  onSubmit: (data: BookingValues) => void;
  isPending: boolean;
  error: string | null;
}

export const BookingForm = ({
  onSubmit,
  isPending,
  error,
}: BookingFormProps) => {
  const [name, setName] = useState('');
  const [room, setRoom] = useState('');
  const [localError, setLocalError] = useState<string | null>(null);

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();
    setLocalError(null);

    const result = bookingSchema.safeParse({
      guestName: name,
      roomNumber: room,
    });

    if (!result.success) {
      setLocalError(result.error.issues[0].message);
      return;
    }

    const values: BookingValues = { guestName: name, roomNumber: room };
    onSubmit(values);
  };

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-6 py-2">
      <div className="flex flex-col gap-2.5">
        <Label className="text-xl" htmlFor="guest-name">
          Guest Name
        </Label>
        <Input
          id="guest-name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="Enter full name"
          required
        />
      </div>
      <div className="flex flex-col gap-2.5">
        <Label className="text-xl" htmlFor="room-number">
          Room Number
        </Label>
        <Input
          id="room-number"
          value={room}
          onChange={(e) => setRoom(e.target.value)}
          placeholder="Enter room"
          required
        />
      </div>

      {(error || localError) && (
        <p className="text-left text-sm text-red-600">{error || localError}</p>
      )}

      <div className="flex justify-end gap-2">
        <Button
          className="w-full py-6 transition-all hover:bg-zinc-800 active:scale-95 lg:text-xl"
          type="submit"
          disabled={isPending}
        >
          {isPending ? 'Booking...' : 'Submit'}
        </Button>
      </div>
    </form>
  );
};
