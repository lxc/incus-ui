// SPDX-FileCopyrightText: © 2026 Joseph Maldjian <joseph.maldjian@hyecompany.com>
// SPDX-License-Identifier: Apache-2.0

import { useCollectionWatch as useLiveCollectionWatch } from "../../hooks/incus/use-collection-watch";
import type { CollectionResult, Watch } from "../../lib/incus/data/consumers";
import { useCollectionOverride } from "./collection-state";

export function createCollectionWatch(
	collection: string,
): typeof useLiveCollectionWatch {
	return function useDebugCollectionWatch<T>(
		watch: Watch<CollectionResult<T>> | null,
		fallback: CollectionResult<T>,
	): CollectionResult<T> {
		const result = useLiveCollectionWatch(watch, fallback);
		return useCollectionOverride(collection, result);
	};
}
