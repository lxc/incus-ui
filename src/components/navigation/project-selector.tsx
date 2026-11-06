// SPDX-FileCopyrightText: © 2026 Hye Ararat contributors
// SPDX-FileCopyrightText: © 2026 Joseph Maldjian <joseph.maldjian@hyecompany.com>
// SPDX-License-Identifier: Apache-2.0

import { IconAlertCircle, IconRefresh, IconWorld } from "@tabler/icons-react";
import { LoadingStatus, SkeletonList } from "@/components/loading/skeletons";
import { Button } from "@/components/ui/button";
import { OverflowText } from "@/components/ui/overflow-text";
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@/components/ui/select";
import {
	Tooltip,
	TooltipContent,
	TooltipProvider,
	TooltipTrigger,
} from "@/components/ui/tooltip";
import { useProjectScope } from "@/hooks/incus/use-project-scope";
import { useProjects, useProjectsApi } from "@/hooks/incus/use-projects";
import type { CollectionResult } from "@/lib/incus/data/consumers";
import { collectionView } from "@/lib/incus/data/loading";
import {
	ALL_PROJECTS,
	type ProjectScope,
	projectScopeKey,
	scopeFromKey,
} from "@/lib/incus/project-scope";
import { cn } from "@/lib/ui/utils";

export function ProjectSelector({ className }: { className?: string }) {
	const { scope, setScope, isAvailable } = useProjectScope();
	// Names only: one small URL-list request, then kept live by events.
	const projects = useProjects(["name"]);
	const api = useProjectsApi();
	const props = {
		className,
		scope,
		setScope,
		isAvailable,
		projects,
		retry: () => api?.refreshList(["name"]),
	};
	return <Selector {...props} />;
}

type SelectorProps = {
	className?: string;
	scope: ProjectScope;
	setScope: (scope: ProjectScope) => void;
	isAvailable: boolean;
	projects: CollectionResult<{ name: string }>;
	retry: () => void;
};

function Selector({
	className,
	scope,
	setScope,
	isAvailable,
	projects,
	retry,
}: SelectorProps) {
	const names = projects.data ?? [];
	const error = projects.error;
	const view = collectionView(projects);

	const selectedKey = projectScopeKey(scope);
	const unavailable = scope.kind === "project" && !isAvailable;
	const selectedLabel = scope.kind === "all" ? "All Projects" : scope.name;

	return (
		<div className={cn("flex min-w-0 items-center gap-1", className)}>
			<Select
				value={selectedKey}
				onValueChange={(key) => {
					const next = key === null ? null : scopeFromKey(key);
					if (next !== null) {
						setScope(next);
					}
				}}
			>
				<TooltipProvider>
					<Tooltip disabled={!unavailable}>
						<TooltipTrigger
							render={
								<SelectTrigger
									aria-label={`Project: ${selectedLabel}${unavailable ? ", unavailable" : ""}${error ? ", could not load projects" : ""}`}
									className={cn(
										"group/overflow max-w-36 sm:max-w-56",
										(error || unavailable) && "text-destructive",
										unavailable &&
											"border-destructive bg-destructive/10 hover:bg-destructive/20 dark:bg-destructive/10 dark:hover:bg-destructive/20",
									)}
								>
									{(error || unavailable) && (
										<IconAlertCircle
											aria-hidden="true"
											className="size-4 text-destructive"
										/>
									)}
									{scope.kind === "all" && !error && (
										<IconWorld aria-hidden="true" className="size-4" />
									)}
									<SelectValue className="min-w-0">
										<OverflowText text={selectedLabel} />
									</SelectValue>
								</SelectTrigger>
							}
						/>
						<TooltipContent>Unavailable</TooltipContent>
					</Tooltip>
					<SelectContent
						align="end"
						alignItemWithTrigger={false}
						className="w-auto max-w-[min(18rem,calc(100vw-2rem))] p-1"
						listHeader={
							error !== null && (
								<div className="mb-1 flex items-center gap-2 border-b px-2 py-2 text-sm text-destructive">
									<IconAlertCircle
										aria-hidden="true"
										className="size-4 shrink-0"
									/>
									<span>Could not load projects</span>
									<Button
										size="xs"
										variant="outline"
										onClick={retry}
										onKeyDown={(event) => event.stopPropagation()}
									>
										<IconRefresh aria-hidden="true" /> Retry
									</Button>
								</div>
							)
						}
					>
						<SelectItem className="pl-2" value={projectScopeKey(ALL_PROJECTS)}>
							<span className="flex min-w-0 items-center gap-2">
								<IconWorld aria-hidden="true" className="size-4 shrink-0" />
								<span className="truncate">All Projects</span>
							</span>
						</SelectItem>
						{view.kind === "skeleton" && (
							<>
								<LoadingStatus label="Loading projects" />
								<SkeletonList items={3} />
							</>
						)}
						{names.map((project) => (
							<SelectItem
								key={project.name}
								label={project.name}
								className="group/overflow"
								itemTextClassName="text-clip"
								indicatorPosition="start"
								value={projectScopeKey({
									kind: "project",
									name: project.name,
								})}
							>
								<OverflowText text={project.name} />
							</SelectItem>
						))}
						{unavailable && (
							<Tooltip>
								<TooltipTrigger
									render={<div className="group/overflow" />}
									tabIndex={-1}
								>
									<SelectItem
										value={selectedKey}
										disabled
										aria-label={`${selectedLabel}, unavailable`}
										data-variant="destructive"
										itemTextClassName="text-clip"
										className="pl-2 text-destructive focus:text-destructive data-disabled:opacity-100"
									>
										<span className="flex min-w-0 items-center gap-2">
											<IconAlertCircle
												aria-hidden="true"
												className="size-4 shrink-0"
											/>
											<OverflowText text={selectedLabel} />
										</span>
									</SelectItem>
								</TooltipTrigger>
								<TooltipContent>Unavailable</TooltipContent>
							</Tooltip>
						)}
					</SelectContent>
				</TooltipProvider>
			</Select>
		</div>
	);
}
