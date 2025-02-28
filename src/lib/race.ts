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
