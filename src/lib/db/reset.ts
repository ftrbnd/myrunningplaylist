import 'dotenv/config';

import * as schema from '@/lib/db/schema';
import { drizzle } from 'drizzle-orm/neon-http';
import { reset } from 'drizzle-seed';

async function main() {
	const db = drizzle(process.env.DATABASE_URL!);
	await reset(db, schema);

	console.log('Successfully reset database');
}

main();
