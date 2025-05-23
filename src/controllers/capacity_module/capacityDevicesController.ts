import conn from "../../database";
import db from "../../database";
import { Utils } from "../../utils/Utils";
import sensorController from "../sensor_module/sensorController";
import capacityCartelController from "./capacityCartel";
import capacityTypeRibbonController from "./capacityTypeRibbon";
import capacityTypeSpotController from "./capacityTypeSpot";

/*
 * /capacity/devices
 */
class CapacityDevicesController {
    /**
     * POST ('/')
     * Creating a new capacity device
     *
     * @async
     * @param name - The name of the capacity device
     * @param description - The description of the capacity device
     * @param sensor_id - The ID of the sensor that is assigned to capacity device
     * @param user_id - The ID of the user that has the capacity device
     * @param capacity - The current capacity of the device
     * @param max_capacity - The maximum capacity that the device can have
     * @param type - The capacity device type. It can be TOF, parking_individual or parking_area
     * @param address - The address where is installed the capacity device
     * @param coordinates_x - The coordinates in X axis of the capacity devices
     * @param coordinates_y - The coordinates in Y axis of the capacity devices
     *
     * @return
     */
    public async createCapacityDevice(sensorId: number, name: string, description: string, latitude: number, longitude: number, authToken: string, provider: string, userId: number, type: string, parkingId: number, username: string, password: string, region1: string, region2: string, region3: string, region4: string): Promise<object> {

        return new Promise((resolve: any, reject: any) => {

            db.getConnection((err: any, conn: any) => {

                let query = "INSERT INTO `capacity_devices` (`sensorId`, `name`, `description`, `latitude`, `longitude`, " +
                    "`authToken`, `provider`, `userId`, `type`,`username`,`password`,`region_one`,`region_two`,`region_three`,`region_four`) VALUES (" + sensorId + ", '" + name + "', '" + description + "', " + latitude +
                    ", " + longitude + ", '" + authToken + "', '" + provider + "', " + userId + ", '" + type + "', '" + username + "', '" + password + "', '" + region1 + "', '" + region2 + "', '" + region3 + "', '" + region4 + "');"
                console.log(query)
                conn.query(query,
                    async (error: any, results: any, fields: any) => {
                        conn.release()

                        try {
                            if (results && results.length == 0) {
                                resolve({
                                    http: 204,
                                    status: 'Error',
                                    response: "Capacity device could not be created"
                                })
                            } else {
                                console.log(results)
                                let lastInsertCapacityDeviceId: any = results.insertId
                                console.log("type", type)
                                if (type == "parking_individual") {
                                    console.log("type", type)
                                    let capacitySpotCreateRes: any = await capacityTypeSpotController.createCapacitySpotDevice(lastInsertCapacityDeviceId, parkingId)
                                        .catch(err => {
                                            console.log(err)
                                            resolve({
                                                http: 204,
                                                status: 'Error',
                                                message: err,
                                                response: "Capacity spot device could not be created"
                                            })
                                        })
                                    console.log("capacitySpotCreateRes", capacitySpotCreateRes)

                                    if (capacitySpotCreateRes.http != 200) {
                                        this.deleteCapacityDevice(lastInsertCapacityDeviceId).catch(err => {
                                            console.log(err)
                                            resolve({
                                                http: 204,
                                                status: 'Error',
                                                message: err,
                                                response: "Capacity spot device could not be deleted"
                                            })
                                        })
                                        resolve({
                                            http: 204,
                                            status: 'Error',
                                            response: "Capacity spot device could not be created"
                                        })
                                    }
                                } else {
                                    let capacityRibbonCreateRes: any = await capacityTypeRibbonController.createCapacityRibbonDevice(lastInsertCapacityDeviceId, parkingId)
                                        .catch(err => {
                                            console.log(err)
                                            resolve({
                                                http: 204,
                                                status: 'Error',
                                                message: err,
                                                response: "Capacity ribbon device could not be created"
                                            })
                                        })
                                    if (capacityRibbonCreateRes.http != 200) {
                                        this.deleteCapacityDevice(lastInsertCapacityDeviceId).catch(err => {
                                            console.log(err)
                                            resolve({
                                                http: 204,
                                                status: 'Error',
                                                message: err,
                                                response: "Capacity ribbon device could not be deleted"
                                            })
                                        })
                                        resolve({
                                            http: 204,
                                            status: 'Error',
                                            response: "Capacity ribbon device could not be created"
                                        })
                                    }
                                }
                            }

                            if (error) {
                                reject({ error: error })
                            } else {
                                resolve({
                                    http: 200,
                                    status: 'Success',
                                    response: "The capacity device has been created succesfully"
                                })
                            }
                        } catch (error) {
                            resolve({
                                http: 204,
                                status: 'Error',
                                message: err,
                                response: "Capacity spot device could not be created"
                            })
                        }

                    }
                )
            })
        })
    } // createCapacityDevice ()

