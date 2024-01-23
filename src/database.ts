import mysql from 'mysql';

const conn = mysql.createPool({
    host: 'localhost',
    user: 'root',
    password: 'Al8987154St12',//'Al8987154St12',//'sWatid2022#',//'Al8987154St12',//'DivalSw4T20*'
    database: 'swat_gesinen'//'swat_gesinen'//'gomera_database'//'swat_gesinen'
    //password:'sWatid2022#',
    //database:'gomera_database'
    //password: '',
   
});


/*conn.connect((err) => {
    if (err) {
        console.error('Error connecting: ' + err.stack)
    }
})*/
conn.getConnection((err) => {
    if (err) {
        console.error('Error connecting: ' + err.stack)
    }
})

export default conn;
