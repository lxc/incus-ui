// SPDX-FileCopyrightText: © 2026 Joseph Maldjian <joseph.maldjian@hyecompany.com>
// SPDX-License-Identifier: Apache-2.0

import {
	type CollectionMode,
	setCollectionMode,
	useCollectionMode,
} from "@/components/debug/collection-state";
import { Button } from "@/components/ui/button";

const choices: { mode: CollectionMode; label: string }[] = [
	{ mode: "live", label: "Live" },
	{ mode: "loading", label: "Initial loading" },
	{ mode: "refreshing", label: "Refreshing" },
	{ mode: "error", label: "Error" },
];

export function CollectionDevtoolsPanel() {
	const mode = useCollectionMode("projects");
	return (
		<div className="flex flex-col gap-3 p-2 text-sm">
			<p>Projects collection appearance</p>
			<div className="flex flex-wrap gap-2">
				{choices.map((choice) => (
					<Button
						key={choice.mode}
						size="sm"
						variant={mode === choice.mode ? "default" : "outline"}
						aria-pressed={mode === choice.mode}
						onClick={() => setCollectionMode("projects", choice.mode)}
					>
						{choice.label}
					</Button>
				))}
			</div>
			<p className="text-muted-foreground">
				Visual override only. Live data and requests continue.
			</p>
		</div>
	);
}
