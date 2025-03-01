import { z } from 'zod';

export type Race = {
	name: string;
	value: number;
};

type MetricRaceName =
	| '400m'
	| '800m'
	| '1K'
	| '5K'
	| '10K'
	| '15K'
	| '20K'
	| '30K'
	| '50K';
type ImperialRaceName =
	| '1 mile'
	| '2 miles'
	| '10 miles'
	| 'Half-marathon'
	| 'Marathon';

type MetricRaceValue =
	| 400
	| 800
	| 1000
	| 5000
	| 10000
	| 15000
	| 20000
	| 30000
	| 50000;
type ImperialRaceValue = 1 | 2 | 10 | 13.1 | 26.2;

export const metricRaces = new Map<MetricRaceName, MetricRaceValue>([
	['400m', 400],
	['800m', 800],
	['1K', 1000],
	['5K', 5000],
	['10K', 10000],
	['15K', 15000],
	['20K', 20000],
	['30K', 30000],
	['50K', 50000],
]);
export const metricRaceNames = [...metricRaces.keys()];

export const imperialRaces = new Map<ImperialRaceName, ImperialRaceValue>([
	['1 mile', 1],
	['2 miles', 2],
	['10 miles', 10],
	['Half-marathon', 13.1],
	['Marathon', 26.2],
]);
export const imperialRaceNames = [...imperialRaces.keys()];

export const allRaces = new Map([...metricRaces, ...imperialRaces]);
export const allRaceNames = [...metricRaces, ...imperialRaces];

export const distanceSchema = z.object({
	distance: z
		.enum([metricRaceNames[0], ...metricRaceNames.slice(0)])
		.or(z.enum([imperialRaceNames[0], ...imperialRaceNames.slice(0)])),
});
