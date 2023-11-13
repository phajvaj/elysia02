import { Knex, knex as db } from 'knex';

const connection: Knex.MySqlConnectionConfig = {
    host: process.env.DB_HOST,
    port: +process.env.DB_PORT | 3306,
    database: process.env.DB_NAME,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    multipleStatements: true,
    dateStrings: true
  }
  
  const knex = db({
    client: 'mysql2',
    connection: connection,
    pool: {
      min: 0,
      max: 100,
      afterCreate: (conn: any, done: any) => {
        conn.query(`SET NAMES ${process.env.DB_CHATSET}`, (err: any) => {
          done(err, conn);
        });
      }
    },
  });

  export default knex;