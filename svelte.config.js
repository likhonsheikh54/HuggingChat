import adapter from "@sveltejs/adapter-vercel";
import { vitePreprocess } from "@sveltejs/vite-plugin-svelte";
import dotenv from "dotenv";
import { execSync } from "child_process";
import { createRequire } from 'module';

dotenv.config({ path: "./.env.local" });
dotenv.config({ path: "./.env" });

function getCurrentCommitSHA() {
	try {
		return execSync("git rev-parse HEAD").toString();
	} catch (error) {
		console.error("Error getting current commit SHA:", error);
		return "unknown";
	}
}

process.env.PUBLIC_VERSION ??= process.env.npm_package_version;
process.env.PUBLIC_COMMIT_SHA ??= getCurrentCommitSHA();

const require = createRequire(import.meta.url);
const pkg = require('./package.json');

/** @type {import('@sveltejs/kit').Config} */
const config = {
	// Consult https://kit.svelte.dev/docs/integrations#preprocessors
	// for more information about preprocessors
	preprocess: vitePreprocess(),

	kit: {
		adapter: adapter({
			runtime: "edge",
			regions: ["fra1"],
			split: false,
			edge: true,
		}),

		paths: {
			base: process.env.APP_BASE || "",
			relative: false,
		},
		csrf: {
			// handled in hooks.server.ts, because we can have multiple valid origins
			checkOrigin: false,
		},
		csp: {
			directives: {
				...(process.env.ALLOW_IFRAME === "true" ? {} : { "frame-ancestors": ["'none'"] }),
			},
		},
	},
};

export default config;