    /**
     * GET ('/:id')
     * Getting information about a capacity device with the device ID
     * 
     * @param id The ID of the capacity device that you want to get the information from
     * 
     * @return
     */
    public async getCapacityDeviceById(id: number): Promise<object> {

        return new Promise((resolve: any, reject: any) => {

            db.getConnection((err: any, conn: any) => {
                //var query = "SELECT capacity_devices.* ,capacity_type_spot.parkingId as parkingId , sensor_info.device_EUI, sensor_info.name as sensorName, sensor_gateway_pkid.mac_number FROM capacity_devices INNER JOIN capacity_type_spot  ON capacity_type_spot.capacityDeviceId = capacity_devices.id LEFT JOIN sensor_info ON sensor_info.id = capacity_devices.sensorId LEFT JOIN sensor_gateway_pkid ON sensor_gateway_pkid.sensor_id=sensor_info.id WHERE capacity_devices.id=" + id + ";";
                // the new query is changed 07-05-2024 by shesh
                var query = "SELECT capacity_devices.* , sensor_info.device_EUI, sensor_info.name as sensorName, sensor_gateway_pkid.mac_number FROM capacity_devices  LEFT JOIN sensor_info ON sensor_info.id = capacity_devices.sensorId LEFT JOIN sensor_gateway_pkid ON sensor_gateway_pkid.sensor_id=sensor_info.id WHERE capacity_devices.id=" + id + ";";
                conn.query(query, async (err: any, results: any) => {
                    conn.release()

                    if (err) {
                        reject({
                            http: 401,
                            status: 'Failed',
                            error: err
                        })
                    } else {

                        if (results.length == 0) {
                            resolve({
                                http: 204,
                                status: 'Success',
                                result: "There are no capacity devices with this ID",
                                capacity_device: {}
                            })
                        } else {
                            if (results[0].type == "parking_individual") {
                                let res: any = await capacityTypeSpotController.getCapacitySpotDevice(results[0].id).catch(err => {
                                    console.log(err)
                                    resolve({
                                        http: 204,
                                        status: 'Error',
                                        message: err,
                                        response: "Capacity spot device could not be retrieved"
                                    })
                                })
                                console.log("res", res)
                                console.log(res.capacity_devices, 'HOLAAAA 1')
                                if(res.capacity_devices.length > 0) {
                                    results[0].status = res.capacity_devices[0].status
                                    results[0].spotDeviceId = res.capacity_devices[0].id
                                    // this new line is added by shesh 7-05-2024
                                    results[0].parkingId = res.capacity_devices[0].parkingId
                                    
                                }
                            } else {
                                let res: any = await capacityTypeRibbonController.getCapacityRibbonDeviceById(results[0].id).catch(err => {
                                    console.log(err)
                                    resolve({
                                        http: 204,
                                        status: 'Error',
                                        message: err,
                                        response: "Capacity ribbon device could not be retrieved"
                                    })
                                })
                                /*console.log(res.capacity_devices, 'HOLAAAA 2')
                                if(res.capacity_devices != undefined && res.capacity_devices.length > 0) {
                                    results[0].parkingId = res.result[0].parkingId
                                    results[0].ribbonDeviceId = res.result[0].id
                                }*/

                                // the below code is replace by above on 07-05-2024 by shesh
                                console.log(res.result, 'HOLAAAA 2')
                                if(res.result != undefined && res.result.length > 0) {
                                    results[0].parkingId = res.result[0].parkingId
                                    results[0].ribbonDeviceId = res.result[0].id
                                }
                                console.log("res", res)
                            }
                            resolve({
                                http: 200,
                                status: 'Success',
                                capacity_device: results[0]
                            })
                        }
                    }
                })
            })
        });
    } // getCapacityDeviceById()

