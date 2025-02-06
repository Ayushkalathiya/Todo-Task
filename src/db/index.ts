
import { drizzle } from 'drizzle-orm/neon-serverless';
import * as schema from './schema'; // Import your schema

// const sql = neon(process.env.DATABASE_URL!);
const db = drizzle(process.env.DATABASE_URL!, { schema });

export default db;