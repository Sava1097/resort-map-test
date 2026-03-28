import { useMutation, useQueryClient } from "@tanstack/react-query";
import { bookCabana} from "../api";
import type { Tile } from "./ResortMap";
import { BookingForm } from "./BookingForm";

type BookingModalProps = {
  selectedCabana: Tile;
  onClose: () => void;
  onSuccess: (message: string) => void | Promise<void>;
};

export const BookingModal = ({ selectedCabana, onClose, onSuccess }: BookingModalProps) => {
  const queryClient = useQueryClient();
  const MAP_QUERY_KEY = ["map-data"] as const;

  const mutation = useMutation({
    mutationFn: (data: { guestName: string; roomNumber: string }) => 
      bookCabana({
        guestName: data.guestName,
        room: data.roomNumber,
        x: selectedCabana.x,
        y: selectedCabana.y,
      }),
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: MAP_QUERY_KEY });
      await onSuccess("Booking completed!");
      onClose();
    }
  });

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={e => e.stopPropagation()}>
        <h2>Book cabana ({selectedCabana.x}, {selectedCabana.y})</h2>
        <BookingForm 
          onClose={onClose}
          onSubmit={(data) => mutation.mutate(data)}
          isPending={mutation.isPending}
          error={mutation.error instanceof Error ? mutation.error.message : null}
        />
      </div>
    </div>
  );
};