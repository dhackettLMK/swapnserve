CREATE TABLE public.volunteer_submissions (
 id uuid PRIMARY KEY,
 full_name text NOT NULL CHECK (length(trim(full_name)) BETWEEN 1 AND 100),
 email text NOT NULL CHECK (length(email) <= 255 AND email ~ '^[^[:space:]@]+@[^[:space:]@]+\.[^[:space:]@]+$'),
 phone text NOT NULL CHECK (phone ~ '^\+?[0-9 ()-]+$' AND length(regexp_replace(phone, '[^0-9]', '', 'g')) BETWEEN 7 AND 15 AND length(phone) <= 30),
 age_group text NOT NULL CHECK (age_group IN ('18+', 'Under 18')),
 roles text[] NOT NULL CHECK (cardinality(roles) BETWEEN 1 AND 14 AND roles <@ ARRAY['Advisory Council','Team Leads','Volunteer Coordinator','Secretary & Minutes Keeper','Treasurer & Finance','Fundraising & Partnerships','Marketing & Media','Social Media & Content','Events & Logistics','Food Team','Youth Workers & Mentors','General Volunteers','Legal & Compliance','Tech & Web']::text[]),
 availability text[] NOT NULL CHECK (cardinality(availability) BETWEEN 1 AND 4 AND availability <@ ARRAY['Weekdays','Evenings','Weekends','Event days only']::text[]),
 skills text NOT NULL DEFAULT '' CHECK (length(skills) <= 2000),
 garda_vetting text NOT NULL CHECK (garda_vetting IN ('Yes','No')),
 referral text NOT NULL CHECK (referral IN ('Social media','Friend','Event','College','Other')),
 consent boolean NOT NULL CHECK (consent = true),
 created_at timestamptz NOT NULL DEFAULT now()
);
GRANT ALL ON public.volunteer_submissions TO service_role;
ALTER TABLE public.volunteer_submissions ENABLE ROW LEVEL SECURITY;
CREATE INDEX volunteer_submissions_email_created ON public.volunteer_submissions(email, created_at);
CREATE FUNCTION public.submit_volunteer_application(payload jsonb) RETURNS uuid
LANGUAGE plpgsql SECURITY DEFINER SET search_path = public
AS $$
DECLARE application_id uuid; applicant_email text;
BEGIN
 IF payload IS NULL OR octet_length(payload::text) > 12000 THEN RAISE EXCEPTION 'Invalid application'; END IF;
 application_id := (payload->>'id')::uuid;
 applicant_email := lower(trim(payload->>'email'));
 PERFORM pg_advisory_xact_lock(hashtextextended(applicant_email, 0));
 IF EXISTS (SELECT 1 FROM public.volunteer_submissions WHERE id = application_id) THEN RETURN application_id; END IF;
 IF (SELECT count(*) FROM public.volunteer_submissions WHERE email = applicant_email AND created_at > now() - interval '1 hour') >= 3 THEN
  RAISE EXCEPTION 'Please wait before sending another application';
 END IF;
 INSERT INTO public.volunteer_submissions(id,full_name,email,phone,age_group,roles,availability,skills,garda_vetting,referral,consent)
 VALUES(application_id,trim(payload->>'full_name'),applicant_email,trim(payload->>'phone'),payload->>'age_group',
 ARRAY(SELECT jsonb_array_elements_text(payload->'roles')),ARRAY(SELECT jsonb_array_elements_text(payload->'availability')),
 coalesce(trim(payload->>'skills'),''),payload->>'garda_vetting',payload->>'referral',(payload->>'consent')::boolean);
 RETURN application_id;
END;
$$;
REVOKE ALL ON FUNCTION public.submit_volunteer_application(jsonb) FROM PUBLIC;
GRANT EXECUTE ON FUNCTION public.submit_volunteer_application(jsonb) TO anon, authenticated, service_role;