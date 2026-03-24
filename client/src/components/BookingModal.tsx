import { useState } from "react";
import type { FormEvent } from "react";
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

  async function handleBook(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setIsBooking(true);
    setBookingError(null);

    try {
      await bookCabana({
        room: roomNumber,
        guestName,
        x: selectedCabana.x,
        y: selectedCabana.y,
      });
      await onSuccess("Booking completed.");
      onClose();
    } catch (error) {
      setBookingError(error instanceof Error ? error.message : "Unknown booking error.");
    } finally {
      setIsBooking(false);
    }
  }

  async function handleCancel(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setIsBooking(true);
    setBookingError(null);

    try {
      await cancelBooking({
        room: roomNumber,
        guestName,
        x: selectedCabana.x,
        y: selectedCabana.y,
      });
      await onSuccess("Booking cancelled.");
      onClose();
    } catch (error) {
      setBookingError(error instanceof Error ? error.message : "Unknown cancel error.");
    } finally {
      setIsBooking(false);
    }
  }

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
