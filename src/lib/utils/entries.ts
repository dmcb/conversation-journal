export interface Entry {
	name: string;
	dates: string[];
	days?: number;
}

const timezoneOffset = new Date().getTimezoneOffset() * 60 * 1000;

export function getCurrentDate(): string {
	const currentDate = new Date();
	return new Date(currentDate.getTime() - timezoneOffset).toISOString().split('T')[0];
}

export function addEntry(
	entries: Entry[],
	name: string,
	date?: string
): { success: boolean; entries: Entry[] } {
	const trimmedName = name.slice(0, 50).trim();
	if (!trimmedName) return { success: false, entries };

	const targetDate = date || getCurrentDate();
	const existingEntry = entries.find((e) => e.name.toLowerCase() === trimmedName.toLowerCase());

	if (existingEntry) {
		if (existingEntry.dates.includes(targetDate)) return { success: false, entries };
		existingEntry.dates.push(targetDate);
		existingEntry.dates.sort();
		// Create new array to ensure reactivity
		const updatedEntries = [...entries];
		return { success: true, entries: updatedEntries };
	}

	return {
		success: true,
		entries: [...entries, { name: trimmedName, dates: [targetDate] }]
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

export function calculateDays(dates: string[]): number {
	if (!dates.length) return 0;
	const mostRecentDate = dates.sort().reverse()[0];
	const diffTime = Math.abs(
		new Date().getTime() - new Date(mostRecentDate).getTime() - timezoneOffset
	);
	return Math.floor(diffTime / (1000 * 60 * 60 * 24));
}

export function loadEntries(): Entry[] {
	if (typeof localStorage === 'undefined') return [];
	const stored = localStorage.getItem('nameEntries');
	return stored ? JSON.parse(stored) : [];
}
