import { useMutation, useQueryClient } from "@tanstack/react-query";
import { bookCabana } from "../api";
import type { Tile } from "./ResortMap";
import { BookingForm } from "./BookingForm";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "./ui/dialog";
import { toast } from "sonner";

type BookingModalProps = {
  selectedCabana: Tile;
  onClose: () => void;
};

export const BookingModal = ({
  selectedCabana,
  onClose,
}: BookingModalProps) => {
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
      toast.success("Booking  completed!", {
        description: "Cabana is yours!",
        position: "top-right",
      });
      onClose();
    },
    onError: () => {
      toast.error("Booking failed!", {
        description: "Something went wrong! Try again",
        position: "top-right",
      });
    },
  });

  return (
    <Dialog open={!!selectedCabana} onOpenChange={() => onClose()}>
      <DialogContent className="lg: p-5">
        <DialogHeader>
          <DialogTitle className="text-center text-xl font-semibold">
            Book cabana ({selectedCabana.x}, {selectedCabana.y})
          </DialogTitle>
        </DialogHeader>
        <BookingForm
          onSubmit={(data) => mutation.mutate(data)}
          isPending={mutation.isPending}
          error={
            mutation.error instanceof Error ? mutation.error.message : null
          }
        />
      </DialogContent>
    </Dialog>
  );
};
