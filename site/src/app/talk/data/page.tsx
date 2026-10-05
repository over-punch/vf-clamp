// Old survey data address (vfclamp.com/talk/data) — permanently redirects to /paper/data.
import { permanentRedirect } from 'next/navigation'

/** Redirects the old /talk/data URL to /paper/data. */
export default function OldData() {
	permanentRedirect('/paper/data')
}
