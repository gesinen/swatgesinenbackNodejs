"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __asyncValues = (this && this.__asyncValues) || function (o) {
    if (!Symbol.asyncIterator) throw new TypeError("Symbol.asyncIterator is not defined.");
    var m = o[Symbol.asyncIterator], i;
    return m ? m.call(o) : (o = typeof __values === "function" ? __values(o) : o[Symbol.iterator](), i = {}, verb("next"), verb("throw"), verb("return"), i[Symbol.asyncIterator] = function () { return this; }, i);
    function verb(n) { i[n] = o[n] && function (v) { return new Promise(function (resolve, reject) { v = o[n](v), settle(resolve, reject, v.done, v.value); }); }; }
    function settle(resolve, reject, d, v) { Promise.resolve(v).then(function(v) { resolve({ value: v, done: d }); }, reject); }
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const database_1 = __importDefault(require("../../database"));
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
    importFile(json_file_data, resolveCbFn) {
        return __awaiter(this, void 0, void 0, function* () {
            return new Promise((resolve, reject) => {
                console.log("metodo del controller");
                database_1.default.getConnection((err, conn) => {
                    console.log(err);
                    console.log("dentro del db.getConnection");
                    var insert_values_array = [];
                    var values_to_insert = "";
                    var record_counter = 0;
                    console.log("importFile");
                    json_file_data.water_info.forEach(function (element, index) {
                        var select_query = "SELECT water_devices.id, water_devices.sensor_id, water_devices.name, " +
                            "sensor_info.device_EUI FROM `water_devices` INNER JOIN sensor_info " +
                            "ON water_devices.sensor_id = sensor_info.id WHERE `contract_number` = '" +
                            element.contract_number +
                            "';";
                        conn.query(select_query, (err, results) => __awaiter(this, void 0, void 0, function* () {
                            if (err) {
                                reject({
                                    http: 401,
                                    status: "Failed",
                                    error: err,
                                });
                            }
                            else {
                                if (results && results.length == 0) {
                                    console.log("contract_number not found");
                                }
                                else {
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
                        }));
                    });
                });
            });
        });
    } // importFile()
    insertNewWaterObservations(insert_values) {
        return __awaiter(this, void 0, void 0, function* () {
            return new Promise((resolve, reject) => {
                database_1.default.getConnection((err, conn) => {
                    var insert_query = "INSERT INTO `water_module_observation` (`device_id`, `sensor_id`, `var_id`, `device_name`, `device_eui`, `var_name`, `gateway_mac`, `sensor_type_id`, `observation_value`," +
                        " `message_timestamp`, `time`, `user_id`, `alert_type`, `observation_type`, `created_dt`, `updated_dt`)" +
                        " VALUES " +
                        insert_values +
                        ";";
                    conn.query(insert_query, (err, results) => {
                        if (err) {
                            reject({
                                http: 401,
                                status: "Failed",
                                error: err,
                            });
                        }
                        else {
                            if (results && results.length == 0) {
                                resolve({
                                    http: 204,
                                    status: "Success",
                                    result: "Error importing water_module_observations",
                                });
                            }
                            else {
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
        });
    } // insertNewWaterObservations()
    getDistanceBetweenDates(date1str, date2str) {
        const date1 = new Date(date1str);
        const date2 = new Date(date2str);
        const diffTime = Math.abs(date2 - date1);
        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
        /*console.log("date1str <-> date2str", date1str, date2str)
        console.log("date1 <-> date2", date1, date2)
        console.log(diffDays + " days");
        */ return diffDays;
    }
    substractDaysToDate(dateStr, daysToSubstract) {
        var a = new Date(dateStr); // October 31, 2013
        //console.log("Before", a);
        a.setDate(a.getDate() - daysToSubstract); // November 1, 2013
        //console.log("After", a);
        let formatedDate = a.getFullYear() + "-" + a.getMonth() + "-" + a.getDate();
        return formatedDate;
    }
    fromDictionaryToArray(dictionary) {
        let array = [];
        for (var k in dictionary) {
            if (typeof dictionary[k] !== 'function') {
                console.log("Key is " + k + ", value is" + dictionary[k]);
                array.push(dictionary[k]);
            }
        }
        return array;
    }
    formatDate(date) {
        const offset = date.getTimezoneOffset();
        date = new Date(date.getTime() - (offset * 60 * 1000));
        return date.toISOString().split('T')[0];
    }
    // ESTO DEBERIA DE IR EN EL MODULO DE GROUP BALANCE
    getGroupBalanceOnRange(groupId, dateFrom, dateTo) {
        return __awaiter(this, void 0, void 0, function* () {
            return new Promise((resolve, reject) => {
                console.log("** CONTROLLER **");
                database_1.default.getConnection((err, conn) => {
                    console.log("** CONTROLLER **");
                    if (err) {
                        console.log("connErr -> ", err);
                        reject({
                            http: 401,
                            status: "Failed",
                            error: err,
                        });
                    }
                    var selQuery = "SELECT * FROM `water_module_group_balance` WHERE group_id=" + groupId + " AND date >= '" + dateFrom + "' AND date <= '" + dateTo + " 23:59:00' ORDER BY date ASC";
                    //console.log("selQuery",selQuery)
                    conn.query(selQuery, (err, results) => {
                        conn.release();
                        if (err) {
                            reject({
                                http: 401,
                                status: "Failed",
                                error: err,
                            });
                        }
                        else {
                            //console.log("\n results \n",results)
                            if (results && results.length == 0) {
                                resolve({
                                    http: 204,
                                    status: "Success",
                                    result: "There is no balance data on this range",
                                });
                            }
                            else {
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
        });
    }
    getGroupHydricBalance() {
        return __awaiter(this, void 0, void 0, function* () {
            let dateNow = new Date(Date.now());
            let dateNowFormated = dateNow.toISOString().split("T")[0];
            dateNow.setDate(dateNow.getDate() - 103);
            let date3before = dateNow.toISOString().split("T")[0];
            let dateNow2 = new Date(Date.now());
            dateNow2.setDate(dateNow2.getDate() - 1);
            let insertObservationDate = dateNow2.toISOString().split("T")[0];
            // Obtengo las observaciones de hoy y los ultimos dos días -> obtengo el consumo diario de cada dispositivo
            return new Promise((resolve, reject) => {
                var selectSQL = `
      SELECT water_group.id as water_group_id, water_devices.id as water_device_id, water_module_observation.observation_value, water_module_observation.message_timestamp 
      as observation_timestamp FROM water_group INNER JOIN water_devices ON water_devices.water_group_id=water_group.id INNER JOIN water_module_observation ON 
      water_module_observation.device_id=water_devices.id WHERE water_module_observation.message_timestamp >= '` + date3before + `' and water_module_observation.message_timestamp <= '`
                    + dateNowFormated + ` 23:59:00' ORDER BY water_group_id ASC, water_device_id ASC, observation_timestamp DESC;
      `;
                console.log("*** SelectGroupBalance ***", selectSQL);
                database_1.default.getConnection((error, conn) => {
                    // If the connection with the database fails
                    if (error) {
                        reject({
                            http: 401,
                            status: "Failed",
                            error: error,
                        });
                    }
                    conn.query(selectSQL, (err, results) => __awaiter(this, void 0, void 0, function* () {
                        var e_1, _a;
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
                            // Valores iniciales
                            var groupsBalanceRes = {};
                            let selectedDeviceId = results[0].water_device_id;
                            let selectedDeviceObservationValue = results[0].observation_value;
                            let selectedObservationDate = results[0].observation_timestamp;
                            let previousObservations = [];
                            let selectedGroupId = results[0].water_group_id;
                            let groupBalanceSum = 0;
                            if (results && results.length != 0) {
                                results.forEach((observation, index) => {
                                    if (index == results.length - 1) {
                                        groupBalanceSum += this.getDeviceHydricBalance(selectedDeviceObservationValue, selectedObservationDate, previousObservations);
                                        groupsBalanceRes[selectedGroupId] = groupBalanceSum;
                                    } // En la primera iteracion no se hace nada ya que los valores iniciales se han guardado antes
                                    else if (index != 0) {
                                        //console.log("observation",observation)
                                        // Si cambia el dispositivo seleccionado
                                        if (selectedDeviceId != observation.water_device_id) {
                                            // Añado al sumatorio el balance del dispositivo (con el que estaba trabajando antes de cambiar)
                                            groupBalanceSum += this.getDeviceHydricBalance(selectedDeviceObservationValue, selectedObservationDate, previousObservations);
                                            // Si el dispositivo es de otro grupo
                                            if (selectedGroupId != observation.water_group_id) {
                                                console.log("******* selectedGroupId ********", selectedGroupId);
                                                console.log("******* GROUP CHANGED ********", observation.water_group_id);
                                                // Guardo el valor del sumatorio junto con su id
                                                groupsBalanceRes[selectedGroupId] = groupBalanceSum;
                                                //reseteo el valor del sumatorio de balance de grupo
                                                groupBalanceSum = 0;
                                            }
                                            // Guardo los datos de la primera observacion del dispositivo (ahora trabajaré con este)
                                            selectedDeviceId = observation.water_device_id;
                                            selectedDeviceObservationValue = observation.observation_value;
                                            selectedObservationDate = observation.observation_timestamp;
                                            selectedGroupId = observation.water_group_id;
                                            // Reseteo el valor de las observaciones previas que empezaré a rellenar en la siguiente iteración
                                            previousObservations = [];
                                        }
                                        else {
                                            previousObservations.push(observation);
                                        }
                                    }
                                });
                                console.log("groupsBalanceRes", groupsBalanceRes);
                                try {
                                    for (var _b = __asyncValues(Object.keys(groupsBalanceRes)), _c; _c = yield _b.next(), !_c.done;) {
                                        const key = _c.value;
                                        console.log(`${key}: ${groupsBalanceRes[key]}`);
                                        this.storeHidridBalance(key, groupsBalanceRes[key], insertObservationDate);
                                    }
                                }
                                catch (e_1_1) { e_1 = { error: e_1_1 }; }
                                finally {
                                    try {
                                        if (_c && !_c.done && (_a = _b.return)) yield _a.call(_b);
                                    }
                                    finally { if (e_1) throw e_1.error; }
                                }
                            }
                        }
                    }));
                });
            });
        });
    }
    storeHidridBalance(group_id, balance, date) {
        return __awaiter(this, void 0, void 0, function* () {
            return new Promise((resolve, reject) => {
                var selectSQL = `
      INSERT INTO water_module_group_balance (group_id, balance, date) VALUES (` + group_id + `, ` + balance + `, '` + date + `');
      `;
                console.log("selectSQL", selectSQL);
                database_1.default.getConnection((error, conn) => {
                    // If the connection with the database fails
                    if (error) {
                        reject({
                            http: 401,
                            status: "Failed",
                            error: error,
                        });
                    }
                    conn.query(selectSQL, (err, results) => {
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
                            console.log("INSERT RESULT: " + results);
                        }
                    });
                });
            });
        });
    }
    getDeviceHydricBalance(lastObservation, selectedObservationDate, previousObservations) {
        let formatedDate = this.formatDate(selectedObservationDate);
        let res = 0;
        console.log("previousObservations", previousObservations);
        for (let i = 0; i < previousObservations.length; i++) {
            let observation = previousObservations[i];
            let daysDifference = this.getDistanceBetweenDates(formatedDate, observation.observation_timestamp);
            if (daysDifference > 1) {
                return (lastObservation - ((lastObservation + observation.observation_value) / daysDifference));
            }
            else {
                return lastObservation - observation.observation_value;
            }
        }
        return res;
    }
    getObservationsByRangeDateAndDeviceId(deviceId, fromDate, toDate) {
        return __awaiter(this, void 0, void 0, function* () {
            return new Promise((resolve, reject) => {
                var selectSQL = "SELECT message_timestamp as timestamp, observation_value as value FROM water_module_observation WHERE device_id = " + deviceId + "" +
                    " and message_timestamp >= '" + fromDate + "' and message_timestamp <= '" + toDate + " 23:59:00' ORDER BY timestamp;";
                console.log(selectSQL);
                database_1.default.getConnection((error, conn) => {
                    // If the connection with the database fails
                    if (error) {
                        reject({
                            http: 401,
                            status: "Failed",
                            error: error,
                        });
                    }
                    conn.query(selectSQL, (err, results) => {
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
                            let observationsEachDay = {};
                            console.log(results);
                            results.forEach((observation, index) => {
                                console.log("index", index);
                                let date = new Date(observation.timestamp);
                                //let formatedDate = date.getFullYear() + "-" + date.getMonth() + "-" + date.getDate()
                                let formatedDate = this.formatDate(date);
                                // Falta comprobar que no hay ningun dia por medio que no haya mandado
                                if (index == 0) {
                                    // Compruebo si la primera observacion es del primer dia seleccionado en el rango
                                    if (this.getDistanceBetweenDates(this.formatDate(new Date(formatedDate)), formatedDate) == 0) {
                                        observationsEachDay[formatedDate] = observation.value;
                                    }
                                    else {
                                        // Si no lo es guardo un valor ( FALSE )
                                        observationsEachDay[formatedDate] = false;
                                    }
                                }
                                else if (index == results.length - 1) {
                                    // Compruebo si la ultima observacion es del ultimo dia seleccionado en el rango
                                    if (this.getDistanceBetweenDates(formatedDate, this.formatDate(new Date(toDate))) == 0) {
                                        if (!observationsEachDay[formatedDate]) {
                                            observationsEachDay[formatedDate] = observation.value;
                                        }
                                        else {
                                            // Si existe algun valor para esa fecha almacenado guardo la media entre el valor nuevo y el ya almacenado
                                            observationsEachDay[formatedDate] = (observation.value + observationsEachDay[formatedDate]) / 2;
                                        }
                                    }
                                    else {
                                        // Si no lo es devuelvo un error 204 ya que no puedo conocer cuanto a aumentado el deposito de agua
                                        // de ninguna forma
                                        console.log("***** EMPTY *****");
                                        resolve({
                                            http: 204,
                                            status: "Empty",
                                            result: 0
                                        });
                                    }
                                }
                                else if (index > 0) {
                                    let previousDate = new Date(results[index - 1].timestamp);
                                    //let formatedPreviousDate = previousDate.getFullYear() + "-" + previousDate.getMonth() + "-" + previousDate.getDate()
                                    let formatedPreviousDate = this.formatDate(previousDate);
                                    let distanceWithPreviousObservation = this.getDistanceBetweenDates(formatedPreviousDate, formatedDate);
                                    // la observacion es del mismo o el siguiente día
                                    if (distanceWithPreviousObservation == 0 || distanceWithPreviousObservation == 1) {
                                        // Si no hay ningun valor para esta fecha añado un valor con la fecha
                                        if (!observationsEachDay[formatedDate]) {
                                            observationsEachDay[formatedDate] = observation.value;
                                        }
                                        else {
                                            // Si existe algun valor para esa fecha almacenado guardo la media entre el valor nuevo y el ya almacenado
                                            observationsEachDay[formatedDate] = (observation.value + observationsEachDay[formatedDate]) / 2;
                                        }
                                    }
                                    else {
                                        // Entre esta observacion y la anterior hay mas de 1 día de diferencia
                                        let daysToSubstract = 1;
                                        do {
                                            // Añado valores nulos en las fechas intermedias
                                            let noValueformatedDate = this.substractDaysToDate(formatedDate, daysToSubstract);
                                            observationsEachDay[noValueformatedDate] = false;
                                            distanceWithPreviousObservation--;
                                            daysToSubstract++;
                                        } while (distanceWithPreviousObservation > 1);
                                    }
                                }
                            });
                            console.log("observationsEachDay", observationsEachDay);
                            console.log("observationsEachDayARRAY", this.fromDictionaryToArray(observationsEachDay));
                            var observationsArray = this.fromDictionaryToArray(observationsEachDay);
                            let resultCalc = 0;
                            // Si tengo la ultima medida y la anterior a esta obtengo la diferencia
                            if (observationsArray[observationsArray.length - 1] && observationsArray[observationsArray.length - 2]) {
                                resultCalc = observationsArray[observationsArray.length - 1] - observationsArray[observationsArray.length - 2];
                            }
                            else {
                                // Si no tengo las dos ultimas medidas busco la de dias anteriores y saco la diferencia para luego obtener la media
                                let divideBy = 2;
                                for (let index = observationsArray.length - 3; index >= 0; index--) {
                                    console.log("observationsArray[index]", observationsArray[index]);
                                    if (observationsArray[index]) {
                                        console.log("DENTRO DEL IF");
                                        resultCalc = (observationsArray[observationsArray.length - 1] - observationsArray[index]) / divideBy;
                                        console.log("resultCalc", resultCalc);
                                        // Response
                                        resolve({
                                            http: 200,
                                            status: "Success",
                                            result: resultCalc,
                                        });
                                        console.log("DENTRO DEL IF ***** END *****");
                                    }
                                    divideBy++;
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
                        }
                        else {
                            // Response
                            resolve({
                                http: 204,
                                status: "Empty",
                                result: 0
                            });
                        }
                    });
                });
            });
        });
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
    getObservationValuesByDeviceId(devicesIdArray, fromDate, userColumnSelection) {
        return __awaiter(this, void 0, void 0, function* () {
            return new Promise((resolve, reject) => {
                var date = new Date(fromDate);
                var fromDateFormated = date.getFullYear() +
                    "-" +
                    (parseInt(String(date.getMonth())) + 1) +
                    "-" +
                    date.getDate();
                var devicesIdPreparedSql = "";
                devicesIdArray.forEach((deviceId) => (devicesIdPreparedSql += deviceId + ","));
                console.log("controller()");
                database_1.default.getConnection((err, conn) => {
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
                    }
                    else if (userColumnSelection == "device_name" ||
                        userColumnSelection == "device_EUI") {
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
                    }
                    else if (userColumnSelection == "*") {
                        select_query =
                            "SELECT sensor_info.device_EUI, water_module_users.user_nif as water_user_nif,water_module_users.last_name as water_user_apellidos,water_module_users.first_name as water_user_name,water_devices.*, water_module_observation.observation_value, " +
                                "water_module_observation.message_timestamp " +
                                "FROM `water_module_observation`, (SELECT water_module_observation.device_id, " +
                                "MAX(water_module_observation.message_timestamp) as last_message_timestamp FROM " +
                                "water_module_observation WHERE water_module_observation.device_id IN (" +
                                devicesIdPreparedSql.slice(0, -1) +
                                ") " +
                                " AND water_module_observation.message_timestamp >= '" + fromDateFormated + "' AND water_module_observation.message_timestamp <= '" +
                                fromDateFormated +
                                " 23:59' GROUP BY water_module_observation.device_id)" +
                                " water_max_date INNER JOIN water_devices ON water_devices.id=water_max_date.device_id LEFT JOIN water_module_users ON water_module_users.id=water_devices.water_user_id LEFT JOIN sensor_info ON water_devices.sensor_id=sensor_info.id WHERE water_module_observation.device_id = water_max_date.device_id AND " +
                                "water_module_observation.message_timestamp = water_max_date.last_message_timestamp GROUP BY water_module_observation.device_id;";
                    }
                    else {
                        resolve({
                            http: 204,
                            status: "Success",
                            result: "Error: no user column selected",
                        });
                    }
                    console.log(select_query);
                    conn.query(select_query, (err, results) => __awaiter(this, void 0, void 0, function* () {
                        if (err) {
                            reject({
                                http: 401,
                                status: "Failed",
                                error: err,
                            });
                        }
                        else {
                            if (results && results.length == 0) {
                                resolve({
                                    http: 204,
                                    status: "Success",
                                    result: [],
                                });
                            }
                            else {
                                resolve({
                                    http: 200,
                                    status: "Success",
                                    result: results,
                                });
                            }
                        }
                    }));
                });
            });
        });
    } // getObservationValuesByContractNum()
}
exports.default = new WaterObservationsController();
