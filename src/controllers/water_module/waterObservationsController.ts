import { Request, Response } from "express";
import db from "../../database";

/*
 * /water/
 */
class WaterObservationsController {
  /**
   * POST ('/import')
   * Importing water_observation_value records from xls file
   *
   * @param json_file_data xls file info formated on json
   * @param resolveCbFn fn called when values to insert are prepared
   *
   * @return
   */
  public async importFile(
    json_file_data: any,
    resolveCbFn: any
  ): Promise<object> {
    return new Promise((resolve, reject) => {
      console.log("metodo del controller");
      db.getConnection((err: any, conn: any) => {
        console.log(err);
        console.log("dentro del db.getConnection");
        var insert_values_array: any = [];
        var values_to_insert = "";
        var record_counter = 0;
        console.log("importFile");

        json_file_data.water_info.forEach(function (element: any, index: any) {
          var select_query =
            "SELECT water_devices.id, water_devices.sensor_id, water_devices.name, " +
            "sensor_info.device_EUI FROM `water_devices` INNER JOIN sensor_info " +
            "ON water_devices.sensor_id = sensor_info.id WHERE `contract_number` = '" +
            element.contract_number +
            "';";
          conn.query(select_query, async (err: any, results: any) => {
            if (err) {
              reject({
                http: 401,
                status: "Failed",
                error: err,
              });
            } else {
              if (results && results.length == 0) {
                console.log("contract_number not found");
              } else {
                let water_device_info = results[0];
                values_to_insert +=
                  "(" +
                  water_device_info.id +
                  "," +
                  water_device_info.sensor_id +
                  ", '1', '" +
                  water_device_info.name +
                  "','" +
                  water_device_info.device_EUI +
                  "', 'S01', NULL, NULL, " +
                  element.observation_value +
                  ",'" +
                  json_file_data.date +
                  "', NULL, " +
                  json_file_data.user_id +
                  ", 'normal', 'normal', current_timestamp(), current_timestamp()),";
              }
              if (index == json_file_data.water_info.length - 1) {
                resolve(resolveCbFn(values_to_insert.slice(0, -1)));
              }
            }
          });
        });
      });
    });
  } // importFile()

