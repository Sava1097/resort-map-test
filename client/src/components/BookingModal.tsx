import { useMutation, useQueryClient } from "@tanstack/react-query";
import { bookCabana, cancelBooking } from "../api";
import type { Tile } from "./ResortMap";
import { BookingForm } from "./BookingForm";
import { CancelForm } from "./CancelForm";

type BookingModalProps = {
  selectedCabana: Tile;
  onClose: () => void;
  onSuccess: (message: string) => void | Promise<void>;
};

export const BookingModal = ({ selectedCabana, onClose, onSuccess }: BookingModalProps) => {
  const queryClient = useQueryClient();
  const MAP_QUERY_KEY = ["map-data"] as const;

  const mutation = useMutation({
    mutationFn: async (payload: {
      type: "book" | "cancel";
      guestName: string;
      roomNumber: string;
    }) => {
      if (payload.type === "book") {
        return bookCabana({
          room: payload.roomNumber,
          guestName: payload.guestName,
          x: selectedCabana.x,
          y: selectedCabana.y,
        });
      }
      return cancelBooking({
        room: payload.roomNumber,
        guestName: payload.guestName,
        x: selectedCabana.x,
        y: selectedCabana.y,
      });
    },
    onSuccess: async (_, variants) => {
      const msg = variants.type === "book" ? "Booking completed" : "Booking cancelled";
      await queryClient.invalidateQueries({ queryKey: MAP_QUERY_KEY });
      await onSuccess(msg);
      onClose();
    }
  });

  const serverError = mutation.error instanceof Error ? mutation.error.message : null;

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={e => e.stopPropagation()}>
        
        {!selectedCabana.booked && (
          <>
            <h2>Book cabana ({selectedCabana.x}, {selectedCabana.y})</h2>
            <BookingForm 
              onClose={onClose}
              onSubmit={(data: { guestName: string; roomNumber: string}) => 
                mutation.mutate({ type: "book", ...data })
              }
              isPending={mutation.isPending}
              error={serverError}
            />
          </>
        )}

        {selectedCabana.booked && (
          <>
            <h2>Cabana ({selectedCabana.x}, {selectedCabana.y})</h2>
            <CancelForm 
              onClose={onClose}
              guestName={selectedCabana.bookedByGuestName}
              onCancel={() => mutation.mutate({ 
                type: "cancel", 
                guestName: selectedCabana.bookedByGuestName!, 
                roomNumber: selectedCabana.bookedByRoom! 
              })}
              isPending={mutation.isPending}
              error={serverError}
            />
          </>
        )}
      </div>
    </div>
  );
}
