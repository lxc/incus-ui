// SPDX-FileCopyrightText: © 2026 Joseph Maldjian <joseph.maldjian@hyecompany.com>
// SPDX-License-Identifier: Apache-2.0

"use client";

import { type CSSProperties, useEffect, useRef, useState } from "react";
import { cn } from "@/lib/ui/utils";
import "./overflow-text.css";

/** Add group/overflow to the interactive parent to animate on its hover or focus. */
export function OverflowText({
	text,
	className,
}: {
	text: string;
	className?: string;
}) {
	const container = useRef<HTMLSpanElement>(null);
	const measure = useRef<HTMLSpanElement>(null);
	const [widths, setWidths] = useState({
		available: 0,
		text: 0,
		truncated: text,
		truncatedWidth: 0,
		source: text,
	});
	useEffect(() => {
		let frame = 0;
		const canvas = document.createElement("canvas");
		const context = canvas.getContext("2d");
		const segments = Array.from(
			new Intl.Segmenter(undefined, { granularity: "grapheme" }).segment(text),
			(segment) => segment.segment,
		);
		const update = () => {
			if (!container.current || !measure.current) return;
			const available = container.current.clientWidth;
			const textWidth = measure.current.getBoundingClientRect().width;
			let truncated = text;
			let truncatedWidth = textWidth;
			if (context && available > 0 && textWidth > available + 1) {
				context.font = getComputedStyle(measure.current).font;
				let low = 0;
				let high = segments.length - 1;
				while (low < high) {
					const count = Math.ceil((low + high) / 2);
					const start = Math.ceil(count / 2);
					const end = count - start;
					const candidate = `${segments.slice(0, start).join("")}…${end ? segments.slice(-end).join("") : ""}`;
					if (context.measureText(candidate).width <= available - 1)
						low = count;
					else high = count - 1;
				}
				const start = Math.ceil(low / 2);
				const end = low - start;
				truncated = `${segments.slice(0, start).join("")}…${end ? segments.slice(-end).join("") : ""}`;
				truncatedWidth = context.measureText(truncated).width;
			}
			setWidths((current) =>
				current.available === available &&
				current.text === textWidth &&
				current.truncated === truncated &&
				current.truncatedWidth === truncatedWidth &&
				current.source === text
					? current
					: {
							available,
							text: textWidth,
							truncated,
							truncatedWidth,
							source: text,
						},
			);
		};
		const observer = new ResizeObserver(() => {
			cancelAnimationFrame(frame);
			frame = requestAnimationFrame(update);
		});
		if (container.current) observer.observe(container.current);
		if (measure.current) observer.observe(measure.current);
		update();
		return () => {
			observer.disconnect();
			cancelAnimationFrame(frame);
		};
	}, [text]);
	const overflow =
		widths.source === text &&
		widths.available > 0 &&
		widths.text > widths.available + 1;
	return (
		<span
			ref={container}
			className={cn("overflow-text", className)}
			data-overflow={overflow || undefined}
			title={overflow ? text : undefined}
			style={
				{
					"--overflow-duration": `${(widths.text + 24) / 35}s`,
					"--overflow-start": `${Math.min(widths.available, widths.truncatedWidth) - widths.text}px`,
				} as CSSProperties
			}
		>
			<span className="sr-only">{text}</span>
			<span ref={measure} aria-hidden="true" className="overflow-text-measure">
				{text}
			</span>
			<span aria-hidden="true" className="overflow-text-rest" dir="auto">
				{overflow ? widths.truncated : text}
			</span>
			{overflow && (
				<span aria-hidden="true" className="overflow-text-track">
					<span>{text}</span>
					<span>{text}</span>
				</span>
			)}
		</span>
	);
}
