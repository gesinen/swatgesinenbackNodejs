import db from "../../database";
import { Utils } from "../../utils/Utils";

class WaterUsersController {
  /**
   * GET ('/all/:user_id')
   *
   * @async
   * @param user_id
   *
   * @returns
   */
  public async getWaterUserMunicipalityId(user_id: number) {
    var query =
      "SELECT id FROM `water_municipality_info` WHERE user_id = " +
      user_id +
      ";";

    return new Promise((resolve, reject) => {
      db.getConnection((error: any, conn: any) => {
        // If the connection with the database fails
        if (error) {
          reject({
            http: 401,
            status: "Failed",
            error: error,
          });
        }

        conn.query(query, (err: any, results: any) => {
          conn.release();

          // If the query fails
          if (err) {
            reject({
              http: 401,
              status: "Failed",
              error: err,
            });
          }

          // Response
          if (results && results.length == 0) {
            resolve({
              http: 204,
              status: "Success",
              result: "Error no water municipality found for the given user",
            });
          } else {
            resolve({
              http: 200,
              status: "Success",
              result: results[0],
            });
          }
        });
      });
    });
  }

  /**
   * GET ('/userByNif/:nif')
   * Getting the information about the user by a given nif
   *
   * @async
   * @param nif - The user nif
   *
   * @return
   */
  public async getUserByNif(nif: string): Promise<object> {
    return new Promise((resolve: any, reject: any) => {
      db.getConnection((err: any, conn: any) => {
        let query =
          "SELECT * FROM water_module_users WHERE user_nif = '" + nif + "'";
        console.log(query);
        conn.query(query, (error: any, results: any) => {
          conn.release();
          console.log("getUserByNif",results.length)
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
              result: "There are no water_module_users with this nif",
              user_module_data: {},
            });
          }

          resolve({
            http: 200,
            status: "Success",
            user_module_data: results[0],
          });
        });
      });
    });
  }

  /**
   * GET ('/all/:user_id')
   *
   * @async
   * @param user_id
   *
   * @returns
   */
   public async getAllWaterUsersByDeviceAndsewerInfo(user_id: number) {
    var query = "SELECT water_module_users.*,water_devices.contract_number, water_devices.id as deviceId, water_devices.sewer_rate_id,msr.id as msrId, msr.usefor  FROM water_module_users LEFT JOIN water_devices ON water_devices.water_user_id = water_module_users.id LEFT JOIN municipality_sewer_rate msr ON msr.id = water_devices.sewer_rate_id WHERE water_module_users.user_id = " + user_id;

    return new Promise((resolve, reject) => {
      db.getConnection((error: any, conn: any) => {
        // If the connection with the database fails
        if (error) {
          reject({
            http: 401,
            status: "Failed to connect to database",
            error: error,
          });
        }

        conn.query(query, (err: any, results: any) => {
          conn.release();

          // If the query fails
          if (err) {
            reject({
              http: 401,
              status: "Failed",
              error: err,
            });
          }

          // Response
          resolve({
            http: 200,
            status: "Success",
            water_users: results,
          });
        });
      });
    });
  }

  /**
   * GET ('/all/:user_id')
   *
   * @async
   * @param user_id
   *
   * @returns
   */
  public async getAllWaterUsers(user_id: number) {
    var query = "SELECT * FROM water_module_users WHERE user_id = " + user_id;

    return new Promise((resolve, reject) => {
      db.getConnection((error: any, conn: any) => {
        // If the connection with the database fails
        if (error) {
          reject({
            http: 401,
            status: "Failed to connect to database",
            error: error,
          });
        }

        conn.query(query, (err: any, results: any) => {
          conn.release();

          // If the query fails
          if (err) {
            reject({
              http: 401,
              status: "Failed",
              error: err,
            });
          }

          // Response
          resolve({
            http: 200,
            status: "Success",
            water_users: results,
          });
        });
      });
    });
  }

  /**
   * GET ('/device/:user_id')
   *
   * @async
   * @param user_id
   *
   * @returns
   */
  public async getWaterUserDevice(user_id: number) {
    var query = "SELECT * FROM water_devices WHERE water_user_id = " + user_id;

    return new Promise((resolve, reject) => {
      db.getConnection((error: any, conn: any) => {
        // If the connection with the database fails
        if (error) {
          reject({
            http: 401,
            status: "Failed to connect to database",
            error: error,
          });
        }

        conn.query(query, (err: any, results: any) => {
          conn.release();

          // If the query fails
          if (err) {
            reject({
              http: 401,
              status: "Failed",
              error: err,
            });
          }

          // Response
          resolve({
            http: 200,
            status: "Success",
            water_devices: results,
          });
        });
      });
    });
  }

  /**
   * POST ('/import')
   * Importing water_observation_value records from xls file
   * @param json_file_data xls file info formated on json
   * @return Promise
   */
  public async importFile(
    json_file_data: any,
    user_id: any,
    municipality_id: any
  ): Promise<object> {
    return new Promise((resolve, reject) => {
      console.log("metodo del controller");
      db.getConnection((err: any, conn: any) => {
        console.log(err);
        var values_to_insert = "";
        //console.log("file on controller")
        console.log(json_file_data);

        json_file_data.forEach((element: any, index: any) => {
          values_to_insert +=
            "('" +
            Utils.checkUndefined(element.first_name) +
            "','" +
            Utils.checkUndefined(element.last_name) +
            "','" +
            Utils.checkUndefined(element.email) +
            "','" +
            Utils.checkUndefined(element.user_nif) +
            "','" +
            Utils.checkUndefined(element.mobile) +
            "','" +
            Utils.checkUndefined(user_id) +
            "','" +
            Utils.checkUndefined(municipality_id) +
            "','" +
            Utils.checkUndefined(element.house_no) +
            "','" +
            Utils.checkUndefined(element.street) +
            "','" +
            Utils.checkUndefined(element.address) +
            "','" +
            Utils.checkUndefined(element.city) +
            "','" +
            Utils.checkUndefined(element.state) +
            "','" +
            Utils.checkUndefined(element.country) +
            "','" +
            Utils.checkUndefined(element.zip_code) +
            "','" +
            Utils.checkUndefined(element.bill_house_no) +
            "','" +
            Utils.checkUndefined(element.bill_street) +
            "','" +
            Utils.checkUndefined(element.bill_address) +
            "','" +
            Utils.checkUndefined(element.bill_city) +
            "','" +
            Utils.checkUndefined(element.bill_state) +
            "','" +
            Utils.checkUndefined(element.bill_country) +
            "','" +
            Utils.checkUndefined(element.bank_name) +
            "','" +
            Utils.checkUndefined(element.bank_address) +
            "','" +
            Utils.checkUndefined(element.IBAN) +
            "','" +
            Utils.checkUndefined(element.profile_pic) +
            "','" +
            Utils.checkUndefined(element.account_certificate) +
            "','" +
            Utils.checkUndefined(element.idproof) +
            "','" +
            Utils.checkUndefined(element.sepa) +
            "','" +
            Utils.checkUndefined(element.dni) +
            "'),";
        });
        var insert_query =
          "INSERT INTO `water_module_users` (`first_name`, `last_name`, `email`, `user_nif`, `mobile`, `user_id`," +
          " `municipality_id`, `house_no`, `street`, `address`, `city`," +
          " `state`, `country`, `bill_house_no`, `bill_street`, `bill_address`, `bill_city`," +
          " `bill_state`, `bill_country`, `bill_zip_code`, `bank_name`, `bank_address`, `IBAN`, `profile_pic`," +
          " `account_certificate`, `idproof`, `sepa`, `dni`) " +
          " VALUES " +
          values_to_insert.slice(0, -1) +
          ";";
        //console.log(insert_query)

        conn.query(insert_query, (err: any, results: any) => {
          if (err) {
            reject({
              http: 401,
              status: "Failed",
              error: err,
            });
          } else {
            if (results && results.length == 0) {
              resolve({
                http: 204,
                status: "Success",
                result: "Error importing water_module_observations",
              });
            } else {
              resolve({
                http: 200,
                status: "Success",
                result: results,
              });
            }
          }
        });
      });
    });
  } // importFile()
}

export default new WaterUsersController();
