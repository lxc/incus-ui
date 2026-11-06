// SPDX-FileCopyrightText: © 2026 Joseph Maldjian <joseph.maldjian@hyecompany.com>
// SPDX-License-Identifier: Apache-2.0

import { useSyncExternalStore } from "react";
import type { CollectionResult, Watch } from "@/lib/incus/data/consumers";

const noop = () => () => undefined;

export function useCollectionWatch<T>(
	watch: Watch<CollectionResult<T>> | null,
	fallback: CollectionResult<T>,
): CollectionResult<T> {
	return useSyncExternalStore(
		watch?.subscribe ?? noop,
		() => (watch ? watch.getSnapshot() : fallback),
		() => fallback,
	);
}