    /**
     * PUT ('/:id')
     * Updating data of a capacity device
     * 
     * @async
     * @param name - The name of the capacity device
     * @param description - The description of the capacity device
     * @param sensor_id - The ID of the sensor that is assigned to capacity device
     * @param capacity - The current capacity of the device
     * @param max_capacity - The maximum capacity that the device can have
     * @param type - The capacity device type. It can be TOF, parking_individual or parking_area
     * @param address - The address where is installed the capacity device
     * @param coordinates_x - The coordinates in X axis of the capacity devices
     * @param coordinates_y - The coordinates in Y axis of the capacity devices 
     * 
     * @returns 
     */
    public async updateCapacityDevice(id: number, name?: string, description?: string, sensorId?: number, authToken?: string, provider?: string, type?: string,
        address?: string, latitude?: number, longitude?: number, ribbonDeviceId?: number, parkingId?: number, spotDeviceId?: number, status?: boolean): Promise<object> {

        return new Promise((resolve, reject) => {

            if (!name && !description && !sensorId && !authToken && !provider && !type && !address && !latitude && !longitude) {
                reject({
                    http: 406,
                    status: 'Failed',
                    error: "All fields are empty"
                })
            }

            var query = "UPDATE capacity_devices SET"

            // Checking if each param is not empty and adding it to the query
            if (name) {
                query += " name = '" + name + "',"
            }
            if (description) {
                query += " description = '" + description + "',"
            }
            if (authToken) {
                query += " authToken = '" + authToken + "',"
            }
            if (provider) {
                query += " provider = '" + provider + "',"
            }
            if (sensorId) {
                query += " sensorId = " + sensorId + ","
            }
            if (type) {
                query += " type = '" + type + "',"
            }
            if (address) {
                query += " address = '" + address + "',"
            }
            if (latitude) {
                query += " latitude = " + latitude + ","
            }
            if (longitude) {
                query += " longitude = " + longitude + ","
            }

            // Removing the last comma
            query = query.slice(0, -1);

            // Adding the WHERE condition 
            query += " WHERE id = " + id;

            // Running the query
            db.getConnection((err: any, conn: any) => {
                conn.query(query, (error: any, results: any) => {
                    conn.release()

                    if (error) {
                        reject({
                            http: 401,
                            status: 'Failed',
                            error: err
                        })
                    }

                    if (results.length == 0) {
                        resolve({
                            http: 204,
                            status: 'Success',
                            result: "There is no capacity device with this ID",
                        })
                    } else {
                        if (type == "parking_individual") {
                            capacityTypeSpotController.updateCapacitySpotDevice(spotDeviceId, status).catch(err => {
                                console.log(err)
                                resolve({
                                    http: 204,
                                    status: 'Error',
                                    message: err,
                                    response: "Capacity spot device could not be updated"
                                })
                            })
                        } else {
                            capacityTypeRibbonController.updateCapacityRibbonDevice(id, parkingId).catch(err => {
                                console.log(err)
                                resolve({
                                    http: 204,
                                    status: 'Error',
                                    message: err,
                                    response: "Capacity ribbon device could not be updated"
                                })
                            })
                        }
                        resolve({
                            http: 200,
                            status: 'Success',
                            result: "The capacity device has been updated successfully"
                        })
                    }
                })
            })
        })
    } // ()

    public async deleteCapacityDevice(id: number): Promise<object> {
        return new Promise((resolve, reject) => {
            db.getConnection((err: any, conn: any) => {
                conn.query("DELETE FROM capacity_devices WHERE id = " + id, (err: any, results: any) => {
                    conn.release()

                    if (err) {
                        reject({
                            http: 401,
                            status: 'Failed',
                            error: err
                        })
                    } else {
                        resolve({
                            http: 200,
                            status: 'Success'
                        })
                    }
                })
            })
        })
    }

    public async getAllCapacityDevices(): Promise<object> {
        return new Promise((resolve, reject) => {
            db.getConnection((err: any, conn: any) => {
                conn.query("SELECT * FROM capacity_devices WHERE capacity_devices.type='parking_area_config'", (err: any, results: any) => {
                    conn.release()
                    if (err) {
                        reject({
                            http: 401,
                            status: 'Failed',
                            error: err
                        })
                    } else {
                        resolve({
                            http: 200,
                            status: 'Success',
                            result: results
                        })
                    }
                })
            })
        })
    }

