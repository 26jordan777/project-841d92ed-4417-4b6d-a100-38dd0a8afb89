CREATE UNIQUE INDEX booking_requests_active_slot_uniq
  ON public.booking_requests (booking_date, booking_time)
  WHERE status <> 'cancelled';