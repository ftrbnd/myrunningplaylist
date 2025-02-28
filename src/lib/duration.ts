export type Duration = {
	hours?: number;
	minutes?: number;
	seconds: number;
};

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
