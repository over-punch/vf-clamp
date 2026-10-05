// Old paper address (vfclamp.com/talk/paper) — permanently redirects to /paper.
import { permanentRedirect } from 'next/navigation'

/** Redirects the old /talk/paper URL to /paper. */
export default function OldPaper() {
	permanentRedirect('/paper')
}
