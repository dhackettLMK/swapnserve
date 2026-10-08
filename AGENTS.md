
- Thirty Under Thirty page content lives as one JSON row in `site_content` (key `thirty-under-thirty`), edited in place on the page behind the admin passcode via the `thirty` function; images go to the private `thirty` bucket with long-lived signed URLs, because public buckets are blocked and the organiser must edit without code changes.
- Researched public honouree photos are imported through Lovable Assets and their CDN paths saved in the editable content row; organiser uploads retain the private-bucket flow so either source remains replaceable in the page editor.
