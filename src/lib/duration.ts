import { z } from 'zod';

const defaults = {
	hours: 0 as const,
	minutes: 0 as const,
	seconds: 0,
} as const;

export const durationSchema = z.object({
	hours: z.coerce.number().min(0).max(9).default(defaults.hours).optional(),
	minutes: z.coerce.number().min(0).max(59).default(defaults.minutes),
	seconds: z.coerce.number().min(0).max(59).default(defaults.seconds),
});

export type Duration = z.infer<typeof durationSchema>;

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

export function durationToSeconds(duration?: Duration | null) {
	if (!duration) return 0;

	const hourSeconds = (duration.hours ?? 0) * 3600;
	return duration.seconds + duration.minutes * 60 + hourSeconds;
}
