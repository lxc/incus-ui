// SPDX-FileCopyrightText: © 2026 Hye Ararat contributors
// SPDX-License-Identifier: Apache-2.0

import { type ToastTone, toastManager } from "@/components/ui/toast";

export interface NotifyOptions {
	/** Same id as an existing toast replaces it in place. */
	id: string;
	description?: string;
	/** Milliseconds; defaults to the provider timeout. */
	duration?: number;
}

/** Shows a toast from outside React components. */
export function notify(tone: ToastTone, title: string, opts: NotifyOptions) {
	toastManager.add({
		id: opts.id,
		type: tone,
		title,
		description: opts.description,
		timeout: opts.duration,
	});
}
