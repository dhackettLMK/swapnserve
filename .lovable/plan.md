# Visual Tournament Page

## Goal
Turn the Tournament page into an immediate visual explanation of the 32-team Cup and Plate competition, while retaining live results when a draw exists.

## Changes
- Add a branded opening section with the Swap'n'Serve wordmark and gold CUP graphic.
- Show a clear 32-team flow: opening round, Cup and Plate split, knockouts, and both finals.
- Display visual Cup and Plate brackets with team placeholders before the draw.
- Replace placeholders with real team names, scores and winners once tournament data is available.
- Keep fixtures and standings available below the visual overview when live tournament data exists.
- Optimise the bracket for phones with labelled horizontal scrolling and stable card sizing.

## Technical details
- Reuse the existing Cup layout, colour tokens, type styles and tournament data response.
- Keep the current public tournament request and loading/error handling.
- Update only the tournament presentation and supporting reusable bracket view where needed.
- Verify the page at desktop and phone widths.