    onlyUnique(value: any, index: any, self: any) {
        return self.indexOf(value) === index;
    }


    public async getParkingRibbonServiceInfo() {
        var gatewaysTopicInfo = []
        try {
            // Capacity devices
            var capacityDevices: any = await this.getAllCapacityDevices()
            console.log("capacityDevices", capacityDevices)
            for await (let capacityDevice of capacityDevices.result) {
                //console.log("capcityDevInfo", sensorRequiredInfo)
                console.log("////////// asking for sensor info id = >" + capacityDevice.sensorId)
                var sensorRequiredInfo: any = await sensorController.getSensorDevEuiGatewayMac(capacityDevice.sensorId)
                console.log("sensorRequiredInfo", sensorRequiredInfo)
                if (sensorRequiredInfo.http == 200) {
                    var gateways = sensorRequiredInfo.result.gatewaysMac
                    for (let gateway of gateways) {
                        gatewaysTopicInfo.push(gateway.mac + '/#')
                    }
                }
            }
            console.log("*** GET CARTELS ***")
            // Cartels
            var cartelDevices: any = await capacityCartelController.getAllCartels()
            console.log("cartelDevices", cartelDevices)
            for await (let cartelDevice of cartelDevices.result) {
                var sensorRequiredInfo: any = await sensorController.getSensorDevEuiGatewayMac(cartelDevice.sensorId)
                console.log("cartelInfo", sensorRequiredInfo)
                if (sensorRequiredInfo.http == 200) {
                    var gateways = sensorRequiredInfo.result.gatewaysMac
                    for (let gateway of gateways) {
                        gatewaysTopicInfo.push(gateway.mac + '/#')
                    }
                }
            }
            console.log("gatewaysTopicInfo", gatewaysTopicInfo)
            return {
                http: 200,
                status: "Success",
                response: gatewaysTopicInfo.filter(this.onlyUnique)
            }
        } catch (error) {
            console.log(error)
            return {
                http: 403,
                status: "Error"
            }
        }



    }

    /**
     * GET ('/list/:userId')
     * Getting a list with all capacity devices from a user
     * 
     * @async
     * @param user_id - The user's Id
     * 
     * @returns 
     */
    public async getUserCapacityDevicesList(userId: number, pageSize: number, pageIndex: number): Promise<object> {

        return new Promise((resolve, reject) => {
            const first_value = (pageSize * pageIndex) - pageSize;

            var query = "SELECT capacity_devices.* , sensor_info.device_EUI, sensor_info.name as sensorName, sensor_gateway_pkid.mac_number FROM capacity_devices LEFT JOIN sensor_info ON sensor_info.id = capacity_devices.sensorId LEFT JOIN sensor_gateway_pkid ON sensor_gateway_pkid.sensor_id=sensor_info.id WHERE userId = " + userId +
                " ORDER BY capacity_devices.id DESC LIMIT " + first_value + ', ' + pageSize + ";"
            db.getConnection((err: any, conn: any) => {
                conn.query(query, (err: any, results: any) => {
                    conn.release()

                    if (err) {
                        reject({
                            http: 401,
                            status: 'Failed',
                            error: err
                        })
                    } else {

                        if (results.length == 0) {
                            resolve({
                                http: 204,
                                status: 'Success',
                                message: "This user has no capacity devices",
                                result: []
                            })
                        } else {
                            resolve({
                                http: 200,
                                status: 'Success',
                                result: results
                            })
                        }
                    }
                })
            })
        })
    } // ()

    /**
     *  GET ('/most/:id')
     * Getting the most capacity devices from a user
     * 
     * @async
     * @param user_id - The user's Id
     * 
     * @returns 
     */
    public async getMostCapacityDevices(user_id: number): Promise<object> {

        return new Promise((resolve: any, reject: any) => {

            var query = "SELECT * FROM capacity_devices ORDER BY capacity DESC LIMIT 4";

            db.getConnection((err: any, conn: any) => {

                if (err) {
                    reject({
                        http: 401,
                        status: 'Failed',
                        error: err
                    })
                }

                conn.query(query, (error: any, results: any) => {
                    conn.release();

                    if (error) {
                        reject({
                            http: 401,
                            status: 'Failed',
                            error: error
                        })
                    }

                    resolve({
                        http: 200,
                        status: 'Success',
                        capacity_devices: results
                    })
                })
            })

        })
    } // ()

