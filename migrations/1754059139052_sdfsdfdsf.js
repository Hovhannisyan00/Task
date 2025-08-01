/**
 * @type {import('node-pg-migrate').ColumnDefinitions | undefined}
 */
export const shorthands = undefined;

/**
 * @param pgm {import('node-pg-migrate').MigrationBuilder}
 * @param run {() => void | undefined}
 * @returns {Promise<void> | void}
 */
export const up = async (pgm) => {


    // try {
    //   const client = await pool.connect();
    //   await client.query('SELECT NOW()'); // simple query to check connection
    //   client.release();
    //   console.log('Postgres connection successful');
    //   return true;
    // } catch (error) {
    //   console.error('Postgres connection failed:', error);
    //   return false;
    // }



  pgm.createTable('users', {
    id: 'id',
    name: { type: 'varchar(1000)', notNull: true },
    createdAt: {
      type: 'timestamp',
      notNull: true,
      default: pgm.func('current_timestamp'),
    },
  });
  // pgm.createTable('posts', {
  //   id: 'id',
  //   userId: {
  //     type: 'integer',
  //     notNull: true,
  //     references: '"users"',
  //     onDelete: 'CASCADE',
  //   },
  //   body: { type: 'text', notNull: true },
  //   createdAt: {
  //     type: 'timestamp',
  //     notNull: true,
  //     default: pgm.func('current_timestamp'),
  //   },
  // });
  // pgm.createIndex('posts', 'userId');
};

/**
 * @param pgm {import('node-pg-migrate').MigrationBuilder}
 * @param run {() => void | undefined}
 * @returns {Promise<void> | void}
 */
export const down = (pgm) => {};
