import { useMutation, useQueryClient } from '@tanstack/react-query';
import { bookCabana } from '../../api';
import type { Tile } from '../map/map-tile';
import { BookingForm } from './booking-form';
import { Dialog, DialogContent, DialogHeader, DialogDescription, DialogTitle } from '../ui/dialog';
import { toast } from 'sonner';

const MAP_QUERY_KEY = ['map-data'] as const;

type BookingModalProps = {
  selectedCabana: Tile;
  onClose: () => void;
};

export const BookingModal = ({
  selectedCabana,
  onClose,
}: BookingModalProps) => {
  const queryClient = useQueryClient();

  const bookMutation = useMutation({
    mutationFn: (data: { guestName: string; roomNumber: string }) =>
      bookCabana({
        guestName: data.guestName,
        room: data.roomNumber,
        x: selectedCabana.x,
        y: selectedCabana.y,
      }),
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: MAP_QUERY_KEY });
      toast.success('Booking completed!', {
        description: 'Cabana is yours!',
        position: 'top-right',
      });
      onClose();
    },
    onError: (err: Error) => {
      toast.error('Booking failed!', {
        description: err.message,
        position: 'top-right',
      });
    },
  });

  return (
    <Dialog open={!!selectedCabana} onOpenChange={() => onClose()}>
      <DialogContent className="lg:p-5">
        <DialogHeader>
          <DialogTitle className="text-center text-xl font-semibold">
            Book cabana ({selectedCabana.x}, {selectedCabana.y})
          </DialogTitle>
          <DialogDescription className='text-center'>
            Please enter your details for booking.
          </DialogDescription>
        </DialogHeader>
        <BookingForm
          onSubmit={(data) => bookMutation.mutate(data)}
          isPending={bookMutation.isPending}
          error={
            bookMutation.error instanceof Error
              ? bookMutation.error.message
              : null
          }
        />
      </DialogContent>
    </Dialog>
  );
};
