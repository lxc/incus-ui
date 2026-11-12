// SPDX-FileCopyrightText: © 2026 Joseph Maldjian <joseph.maldjian@hyecompany.com>
// SPDX-License-Identifier: Apache-2.0

import type { useCollectionWatch } from "./use-collection-watch";

export function createCollectionWatch(
	_collection: string,
): typeof useCollectionWatch {
	throw new Error("Collection debug controls are unavailable in production");
}
