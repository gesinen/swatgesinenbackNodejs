import mysql from 'mysql';

const conn = mysql.createPool({
    host: 'localhost',
    user: 'root',
    password: 'Al8987154St12',//'sWatid2022#',//'Al8987154St12',//'DivalSw4T20*'
    //password: '',
    database: 'swat_gesinen'//'gomera_database'//'swat_gesinen'
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
