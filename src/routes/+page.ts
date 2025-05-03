import { redirect } from '@sveltejs/kit';
import type { PageLoad } from './$types';

export const load: PageLoad = () => {
	if (typeof window !== 'undefined') {
		const storedEntries = localStorage.getItem('nameEntries');
		if (storedEntries) {
			const entries = JSON.parse(storedEntries);
			if (entries.length > 0) {
				throw redirect(307, '/entries');
			}
		}
	}

	return {};
};
