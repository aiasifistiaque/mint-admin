/** What every editor tab gets: the template as the server last returned it, the tab's working copy, and where to look. */
export type TabProps<W> = {
	doc: any;
	meta: any;
	value: W;
	onChange: (value: W) => void;
	/** Set by a click in the problems panel: the part and, for lists, which item. */
	focus?: { part: string; index?: number; at: number } | null;
};
