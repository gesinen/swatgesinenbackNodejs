import { Request, Response } from "express";
import db from "../../database";

/*
 * /water/
 */
class ServerController {
  /**
   * GET ('/list')
   * Get server list
   * @return Promise<object>
   */
  public async getUserServerList(user_id: any): Promise<object> {
    var query =
      "SELECT id,name FROM `servers` WHERE user_id = " + user_id + ";";

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
          if (results && results.length == 0) {
            resolve({
              http: 204,
              status: "Success",
              result: "Error no server found with the given id",
            });
          } else {
            resolve({
              http: 200,
              status: "Success",
              result: results,
            });
          }
        });
      });
    });
  } // importFile()

  /**
   * GET ('/server/sensor_server_detail')
   * Get server list
   * @return Promise<object>
   */
  public async getSensorServerDetail(sensor_id: any): Promise<object> {
    var query =
      "SELECT `server_id` FROM `sensor_server_detail` WHERE `sensor_id`=" +
      sensor_id +
      ";";

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
          if (results && results.length == 0) {
            resolve({
              http: 204,
              status: "Success",
              result: "Error no network server found with the given sensor_id",
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
  } // importFile()

  /**
   * GET ('/providerIdAndToken')
   * Get server provider_id and auth token
   *
   * @param server_id id of the serve we are retrieving the info from
   *
   * @return
   */
  public async getServerTokenAndProviderId(server_id: any): Promise<object> {
    var query =
      "SELECT provider_id, authorization_token FROM `servers` WHERE id = " +
      server_id +
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
              result: "Error no server found with the given id",
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
  } // getServerTokenAndProviderId()
  /**
   * POST ('/serverLinkToGateway')
   * Gets gateway <-> server information -> server_id & pk_id
   *
   * @param gatewayMac mac of the gateway
   *
   * @return
   */
  getGatewaysServerInfo(gateway_mac: any) {
    var query =
      "SELECT server_gateway_pkid.server_id, server_gateway_pkid.pk_id, servers.name, servers.type " +
      "FROM `server_gateway_pkid` INNER JOIN `servers` ON server_gateway_pkid.server_id=servers.id WHERE `mac_number`= '" +
      gateway_mac +
      "';";

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
          //console.log(results)
          resolve({
            http: 200,
            status: "Success",
            results: results,
          });
        });
      });
    });
  }
  /**
   * POST ('/serverLinkToGateway')
   * Creates row in server_gateway_pkid (links server to gateway)
   *
   * @param server_id id of the server
   * @param pk_id pk_id of the server on gateway
   * @param gatewayMac mac of the gateway
   *
   * @return
   */
  createServerAndGatewayLink(gateway_mac: any, server_id: any, pk_id: any) {
    var query =
      "INSERT INTO `server_gateway_pkid` (`mac_number`, `server_id`, `pk_id`) " +
      "VALUES ('" +
      gateway_mac +
      "','" +
      server_id +
      "','" +
      pk_id +
      "');";

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

          resolve({
            http: 200,
            status: "Success",
          });
        });
      });
    });
  }
}

export default new ServerController();
