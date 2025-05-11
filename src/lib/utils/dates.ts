import type { DateEntry } from './entries';

const timezoneOffset = new Date().getTimezoneOffset() * 60 * 1000;

export function getTimezoneRemovedDateObject(): Date {
	const currentDate = new Date();
	return new Date(currentDate.getTime() - timezoneOffset);
}

export function getCurrentDateString(): string {
	return getTimezoneRemovedDateObject().toISOString().split('T')[0];
}

export function getNiceDateLabelFromDateString(dateString: string): string {
	const [year, month, day] = dateString.split('-').map(Number);
	const months = [
		'January',
		'February',
		'March',
		'April',
		'May',
		'June',
		'July',
		'August',
		'September',
		'October',
		'November',
		'December'
	];
	return `${months[month - 1]} ${day}, ${year}`;
}

export function calculateDaysSinceToday(dates: DateEntry[]): number {
	if (!dates.length) return 0;
	const mostRecentDate = dates
		.map((dateObj) => Object.keys(dateObj)[0])
		.sort()
		.reverse()[0];
	const diffTime = Math.abs(
		new Date().getTime() - new Date(mostRecentDate).getTime() - timezoneOffset
	);
	return Math.floor(diffTime / (1000 * 60 * 60 * 24));
}
