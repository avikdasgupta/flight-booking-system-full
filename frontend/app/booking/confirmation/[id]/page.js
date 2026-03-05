export const metadata = {
  title: 'Booking Confirmation',
  description: 'Your flight booking confirmation details.',
};

import BookingConfirmation from '../../../../components/BookingConfirmation';

export default function BookingConfirmationPage({ params }) {
  return (
    <div className="container section" style={{ maxWidth: '700px' }}>
      <BookingConfirmation bookingId={params.id} />
    </div>
  );
}
