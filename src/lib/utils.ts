import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
	return twMerge(clsx(inputs));
}

export function getDuration(milliseconds: number): Duration {
	const totalSeconds = Math.floor(milliseconds / 1000);
	const hours = Math.floor(totalSeconds / 3600);
	const minutes = Math.floor((totalSeconds % 3600) / 60);
	const seconds = totalSeconds % 60;

	return {
		hours,
		minutes,
		seconds,
	};
}

export function formattedDuration({ seconds, minutes, hours }: Duration) {
	if (!hours)
		return `${minutes?.toFixed(0).padStart(2, '0')}:${seconds
			.toFixed(0)
			.padStart(2, '0')}`;

	return `${hours}:${minutes?.toFixed(0).padStart(2, '0')}:${seconds
		.toFixed(0)
		.padStart(2, '0')}`;
}

export function durationDescription({ seconds, minutes, hours }: Duration) {
	const h = hours ? `${hours} hours, ` : '';
	const m = minutes ? `${minutes} minutes, ` : '';

	return h + m + `${seconds} seconds`;
}

export type Race = {
	name: string;
	value: number;
};

export const metricRaces: Race[] = [
	{ name: '400m', value: 400 },
	{ name: '800m', value: 800 },
	{ name: '1K', value: 1000 },
	{ name: '5K', value: 5000 },
	{ name: '10K', value: 10000 },
	{ name: '15K', value: 15000 },
	{ name: '20K', value: 20000 },
	{ name: '30K', value: 30000 },
	{ name: '50K', value: 50000 },
] as const;

export const imperialRaces: Race[] = [
	{ name: '1 mile', value: 1 },
	{ name: '2 miles', value: 2 },
	{ name: '10 miles', value: 10 },
	{ name: 'Half-marathon', value: 13.2 },
	{ name: 'Marathon', value: 26.2 },
] as const;

export type Duration = {
	hours?: number;
	minutes?: number;
	seconds: number;
};
