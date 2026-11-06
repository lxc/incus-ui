// SPDX-FileCopyrightText: © 2026 Joseph Maldjian <joseph.maldjian@hyecompany.com>
// SPDX-License-Identifier: Apache-2.0

import { fileURLToPath } from "node:url";
import babel from "@rolldown/plugin-babel";
import tailwindcss from "@tailwindcss/vite";
import { devtools } from "@tanstack/devtools-vite";
import { tanstackRouter } from "@tanstack/router-plugin/vite";
import viteReact, { reactCompilerPreset } from "@vitejs/plugin-react";
import { defineConfig } from "vite";

const config = defineConfig(({ command }) => ({
	resolve: {
		tsconfigPaths: true,
		alias: {
			"#collection-debug": fileURLToPath(
				new URL(
					command === "serve"
						? "./src/components/debug/use-collection-watch.ts"
						: "./src/hooks/incus/collection-watch-debug-stub.ts",
					import.meta.url,
				),
			),
		},
	},
	plugins: [
		tanstackRouter({
			target: "react",
			autoCodeSplitting: true,
		}),
		devtools(),
		tailwindcss(),
		viteReact(),
		babel({ presets: [reactCompilerPreset()] }),
	],
	base: "/ui",
}));

export default config;
