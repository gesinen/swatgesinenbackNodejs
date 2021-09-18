import mysql from 'mysql';

const conn = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    //password: 'Al8987154St12',
    password: 'root',
    database: 'swat_gesinen'
});


conn.connect((err) => {
    if (err) {
        console.error('Error connecting: ' + err.stack)
    }
})

export default conn;