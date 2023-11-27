import pgPromise from 'pg-promise';
const pg = pgPromise({});
export const pgdb = pg("postgres://chirpstack_integration:chirpstack_integration@localhost:5432/chirpstack_integration");

//export const pgdb='';