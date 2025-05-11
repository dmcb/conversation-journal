import { getCurrentDateString } from './dates';
export interface DateEntry {
	[key: string]: {
		mood?: 'sad' | 'neutral' | 'good' | 'great' | null;
		note?: string;
	};
}
export interface Entry {
	name: string;
	dates: DateEntry[];
	days?: number;
}

export function addEntry(
	entries: Entry[],
	name: string,
	date?: string,
	mood?: 'sad' | 'neutral' | 'good' | 'great' | null,
	note?: string
): { success: boolean; entries: Entry[] } {
	const trimmedName = name.slice(0, 50).trim();
	if (!trimmedName) return { success: false, entries };

	const targetDate = date || getCurrentDateString();
	const existingEntry = entries.find((e) => e.name.toLowerCase() === trimmedName.toLowerCase());

	if (existingEntry) {
		if (existingEntry.dates.some((dateObj) => targetDate in dateObj))
			return { success: false, entries };
		existingEntry.dates.push({
			[targetDate]: { ...(mood ? { mood } : {}), ...(note ? { note } : {}) }
		});
		existingEntry.dates.sort((a, b) => Object.keys(a)[0].localeCompare(Object.keys(b)[0]));
		// Create new array to ensure reactivity
		const updatedEntries = [...entries];
		return { success: true, entries: updatedEntries };
	}

	return {
		success: true,
		entries: [
			...entries,
			{
				name: trimmedName,
				dates: [{ [targetDate]: { ...(mood ? { mood } : {}), ...(note ? { note } : {}) } }]
			}
		]
	};
}

export function saveEntries(entries: Entry[]): boolean {
	try {
		localStorage.setItem('nameEntries', JSON.stringify(entries));
		return true;
	} catch {
		alert('Failed to save your entries');
		return false;
	}
}

export function loadEntries(): Entry[] {
	if (typeof localStorage === 'undefined') return [];
	const stored = localStorage.getItem('nameEntries');
	return stored ? JSON.parse(stored) : [];
}
