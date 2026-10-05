// Old PDF address (vfclamp.com/talk/sell-the-styles-ship-the-space.pdf) — permanently redirects to the PDF under /paper.

/** Redirects the old PDF URL with a 308. */
export function GET(req: Request) {
	return Response.redirect(new URL('/paper/sell-the-styles-ship-the-space.pdf', req.url), 308)
}
