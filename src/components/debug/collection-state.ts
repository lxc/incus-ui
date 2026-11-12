// SPDX-FileCopyrightText: © 2026 Joseph Maldjian <joseph.maldjian@hyecompany.com>
// SPDX-License-Identifier: Apache-2.0

import { useMemo, useSyncExternalStore } from "react";
import { IncusApiError } from "../../lib/incus/client.ts";
import type { CollectionResult } from "../../lib/incus/data/consumers.ts";

export type CollectionMode = "live" | "loading" | "refreshing" | "error";
let modes: Readonly<Record<string, CollectionMode>> = {};
const listeners = new Set<() => void>();
const simulatedError = new IncusApiError(
	"network",
	"Simulated collection error",
);

function subscribe(listener: () => void) {
	listeners.add(listener);
	return () => {
		listeners.delete(listener);
	};
}

export function setCollectionMode(collection: string, mode: CollectionMode) {
	if ((modes[collection] ?? "live") === mode) return;
	modes = { ...modes, [collection]: mode };
	for (const listener of listeners) listener();
}

export function useCollectionMode(collection: string): CollectionMode {
	return useSyncExternalStore(
		subscribe,
		() => modes[collection] ?? "live",
		() => "live",
	);
}

export function useCollectionOverride<T>(
	collection: string,
	result: CollectionResult<T>,
): CollectionResult<T> {
	const mode = useCollectionMode(collection);
	return useMemo(() => applyCollectionMode(mode, result), [mode, result]);
}

export function applyCollectionMode<T>(
	mode: CollectionMode,
	result: CollectionResult<T>,
): CollectionResult<T> {
	switch (mode) {
		case "loading":
			return {
				...result,
				data: undefined,
				missing: [],
				complete: false,
				available: false,
				fresh: false,
				fetching: true,
				error: null,
			};
		case "refreshing":
			return { ...result, fetching: true, error: null };
		case "error":
			return { ...result, fetching: false, error: simulatedError };
		case "live":
			return result;
	}
}
