// default open-next.config.ts file created by @opennextjs/cloudflare
import { defineCloudflareConfig } from "@opennextjs/cloudflare/config";

export default defineCloudflareConfig({
	// Use OpenNext default cache behavior on Cloudflare.
	// The previous R2 incremental cache override can schedule longer waitUntil() tasks
	// that may be canceled after response completion in stateless workers.
});
