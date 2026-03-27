interface CancelFormProps {
  guestName: string | null | undefined
  onCancel: () => void 
  isPending: boolean
  error: string | null 
}

export const CancelForm = ({ guestName, onCancel, isPending, error }: CancelFormProps) => {
  return (
    <div>
      <p>Booked by: {guestName}</p>
      <form onSubmit={(e) => {
        e.preventDefault()
        onCancel()
      }}>
        {error && <p className="booking-error">{error}</p>}
        <button type="submit" className="btn-cancel" disabled={isPending}>
          {isPending ? "Cancelling..." : "Cancel Booking"}
        </button>
      </form>
    </div>
  );
}