  public async insertNewWaterObservations(insert_values: string) {
    return new Promise((resolve, reject) => {
      db.getConnection((err: any, conn: any) => {
        var insert_query =
          "INSERT INTO `water_module_observation` (`device_id`, `sensor_id`, `var_id`, `device_name`, `device_eui`, `var_name`, `gateway_mac`, `sensor_type_id`, `observation_value`," +
          " `message_timestamp`, `time`, `user_id`, `alert_type`, `observation_type`, `created_dt`, `updated_dt`)" +
          " VALUES " +
          insert_values +
          ";";
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
  } // insertNewWaterObservations()

  public getDistanceBetweenDates(date1str: any, date2str: any) {
    const date1: any = new Date(date1str);
    const date2: any = new Date(date2str);
    const diffTime = Math.abs(date2 - date1);
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    console.log("date1str <-> date2str", date1str, date2str)
    console.log("date1 <-> date2", date1, date2)
    console.log(diffDays + " days");
    return diffDays
  }

  public substractDaysToDate(dateStr: string, daysToSubstract: number) {
    var a = new Date(dateStr);    // October 31, 2013
    //console.log("Before", a);
    a.setDate(a.getDate() - daysToSubstract);       // November 1, 2013
    //console.log("After", a);
    let formatedDate = a.getFullYear() + "-" + a.getMonth() + "-" + a.getDate()
    return formatedDate
  }

  public fromDictionaryToArray(dictionary: any) {
    let array: any[] = []
    for (var k in dictionary) {
      if (typeof dictionary[k] !== 'function') {
        console.log("Key is " + k + ", value is" + dictionary[k]);
        array.push(dictionary[k])
      }
    }
    return array
  }

  public formatDate(date: Date) {
    const offset = date.getTimezoneOffset()
    date = new Date(date.getTime() - (offset * 60 * 1000))
    return date.toISOString().split('T')[0]
  }

  public async getObservationsByRangeDateAndDeviceId(deviceId: any, fromDate: any, toDate: any
  ): Promise<object> {
    return new Promise((resolve, reject) => {
      var selectSQL = "SELECT message_timestamp as timestamp, observation_value as value FROM water_module_observation WHERE device_id = " + deviceId + "" +
        " and message_timestamp >= '" + fromDate + "' and message_timestamp <= '" + toDate + " 23:59:00' ORDER BY timestamp;"
      console.log(selectSQL)
      db.getConnection((error: any, conn: any) => {
        // If the connection with the database fails
        if (error) {
          reject({
            http: 401,
            status: "Failed",
            error: error,
          });
        }

        conn.query(selectSQL, (err: any, results: any) => {
          conn.release();
          // If the query fails
          if (err) {
            reject({
              http: 401,
              status: "Failed",
              error: err,
            });
          }
          if (results) {
            // OBTENER DIFERENCIA EN EL CONSUMO ACUMULADO RESPECTO AL ULTIMO VALOR
            // Before getting medium value000000
            let observationsEachDay: any = {}
            console.log(results)
            results.forEach((observation: any, index: number) => {
              console.log("index", index)
              let date: Date = new Date(observation.timestamp)
              //let formatedDate = date.getFullYear() + "-" + date.getMonth() + "-" + date.getDate()
              let formatedDate = this.formatDate(date)
              // Falta comprobar que no hay ningun dia por medio que no haya mandado
              if (index == 0) {
                // Compruebo si la primera observacion es del primer dia seleccionado en el rango
                if (this.getDistanceBetweenDates(this.formatDate(new Date(formatedDate)), formatedDate) == 0) {
                  observationsEachDay[formatedDate] = observation.value
                } else {
                  // Si no lo es guardo un valor ( FALSE )
                  observationsEachDay[formatedDate] = false
                }
              } else if (index == results.length - 1) {
                // Compruebo si la ultima observacion es del ultimo dia seleccionado en el rango
                if (this.getDistanceBetweenDates(formatedDate, this.formatDate(new Date(toDate))) == 0) {
                  if (!observationsEachDay[formatedDate]) {
                    observationsEachDay[formatedDate] = observation.value
                  } else {
                    // Si existe algun valor para esa fecha almacenado guardo la media entre el valor nuevo y el ya almacenado
                    observationsEachDay[formatedDate] = (observation.value + observationsEachDay[formatedDate]) / 2
                  }
                } else {
                  // Si no lo es devuelvo un error 204 ya que no puedo conocer cuanto a aumentado el deposito de agua
                  // de ninguna forma
                  console.log("***** EMPTY *****")
                  resolve({
                    http: 204,
                    status: "Empty",
                    result: 0
                  });
                }
              } else if (index > 0) {
                let previousDate: Date = new Date(results[index - 1].timestamp)
                //let formatedPreviousDate = previousDate.getFullYear() + "-" + previousDate.getMonth() + "-" + previousDate.getDate()
                let formatedPreviousDate = this.formatDate(previousDate)
                let distanceWithPreviousObservation: number = this.getDistanceBetweenDates(formatedPreviousDate, formatedDate)
                // la observacion es del mismo o el siguiente día
                if (distanceWithPreviousObservation == 0 || distanceWithPreviousObservation == 1) {
                  // Si no hay ningun valor para esta fecha añado un valor con la fecha
                  if (!observationsEachDay[formatedDate]) {
                    observationsEachDay[formatedDate] = observation.value
                  } else {
                    // Si existe algun valor para esa fecha almacenado guardo la media entre el valor nuevo y el ya almacenado
                    observationsEachDay[formatedDate] = (observation.value + observationsEachDay[formatedDate]) / 2
                  }
                } else {
                  // Entre esta observacion y la anterior hay mas de 1 día de diferencia
                  let daysToSubstract: number = 1
                  do {
                    // Añado valores nulos en las fechas intermedias
                    let noValueformatedDate = this.substractDaysToDate(formatedDate, daysToSubstract)
                    observationsEachDay[noValueformatedDate] = false
                    distanceWithPreviousObservation--
                    daysToSubstract++
                  } while (distanceWithPreviousObservation > 1);
                }
              }


            });
            console.log("observationsEachDay", observationsEachDay)
            console.log("observationsEachDayARRAY", this.fromDictionaryToArray(observationsEachDay))
            var observationsArray = this.fromDictionaryToArray(observationsEachDay)
            let resultCalc = 0
            // Si tengo la ultima medida y la anterior a esta obtengo la diferencia
            if (observationsArray[observationsArray.length - 1] && observationsArray[observationsArray.length - 2]) {
              resultCalc = observationsArray[observationsArray.length - 1] - observationsArray[observationsArray.length - 2]
            } else {
              // Si no tengo las dos ultimas medidas busco la de dias anteriores y saco la diferencia para luego obtener la media
              let divideBy: number = 2
              for (let index = observationsArray.length - 3; index >= 0; index--) {
                console.log("observationsArray[index]", observationsArray[index])
                if (observationsArray[index]) {
                  console.log("DENTRO DEL IF");

                  resultCalc = (observationsArray[observationsArray.length - 1] - observationsArray[index]) / divideBy
                  console.log("resultCalc", resultCalc);

                  // Response
                  resolve({
                    http: 200,
                    status: "Success",
                    result: resultCalc,
                  });
                  console.log("DENTRO DEL IF ***** END *****");

                }
                divideBy++
              }
              // En caso de no haber dos medidas no se puede obtener un resultado asi que devuelvo un error 204
              // Response

              resolve({
                http: 204,
                status: "Empty",
                result: 0
              });
            }

            // Response
            resolve({
              http: 200,
              status: "Success",
              result: resultCalc,
            });
          } else {

            // Response
            resolve({
              http: 204,
              status: "Empty",
              result: 0
            });
          }

        });
      });
    })

  }

  /**
   * POST ('/getObservationValuesByDeviceId')
   * Getting al the observation records by device id in a range date
   *
   * @param devicesIdArray array storing the water_device ids
   * @param fromDate date of the observations
   * @param userColumnSelection column user has selected to be shown
   * @return
   */
  public async getObservationValuesByDeviceId(devicesIdArray: any, fromDate: any, userColumnSelection: any): Promise<object> {
    return new Promise((resolve, reject) => {
      var date = new Date(fromDate);

      var fromDateFormated =
        date.getFullYear() +
        "-" +
        (parseInt(String(date.getMonth())) + 1) +
        "-" +
        date.getDate();
      var devicesIdPreparedSql = "";
      devicesIdArray.forEach(
        (deviceId: any) => (devicesIdPreparedSql += deviceId + ",")
      );
      console.log("controller()");
      db.getConnection((err: any, conn: any) => {
        if (err) {
          reject({
            http: 401,
            status: "Failed",
            error: err,
          });
        }
        console.log("connected");
        var select_query = "";
        if (userColumnSelection == "contract_number") {
          select_query =
            "SELECT water_devices." +
            userColumnSelection +
            " AS user_column_selection, water_module_observation.observation_value, " +
            "water_module_observation.message_timestamp " +
            "FROM `water_module_observation`, (SELECT water_module_observation.device_id, " +
            "MAX(water_module_observation.message_timestamp) as last_message_timestamp FROM " +
            "water_module_observation WHERE water_module_observation.device_id IN (" +
            devicesIdPreparedSql.slice(0, -1) +
            ") " +
            " AND water_module_observation.message_timestamp <= '" +
            fromDateFormated +
            "' GROUP BY water_module_observation.device_id)" +
            " water_max_date INNER JOIN water_devices ON water_devices.id=water_max_date.device_id WHERE water_module_observation.device_id = water_max_date.device_id AND " +
            "water_module_observation.message_timestamp = water_max_date.last_message_timestamp GROUP BY water_module_observation.device_id;";

          /*
                    select_query = "SELECT water_devices." + userColumnSelection + " AS user_column_selection, water_module_observation.observation_value, " +
                        "water_module_observation.message_timestamp FROM `water_devices` INNER JOIN water_module_observation " +
                        "ON water_devices.id = water_module_observation.device_id WHERE water_devices.id IN (" + devicesIdPreparedSql.slice(0, -1) + ") AND " +
                        "water_module_observation.message_timestamp BETWEEN <= '" + fromDateFormated + "'" +
                        " ORDER BY `water_module_observation`.`message_timestamp` DESC LIMIT 1;";*/
        } else if (
          userColumnSelection == "device_name" ||
          userColumnSelection == "device_EUI"
        ) {
          select_query =
            "SELECT water_module_observation." +
            userColumnSelection +
            " AS user_column_selection, water_module_observation.observation_value, " +
            "water_module_observation.message_timestamp " +
            "FROM `water_module_observation`, (SELECT water_module_observation.device_id, " +
            "MAX(water_module_observation.message_timestamp) as last_message_timestamp FROM " +
            "water_module_observation WHERE water_module_observation.device_id IN (" +
            devicesIdPreparedSql.slice(0, -1) +
            ") " +
            " AND water_module_observation.message_timestamp <= '" +
            fromDateFormated +
            "' GROUP BY water_module_observation.device_id)" +
            " water_max_date WHERE water_module_observation.device_id = water_max_date.device_id AND " +
            "water_module_observation.message_timestamp = water_max_date.last_message_timestamp GROUP BY water_module_observation.device_id;";
        } else if (userColumnSelection == "*") {
          select_query =
            "SELECT sensor_info.device_EUI, water_module_users.user_nif as water_user_nif,water_module_users.last_name as water_user_apellidos,water_module_users.first_name as water_user_name,water_devices.*, water_module_observation.observation_value, " +
            "water_module_observation.message_timestamp " +
            "FROM `water_module_observation`, (SELECT water_module_observation.device_id, " +
            "MAX(water_module_observation.message_timestamp) as last_message_timestamp FROM " +
            "water_module_observation WHERE water_module_observation.device_id IN (" +
            devicesIdPreparedSql.slice(0, -1) +
            ") " +
            " AND water_module_observation.message_timestamp <= '" +
            fromDateFormated +
            "' GROUP BY water_module_observation.device_id)" +
            " water_max_date INNER JOIN water_devices ON water_devices.id=water_max_date.device_id LEFT JOIN water_module_users ON water_module_users.id=water_devices.water_user_id LEFT JOIN sensor_info ON water_devices.sensor_id=sensor_info.id WHERE water_module_observation.device_id = water_max_date.device_id AND " +
            "water_module_observation.message_timestamp = water_max_date.last_message_timestamp GROUP BY water_module_observation.device_id;";
        } else {
          resolve({
            http: 204,
            status: "Success",
            result: "Error: no user column selected",
          });
        }
        console.log(select_query);
        conn.query(select_query, async (err: any, results: any) => {
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
                result: [],
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
  } // getObservationValuesByContractNum()
}

export default new WaterObservationsController();
