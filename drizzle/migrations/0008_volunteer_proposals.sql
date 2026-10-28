CREATE TABLE public.volunteer_proposals (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  full_name text NOT NULL,
  email text NOT NULL,
  phone text NOT NULL,
  age_group text NOT NULL,
  skills text NOT NULL DEFAULT '',
  proposal text NOT NULL,
  consent boolean NOT NULL,
  created_at timestamptz NOT NULL DEFAULT now(),
  CONSTRAINT volunteer_proposals_age_group_check CHECK (age_group IN ('18+', 'Under 18')),
  CONSTRAINT volunteer_proposals_consent_check CHECK (consent = true),
  CONSTRAINT volunteer_proposals_proposal_length CHECK (char_length(proposal) BETWEEN 1 AND 2000),
  CONSTRAINT volunteer_proposals_skills_length CHECK (char_length(skills) <= 2000)
);

GRANT INSERT ON public.volunteer_proposals TO anon, authenticated;
GRANT ALL ON public.volunteer_proposals TO service_role;

ALTER TABLE public.volunteer_proposals ENABLE ROW LEVEL SECURITY;

CREATE OR REPLACE FUNCTION public.submit_volunteer_proposal(payload jsonb)
RETURNS uuid
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO 'public'
AS $function$
DECLARE proposal_id uuid; proposer_email text;
BEGIN
  IF payload IS NULL OR octet_length(payload::text) > 12000 THEN RAISE EXCEPTION 'Invalid proposal'; END IF;
  proposal_id := (payload->>'id')::uuid;
  proposer_email := lower(trim(payload->>'email'));
  PERFORM pg_advisory_xact_lock(hashtextextended(proposer_email, 0));
  IF EXISTS (SELECT 1 FROM public.volunteer_proposals WHERE id = proposal_id) THEN RETURN proposal_id; END IF;
  IF (SELECT count(*) FROM public.volunteer_proposals WHERE email = proposer_email AND created_at > now() - interval '1 hour') >= 3 THEN
    RAISE EXCEPTION 'Please wait before sending another proposal';
  END IF;
  INSERT INTO public.volunteer_proposals(id, full_name, email, phone, age_group, skills, proposal, consent)
  VALUES (proposal_id, trim(payload->>'full_name'), proposer_email, trim(payload->>'phone'), payload->>'age_group',
    coalesce(trim(payload->>'skills'), ''), trim(payload->>'proposal'), (payload->>'consent')::boolean);
  RETURN proposal_id;
END;
$function$;

GRANT EXECUTE ON FUNCTION public.submit_volunteer_proposal(jsonb) TO anon, authenticated;
GRANT EXECUTE ON FUNCTION public.submit_volunteer_proposal(jsonb) TO service_role;