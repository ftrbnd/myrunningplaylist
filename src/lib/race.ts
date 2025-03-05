import { z } from 'zod';

export type Race = {
	name: MetricRaceName | ImperialRaceName;
	value: MetricRaceValue | ImperialRaceValue;
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

export const metricRaceIntervals = new Map<MetricRaceName, string[]>([
	['400m', ['100m', '200m', '300m', '400m']],
	['800m', ['100m', '200m', '300m', '400m', '500m', '600m', '700m', '800m']],
	[
		'1K',
		[
			'100m',
			'200m',
			'300m',
			'400m',
			'500m',
			'600m',
			'700m',
			'800m',
			'900m',
			'1K',
		],
	],
	['5K', ['1K', '2K', '3K', '4K', '5K']],
	['10K', ['1K', '2K', '3K', '4K', '5K', '6K', '7K', '8K', '9K', '10K']],
	[
		'15K',
		[
			'1K',
			'2K',
			'3K',
			'4K',
			'5K',
			'6K',
			'7K',
			'8K',
			'9K',
			'10K',
			'11K',
			'12K',
			'13K',
			'14K',
			'15K',
		],
	],
	['20K', ['4K', '8K', '12K', '16K', '20K']],
	['30K', ['5K', '10K', '15K', '20K', '25K', '30K']],
	['50K', ['5K', '10K', '15K', '20K', '25K', '30K', '40K', '45K', '50K']],
]);

export const imperialRaceIntervals = new Map<ImperialRaceName, string[]>([
	['1 mile', ['0.25mi', '0.5mi', '0.75mi', '1mi']],
	[
		'2 miles',
		['0.25mi', '0.5mi', '0.75mi', '1mi', '1.25mi', '1.5mi', '1.75mi', '2mi'],
	],
	[
		'10 miles',
		['1mi', '2mi', '3mi', '4mi', '5mi', '6mi', '7mi', '8mi', '9mi', '10mi'],
	],
	[
		'Half-marathon',
		[
			'1mi',
			'2mi',
			'3mi',
			'4mi',
			'5mi',
			'6mi',
			'7mi',
			'8mi',
			'9mi',
			'10mi',
			'11mi',
			'12mi',
			'13mi',
		],
	],
	[
		'Marathon',
		[
			'1mi',
			'2mi',
			'3mi',
			'4mi',
			'5mi',
			'6mi',
			'7mi',
			'8mi',
			'9mi',
			'10mi',
			'11mi',
			'12mi',
			'13mi',
			'14mi',
			'15mi',
			'16mi',
			'17mi',
			'18mi',
			'19mi',
			'20mi',
			'21mi',
			'22mi',
			'23mi',
			'24mi',
			'25mi',
			'26mi',
		],
	],
]);

export const allRaces = new Map([...metricRaces, ...imperialRaces]);
export const allRaceNames = [...metricRaces, ...imperialRaces];
export const allRaceIntervals = new Map([
	...metricRaceIntervals,
	...imperialRaceIntervals,
]);

export const distanceSchema = z.object({
	distance: z
		.enum([metricRaceNames[0], ...metricRaceNames.slice(0)])
		.or(z.enum([imperialRaceNames[0], ...imperialRaceNames.slice(0)])),
});
