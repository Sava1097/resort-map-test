import { useState } from "react";
import { z } from "zod";
import type { FormEventHandler } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { bookCabana, cancelBooking } from "../api";
import type { Tile } from "./ResortMap";

type BookingModalProps = {
  selectedCabana: Tile;
  onClose: () => void;
  onSuccess: (message: string) => void | Promise<void>;
};

function BookingModal({ selectedCabana, onClose, onSuccess }: BookingModalProps) {
  const [guestName, setGuestName] = useState("");
  const [roomNumber, setRoomNumber] = useState("");
  const [isBooking, setIsBooking] = useState(false);
  const [bookingError, setBookingError] = useState<string | null>(null);

  const queryClient = useQueryClient();
  const MAP_QUERY_KEY = ["map-data"] as const;

  const formSchema = z.object({
    guestName: z.string().trim().min(1, "Guest name is required."),
    roomNumber: z
      .string()
      .trim()
      .min(1, "Room number is required.")
      .regex(/^[0-9]+$/, "Room number must be a number."),
  });

  const bookMutation = useMutation({
    mutationFn: async (payload: { guestName: string; roomNumber: string }) => {
      return bookCabana({
        room: payload.roomNumber,
        guestName: payload.guestName,
        x: selectedCabana.x,
        y: selectedCabana.y,
      });
    },
    onMutate: () => {
      setIsBooking(true);
      setBookingError(null);
    },
    onSuccess: async () => {
      await onSuccess("Booking completed.");
      await queryClient.invalidateQueries({ queryKey: MAP_QUERY_KEY });
      onClose();
    },
    onError: (error) => {
      setBookingError(error instanceof Error ? error.message : "Unknown booking error.");
      setIsBooking(false);
    },
    onSettled: () => {
      setIsBooking(false);
    },
  });

  const cancelMutation = useMutation({
    mutationFn: async (payload: { guestName: string; roomNumber: string }) => {
      return cancelBooking({
        room: payload.roomNumber,
        guestName: payload.guestName,
        x: selectedCabana.x,
        y: selectedCabana.y,
      });
    },
    onMutate: () => {
      setIsBooking(true);
      setBookingError(null);
    },
    onSuccess: async () => {
      await onSuccess("Booking cancelled.");
      await queryClient.invalidateQueries({ queryKey: MAP_QUERY_KEY });
      onClose();
    },
    onError: (error) => {
      setBookingError(error instanceof Error ? error.message : "Unknown cancel error.");
      setIsBooking(false);
    },
    onSettled: () => {
      setIsBooking(false);
    },
  });

  function validateForm() {
    const result = formSchema.safeParse({ guestName, roomNumber });
    if (!result.success) {
      return result.error.issues[0]?.message ?? "Invalid form data.";
    }
    return null;
  }

  const handleBook: FormEventHandler<HTMLFormElement> = (event) => {
    event.preventDefault();
    const validationError = validateForm();
    if (validationError) {
      setBookingError(validationError);
      return;
    }

    bookMutation.mutate({ guestName, roomNumber });
  };

  const handleCancel: FormEventHandler<HTMLFormElement> = (event) => {
    event.preventDefault();
    const cancelGuestName = selectedCabana.bookedByGuestName;
    const cancelRoomNumber = selectedCabana.bookedByRoom;

    if (!cancelGuestName || !cancelRoomNumber) {
      setBookingError("Cannot cancel: booking owner info is missing.");
      return;
    }

    cancelMutation.mutate({ guestName: cancelGuestName, roomNumber: cancelRoomNumber });
  };

  const isBooked = Boolean(selectedCabana.booked);

  return (
    <div className="modal-overlay" role="presentation" onClick={onClose}>
      <div
        className="modal-content"
        role="dialog"
        aria-modal="true"
        aria-label="Cabana booking form"
        onClick={(event) => event.stopPropagation()}
      >
        {isBooked ? (
          <>
            <h2>
              Cabana ({selectedCabana.x}, {selectedCabana.y})
            </h2>
            <p className="booked-info">
              Booked by {selectedCabana.bookedByGuestName ?? "Unknown"}
            </p>
            <form onSubmit={handleCancel} className="booking-form">
              {bookingError ? <p className="booking-error">{bookingError}</p> : null}
              <div className="modal-actions">
                <button type="button" onClick={onClose} disabled={isBooking}>
                  Close
                </button>
                <button type="submit" disabled={isBooking}>
                  {isBooking ? "Cancelling..." : "Cancel booking"}
                </button>
              </div>
            </form>
          </>
        ) : (
          <>
            <h2>
              Book cabana ({selectedCabana.x}, {selectedCabana.y})
            </h2>
            <form onSubmit={handleBook} className="booking-form">
              <label>
                Guest name
                <input
                  value={guestName}
                  onChange={(event) => setGuestName(event.target.value)}
                  required
                />
              </label>
              <label>
                Room number
                <input
                  value={roomNumber}
                  onChange={(event) => setRoomNumber(event.target.value)}
                  required
                />
              </label>
              {bookingError ? <p className="booking-error">{bookingError}</p> : null}
              <div className="modal-actions">
                <button type="button" onClick={onClose} disabled={isBooking}>
                  Cancel
                </button>
                <button type="submit" disabled={isBooking}>
                  {isBooking ? "Booking..." : "Submit"}
                </button>
              </div>
            </form>
          </>
        )}
      </div>
    </div>
  );
}

export default BookingModal;
