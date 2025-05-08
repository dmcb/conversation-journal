import { writable } from 'svelte/store';

type AlertType = 'success' | 'error';

interface AlertData {
	message: string;
	type: AlertType;
}

function createAlertStore() {
	const { subscribe, set } = writable<AlertData | null>(null);

	return {
		subscribe,
		show: (message: string, type: AlertType = 'success') => {
			set({ message, type });
			setTimeout(() => set(null), 3200); // slightly longer than Alert component duration
		},
		hide: () => set(null)
	};
}

export const alert = createAlertStore();
