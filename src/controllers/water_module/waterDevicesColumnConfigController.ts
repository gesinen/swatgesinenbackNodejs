import db from "../../database";
import { Utils } from "../../utils/Utils";


class WaterDevicesColumnConfigController {
    
  // Create water device Column Config

  /**
   * POST ('/')
   * Create a new water device column Config
   *
   * @async
   * @param name
   * @param contract_number
   * @param user
   * @param user_id
   * @param units
   * @param numContador
   * @param description
   * @param use_for
   * @param installation_address
   * @param user_name
   * @param device_eui
   * @param sensor_name
   * @param device_diameter
   * @param numModuleLora
   * @param provider
   * @param authToken
   * @param municipality
   * @param sewer_rate
   * @param coeficiente_corrector
   *
   * @returns
   */
   public async createWaterDeviceColumnConfig(
    name: boolean = false,
    
    contract_number: boolean = false,
    user: boolean = false,
    user_id: number = null,
    units: boolean = false,
    description: boolean = false,
    use_for: boolean = false,
    installation_address: boolean = false,
    user_name: boolean = false,
    device_eui: boolean = false,
    sensor_name: boolean = false,
    device_diameter: boolean = false,
    numContador: boolean = false,
    numModuleLora: boolean = false,
    provider: boolean = false,
    authToken: boolean = false,
    municipality: boolean = false,
    sewer_rate: boolean = false,
    coeficiente_corrector: boolean = false
    ): Promise<object> {
    

    var query =
      "INSERT INTO water_module_device_column_config (name, user_id, description, units, contract_number, use_for,installation_address,device_diameter,device_eui,sensor_name,user_name,numContador,numModuleLora,provider,authToken,coeficiente_corrector,municipality,sewer_rate) VALUES (" +
      name +
      "," +
      user_id +
      "," +
      description +
      "," +
      units +
      "," +
      contract_number +
      "," +
      use_for +
      "," +
      installation_address +
      "," +
      device_diameter +
      "," +
      device_eui +
      "," +
      sensor_name +
      "," +
      user_name +
      "," +
      numContador +
      "," +
      numModuleLora +
      "," +
      provider +
      "," +
      authToken +
      "," +
      coeficiente_corrector +
      "," +
      municipality +
      "," +
      sewer_rate +
      ")";
    console.log(query)
    return new Promise((resolve: any, reject: any) => {
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
          resolve({
            http: 200,
            status: "Success",
            response: "The water device Config has been created successfully.",
          });
        });
      });
    });
  }


  /**
   * PUT ('/')
   * Update a new water device column Config
   *
   * @async
   * @param name
   * @param contract_number
   * @param user
   * @param user_id
   * @param units
   * @param counter_number
   * @param description
   * @param use_for
   * @param installation_address
   * @param user_name
   * @param device_eui
   * @param sensor_name
   * @param device_diameter
   * @param numModuleLora
   * @param provider
   * @param authToken
   * @param municipality
   * @param sewer_rate
   * @param coeficiente_corrector
   *
   * @returns
   */
   public async UpdateWaterDeviceColumnConfig(
    name: boolean = false,
    
    contract_number: boolean = false,
    user: boolean = false,
    user_id: number = null,
    units: boolean = false,
    counter_number: boolean=false,
    description: boolean = false,
    use_for: boolean = false,
    installation_address: boolean = false,
    user_name: boolean = false,
    device_eui: boolean = false,
    sensor_name: boolean = false,
    device_diameter: boolean = false,
    numContador: boolean = false,
    numModuleLora: boolean = false,
    provider: boolean = false,
    authToken: boolean = false,
    municipality: boolean = false,
    sewer_rate: boolean = false,
    coeficiente_corrector: boolean = false
    ): Promise<object> {
    

    var query =
      "UPDATE water_module_device_column_config set name="+ 
      name +
     
      ", description = " +
      description +
      ", units = " +
      units +
      ", contract_number = " +
      contract_number +
      ", use_for = " +
      use_for +
      ", installation_address = " +
      installation_address +
      ", user_name = " +
      user_name +
      ", device_eui = " +
      device_eui +
      ", sensor_name = " +
      sensor_name +
      ", device_diameter = " +
      device_diameter +
      ", numContador = " +
      numContador +
      ", numModuleLora = " +
      numModuleLora +
      ", provider = " +
      provider +
      ", authToken = " +
      authToken +
      ", coeficiente_corrector = " +
      coeficiente_corrector +
      ", municipality = " +
      municipality +
      ", sewer_rate = " +
      sewer_rate +
      " where user_id ="+ user_id;
    console.log(query)
    return new Promise((resolve: any, reject: any) => {
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
          resolve({
            http: 200,
            status: "Success",
            response: "The water device Config has been updated successfully.",
          });
        });
      });
    });
  }

    /**
   * GET ('/:userId')
   *
   * @async
   * @param userId
   *
   * @returns
   */
     public async getWaterDeviceColumnConfigByUserId(userId: number) {
      var query = "SELECT * FROM water_module_device_column_config where user_id=" + userId;
  
      return new Promise((resolve: any, reject: any) => {
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
            console.log(results);
            if (results[0] != undefined) {
              // Response
              resolve({
                http: 200,
                status: "Success",
                water_device: results[0],
              });
            } else {
              reject({
                http: 204,
                status: "Empty result",
                error: err,
              });
            }
          });
        });
      });
    }

}
export default new WaterDevicesColumnConfigController();