    /**
     *  GET ('/less/:id')
     * Getting the less capacity devices from a user
     * 
     * @async
     * @param user_id - The user's Id
     * 
     * @returns 
     */
    public async getLessCapacityDevices(user_id: number): Promise<object> {

        return new Promise((resolve: any, reject: any) => {

            var query = "SELECT * FROM capacity_devices ORDER BY capacity ASC LIMIT 4";

            db.getConnection((err: any, conn: any) => {

                if (err) {
                    reject({
                        http: 401,
                        status: 'Failed',
                        error: err
                    })
                }

                conn.query(query, (error: any, results: any) => {
                    conn.release();

                    if (error) {
                        reject({
                            http: 401,
                            status: 'Failed',
                            error: error
                        })
                    }

                    resolve({
                        http: 200,
                        status: 'Success',
                        capacity_devices: results
                    })
                })
            })

        })
    } // ()

    public async getSpotChart(userId: number): Promise<any> {
        return new Promise((resolve, reject) => {
            var query = "SELECT name, capacity, type FROM capacity_devices WHERE user_id = " + userId;

            db.getConnection((err: any, conn: any) => {
                if (err) {
                    reject({
                        http: 401,
                        status: 'Failed',
                        error: err
                    })
                }

                conn.query(query, (error: any, results: any) => {
                    if (error) {
                        reject({
                            http: 401,
                            status: 'Failed',
                            error: error
                        })
                    }

                    resolve({
                        http: 200,
                        status: 'Success',
                        capacity_devices: results
                    })
                })
            })
        })
    }
    /*
        // SPOT
        public async importCapacityDevices(capacity_devices: any[], user_id: any) {
            return new Promise(async (resolve, reject) => {
    
                let countCapacityDevs = 0;
                let notAddedCapacityDevs: any[]
                for (const capacity_device of capacity_devices) {
                    try {
                        console.log("mail", capacity_device.mail)
                        let user: any = await UsersController.getUserIdByMail(capacity_device.mail)
                        console.log(user)
                        let userId
                        if (user.http != 200) {
                            userId = 99999
                        } else {
                            userId = user.user_data.id
                        }
                        let res: any = await this.createCapacityDevice(capacity_device.name, capacity_device.description, capacity_device.sensor_id, userId, 0,
                            capacity_device.max_capacity, capacity_device.type, capacity_device.address, capacity_device.coordinates_x, capacity_device.coordinates_y)
                        if (res.http == 200) {
                            console.log("res capacity device", res)
                            countCapacityDevs++
                            console.log(countCapacityDevs)
                        } else {
                            notAddedCapacityDevs.push(capacity_device.name)
                        }
                    } catch (error) {
                        reject({
                            http: 401,
                            status: 'Failed',
                            error: error
                        })
                    }
                }
    
                resolve({
                    http: 200,
                    status: 'Success',
                    added_devices: countCapacityDevs
                })
            })
        }
    
        // LAZO
        public async importCapacityDevicesLazo(capacity_devices: any[], user_id: any) {
            return new Promise(async (resolve, reject) => {
    
                let countCapacityDevs = 0;
                let countRibbonDevs = 0;
                let notAddedCapacityDevs: any[]
                for (const capacity_device of capacity_devices) {
                    try {
                        console.log("mail", capacity_device.mail)
                        let user: any = await UsersController.getUserIdByMail(capacity_device.mail)
                        console.log(user)
                        let userId
                        if (user.http != 200) {
                            userId = 99999
                        } else {
                            userId = user.user_data.id
                        }
                        let res: any = await this.createCapacityDevice(capacity_device.name, capacity_device.description, capacity_device.sensor_id, userId, 0,
                            capacity_device.max_capacity, capacity_device.type, capacity_device.address, capacity_device.coordinates_x, capacity_device.coordinates_y)
                        if (res.http == 200) {
                            console.log("res capacity device", res)
                            countCapacityDevs++
                            console.log(countCapacityDevs)
                            let resRibbon: any = await this.createCapacityDeviceParkingArea(capacity_device.device_id, capacity_device.numero_de_parkings, capacity_device.sensor_devEUI_cartel, capacity_device.plazas_parking_1_max, capacity_device.plazas_parking_2_max,
                                capacity_device.plazas_parking_3_max, capacity_device.numero_de_entradas_o_salidas, capacity_device.salida_entrada_1, capacity_device.sensor_id_entrada_salida_1, capacity_device.parking_num_1, capacity_device.salida_entrada_2, capacity_device.sensor_id_entrada_salida_2, capacity_device.parking_num_2, capacity_device.salida_entrada_3, capacity_device.sensor_id_entrada_salida_3, capacity_device.parking_num_3)
                            if (resRibbon.http == 200) {
                                countRibbonDevs++
                            }
                        } else {
                            notAddedCapacityDevs.push(capacity_device.name)
                        }
                    } catch (error) {
                        reject({
                            http: 401,
                            status: 'Failed',
                            error: error
                        })
                    }
                }
    
                resolve({
                    http: 200,
                    status: 'Success',
                    added_devices: countCapacityDevs,
                    added_ribbon_devices: countRibbonDevs
                })
            })
        }*/


