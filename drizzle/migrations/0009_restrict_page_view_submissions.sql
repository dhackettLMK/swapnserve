REVOKE INSERT ON TABLE public.page_views FROM anon, authenticated;
GRANT INSERT (path, visitor_id) ON TABLE public.page_views TO anon, authenticated;
GRANT ALL ON TABLE public.page_views TO service_role;

ALTER POLICY "Anyone can record a page view"
ON public.page_views
TO anon, authenticated
WITH CHECK (
  char_length(path) BETWEEN 1 AND 200
  AND left(path, 1) = '/'
  AND left(path, 2) <> '//'
  AND path !~ '[[:cntrl:]?#]'
  AND visitor_id ~ '^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$'
  AND created_at BETWEEN statement_timestamp() - interval '5 minutes' AND statement_timestamp() + interval '5 minutes'
);

COMMENT ON TABLE public.page_views IS 'Anonymous, write-only visitor analytics. Public inserts accept only bounded site paths and random UUID visitor identifiers; record IDs and timestamps use server defaults. No public read, update or delete policies.';