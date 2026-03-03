import { SQLJsDatabase } from 'drizzle-orm/sql-js';
import * as schema from '../schema';

/**
 * Base repository class providing common database access
 */
export abstract class BaseRepository {
  constructor(
    protected readonly db: SQLJsDatabase<typeof schema>,
    protected readonly persistToDisk: () => void,
  ) {}
}