    /**
     *  GET ('/hourlyGraph/:userId')
     * Getting the hourlyGraph capacity devices from a user
     * 
     * @async
     * @param hourlyGraph - The hourly Graph
     * 
     * @returns 
     */
    public async getCapacityDeviceParkingHourlyGraph(userId: number): Promise<object> {

        return new Promise((resolve: any, reject: any) => {

            var query = "select cdl.id, AVG( cdl.currentCapacity) as capacity, cdl.timestamp,cdl.capacityDeviceEUI, cdl.parkingId, AVG(cdl.maxCapacity) as maxCapacity, capacity_parking.userId, capacity_parking.name as parkingName from capacity_devices_log as cdl inner join capacity_parking on capacity_parking.id = cdl.parkingId  where capacity_parking.userId = "+userId+"  AND DATE_SUB(`timestamp`,INTERVAL 1 HOUR) And timestamp > DATE_SUB(NOW(), INTERVAL 1 DAY)  group by date(cdl.timestamp), Hour(cdl.timestamp),cdl.parkingId order by cdl.id ASC;";

            db.getConnection((err: any, conn: any) => {

                if (err) {
                    reject({
                        http: 401,
                        status: 'Failed',
                        error: err
                    })
                }

                conn.query(query, (error: any, results: any) => {
                    conn.release();

                    if (error) {
                        reject({
                            http: 401,
                            status: 'Failed',
                            error: error
                        })
                    }

                    resolve({
                        http: 200,
                        status: 'Success',
                        capacity_devices: results
                    })
                })
            })

        })
    } // ()

    /**
     *  GET ('/monthlyGraph/:userId')
     * Getting the monthlyGraph capacity devices from a user
     * 
     * @async
     * @param monthlyGraph - The monthly Graph
     * 
     * @returns 
     */
    public async getCapacityDeviceParkingMonthlyGraph(userId: number): Promise<object> {

        return new Promise((resolve: any, reject: any) => {

            //var query = "select  AVG(currentCapacity), Month(timestamp) from capacity_devices_log  where capacityDeviceEUI = '181f3c71bff07000'  group by year(timestamp),  Month(timestamp)";
            var query =   "select cdl.id, AVG( cdl.currentCapacity) as capacity, cdl.timestamp , cdl.capacityDeviceEUI, cdl.parkingId, AVG(cdl.maxCapacity) as maxCapacity, capacity_parking.name as parkingName  from capacity_devices_log as cdl inner join capacity_parking on capacity_parking.id = cdl.parkingId  where capacity_parking.userId = "+userId+"  group by Date(timestamp) ,cdl.parkingId order by cdl.id ASC;"
            db.getConnection((err: any, conn: any) => {

                if (err) {
                    reject({
                        http: 401,
                        status: 'Failed',
                        error: err
                    })
                }

                conn.query(query, (error: any, results: any) => {
                    conn.release();

                    if (error) {
                        reject({
                            http: 401,
                            status: 'Failed',
                            error: error
                        })
                    }

                    resolve({
                        http: 200,
                        status: 'Success',
                        capacity_devices: results
                    })
                })
            })

        })
    } // ()

}

export default new CapacityDevicesController();
