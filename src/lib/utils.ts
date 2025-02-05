import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
	return twMerge(clsx(inputs));
}

export function getDuration(milliseconds: number) {
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

export function formattedDuration(
	seconds: number,
	minutes?: number,
	hours?: number
) {
	if (!hours)
		return `${minutes?.toFixed(0).padStart(2, '0')}:${seconds
			.toFixed(0)
			.padStart(2, '0')}`;

	return `${hours}:${minutes?.toFixed(0).padStart(2, '0')}:${seconds
		.toFixed(0)
		.padStart(2, '0')}`;
}

export function durationDescription(
	seconds: number,
	minutes?: number,
	hours?: number
) {
	const h = hours ? `${hours} hours, ` : '';
	const m = minutes ? `${minutes} minutes, ` : '';

	return h + m + `${seconds} seconds`;
}

export const raceDistances = {
	metric: ['400m', '800m', '1K', '5K', '10K', '15K', '20K', '30K', '50K'],
	imperial: ['1 mile', '2 miles', '10 miles', 'Half-marathon', 'Marathon'],
} as const;
