import mysql from "mysql2";


const pool = mysql.createPool({
    host: 'localhost',
    user: 'root',
    password: 'Al8987154St12',//'Al8987154St12',//'sWatid2022#',//'Al8987154St12',//'DivalSw4T20*'
    //password: '',
    database: 'swat_gesinen'//'swat_gesinen'//'gomera_database'//'swat_gesinen'
    //password:'sWatid2022#',
    //database:'gomera_database'
  });

// Realizar una consulta simple para verificar la conexión
pool.query('SELECT 1 + 1 AS solution', function (error, results, fields) {
  if (error) {
    console.error('Error With DB Connection:', error);
  } else {
    console.log('DB Connected');
  }
});

const db = {
  query: (sql: any, values?: any) => {
    console.log(sql,values)
    return new Promise((resolve, reject) => {
      pool.query(sql, values, (error:any, results:any) => {
        if (error) {
          reject(error);
        } else {
          console.log(results);
          resolve(results);
        }
      });
    });
  },
};
export default db;