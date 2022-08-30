import mysql from 'mysql';

const conn = mysql.createPool({
    host: 'localhost',
    user: 'root',
    password: 'Al8987154St12',
    //password: '',
    database: 'swat_gesinen'
});


/*conn.connect((err) => {
    if (err) {
        console.error('Error connecting: ' + err.stack)
    }
})*/

export default conn;
