CREATE TABLE public.booking_requests (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  created_at timestamptz NOT NULL DEFAULT now(),
  service text NOT NULL,
  booking_date date NOT NULL,
  booking_time text NOT NULL,
  phone text NOT NULL,
  name text,
  comment text,
  status text NOT NULL DEFAULT 'new'
);

GRANT ALL ON public.booking_requests TO service_role;

ALTER TABLE public.booking_requests ENABLE ROW LEVEL SECURITY;

CREATE INDEX booking_requests_created_at_idx ON public.booking_requests (created_at DESC);