interface CancelFormProps {
  guestName: string | null | undefined
  onCancel: () => void 
  isPending: boolean
  error: string | null 
  onClose: () => void
}

export const CancelForm = ({ guestName, onCancel, isPending, error, onClose }: CancelFormProps) => {
  return (
    <>
      <p>Booked by: {guestName}</p>
      <form className="booking-form" onSubmit={(e) => {
        e.preventDefault()
        onCancel()
      }}>

        {error && <p className="booking-error">{error}</p>}

        <div className="modal-actions">
          <button type="button" onClick={onClose}>Close</button>
          <button type="submit" className="btn-cancel" disabled={isPending}>
            {isPending ? "Cancelling..." : "Cancel Booking"}
          </button>
        </div>  
      </form>
    </>
  );
}
