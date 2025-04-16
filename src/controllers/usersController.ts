import db from "../database";
var moment = require('moment-timezone');

/*
 * /users
 */
class UsersController {
  /**
   * GET ('/information/:id')
   * Getting the information about the user
   *
   * @async
   * @param id - The user Id
   *
   * @return
   */
  public async getUserInformation(id: number): Promise<object> {
    return new Promise((resolve: any, reject: any) => {
      db.getConnection((err: any, conn: any) => {
        let query =
          "SELECT id, email, user_name, first_name, last_name, phone, address, city, state, country FROM users WHERE id = " +
          id;

        conn.query(query, (error: any, results: any) => {
          conn.release();

          if (error) {
            reject({
              http: 406,
              status: "Failed",
              error: error,
            });
          }

          if (results.length == 0) {
            resolve({
              http: 204,
              status: "Success",
              result: "There are no users with this ID",
              user_data: {},
            });
          }

          resolve({
            http: 200,
            status: "Success",
            user_data: results[0],
          });
        });
      });
    });
  }

  /**
   * POST ('/login')
   * Getting the information about the user
   *
   * @async
   * @param id - The user Id
   *
   * @return
   */
  public async getUserLogin(mail: string, pass: string): Promise<object> {
    return new Promise(async (resolve: any, reject: any) => {
       let logCreate =await this.createUserLoginLog(mail);
      db.getConnection((err: any, conn: any) => {
        let query =
          "SELECT * FROM users WHERE email = '" +
          mail +
          "' AND pwd = '" +
          pass +
          "'";
        console.log("QUERY", query);
        if(err) {
          reject({
            http: 500,
            status: "Failed",
            error: err,
          });
        }
        conn.query(query, (error: any, results: any) => {
          conn.release();

          if (error) {
            reject({
              http: 406,
              status: "Failed",
              error: error,
            });
          }

          if (results == undefined || results.length == 0) {
            resolve({
              http: 204,
              status: "Success",
              result: "There are no users with this ID",
              user_data: {},
            });
          }
          
          resolve({
            http: 200,
            status: "Success",
            user_data: results[0],
            log:logCreate
          });
        });
      });
    });
  }

  /*public async createUsersAccessLog(email:string): Promise<object> {
    return new Promise((resolve: any, reject: any) => {
      let dateStr  = moment().tz("Europe/Madrid").format('YYYY-MM-DD hh:mm:ss');
      db.getConnection((err: any, conn: any) => {
        let query = "insert into user_access_log(email, login_time) value ('"+email+"', ) ;";
        console.log("QUERY", query);

        conn.query(query, (error: any, results: any) => {
          conn.release();

  }*/
  /**
   * POST ('/login')
   * Getting the information about the user
   *
   * @async
   * @param id - The user Id
   *
   * @return
   */
  public async getUserIdByMail(mail: string): Promise<object> {
    return new Promise((resolve: any, reject: any) => {
      db.getConnection((err: any, conn: any) => {
        let query = "SELECT id FROM users WHERE email = '" + mail + "';";
        console.log("QUERY", query);

        conn.query(query, (error: any, results: any) => {
          conn.release();

          if (error) {
            reject({
              http: 406,
              status: "Failed",
              error: error,
            });
          }

          if (results == undefined || results.length == 0) {
            resolve({
              http: 204,
              status: "Success",
              result: "There are no users with this mail",
              user_data: {},
            });
          }

          resolve({
            http: 200,
            status: "Success",
            user_data: results[0],
          });
        });
      });
    });
  }

  public async createUserLoginLog(mail: string): Promise<object> {
    return new Promise((resolve: any, reject: any) => {
     let  timestramp   = moment().tz("Europe/Madrid").format('YYYY-MM-DD hh:mm:ss');
      db.getConnection((err: any, conn: any) => {
        let query = "insert into user_access_log (user_email, login_time) value ('"+mail+"','"+timestramp+"')";
        console.log("QUERY", query);

        conn.query(query, (error: any, results: any) => {
          conn.release();

          if (error) {
            reject({
              http: 406,
              status: "Failed",
              error: error,
            });
          }
        resolve({
            http: 200,
            status: "Success",
            insert_record: results,
          });
        });
      });
    });
  }
}



export default new UsersController();
