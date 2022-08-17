import conn from "../../database";
import db from "../../database";
import { Utils } from "../../utils/Utils";


/*
 * /capacity/devices
 */
class CapacityDevicesController {

    public async getParkingList(userId: number, pageSize: number, pageIndex: number): Promise<any> {
        return new Promise((resolve, reject) => {
            const first_value = (pageSize * pageIndex) - pageSize;
            var query = "SELECT * FROM capacity_parking WHERE userId = " + userId +
                " ORDER BY capacity_parking.id DESC LIMIT " + first_value + ', ' + pageSize + ";"

            db.getConnection((err: any, conn: any) => {
                if (err) {
                    reject({
                        http: 401,
                        status: 'Failed',
                        error: err
                    })
                }
                console.log("query",query)
                conn.query(query, (error: any, results: any) => {
                    conn.release()

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

    public async getParking(id: number): Promise<any> {
        return new Promise((resolve, reject) => {
            var query = "SELECT * FROM capacity_parking WHERE id = "+ id;

            db.getConnection((err: any, conn: any) => {
                if (err) {
                    reject({
                        http: 401,
                        status: 'Failed',
                        error: err
                    })
                }

                conn.query(query, (error: any, results: any) => {
                    conn.release()

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

    public async getParkingListByAuthToken(pageSize: number, pageIndex: number,authorization:string,provider:any): Promise<any> {
        if(authorization == '' && provider == '' ||(authorization == undefined && provider == undefined) ){
            return new Promise((resolve, reject) => {
                reject({
                    http: 401,
                    status: 'Failed',
                    error: 'Authorization Failed'
                })
            })
        }
        return new Promise((resolve, reject) => {
            const first_value = (pageSize * pageIndex) - pageSize;
            var query = "SELECT * FROM capacity_parking WHERE  authToken = '"+authorization +"' and provider ='"+provider+"'"
                " ORDER BY capacity_parking.id DESC LIMIT " + first_value + ', ' + pageSize + ";"

            db.getConnection((err: any, conn: any) => {
                if (err) {
                    reject({
                        http: 401,
                        status: 'Failed',
                        error: err
                    })
                }
                console.log("query",query)
                conn.query(query, (error: any, results: any) => {
                    conn.release()

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

    public async getParkingByAuthToken(id: number,authorization:string,provider:any): Promise<any> {
        if(authorization == '' && provider == '' ||(authorization == undefined && provider == undefined) ){
            return new Promise((resolve, reject) => {
                reject({
                    http: 401,
                    status: 'Failed',
                    error: 'Authorization Failed'
                })
            })
        }

        return new Promise((resolve, reject) => {
            var query = "SELECT * FROM capacity_parking WHERE id = "+ id +" and authToken = '"+authorization +"' and provider ='"+provider+"'";

            db.getConnection((err: any, conn: any) => {
                if (err) {
                    reject({
                        http: 401,
                        status: 'Failed',
                        error: err
                    })
                }

                conn.query(query, (error: any, results: any) => {
                    conn.release()

                    if (error) {
                        reject({
                            http: 401,
                            status: 'Failed',
                            error: error
                        })
                    }
                    //console.log('result',results);
                    if (results.length == 0) {
                        resolve({
                            http: 204,
                            status: 'Success',
                            result: "There are no parkings with this ID and authorization please check",
                        })
                    } else {
                    resolve({
                        http: 200,
                        status: 'Success',
                        capacity_devices: [{
                            "id": results[0].id,
                            "name": results[0].name,
                            "description": results[0].description,
                            "currentCapacity": results[0].currentCapacity,
                            "maxCapacity": results[0].maxCapacity
                        }]
                    })
                }
                    /*if(results[0].authToken == authorization && results[0].provider ==  provider){
                        resolve({
                            http: 200,
                            status: 'Success',
                            capacity_devices: [{
                                "id": results[0].id,
                                "name": results[0].name,
                                "currentCapacity": results[0].currentCapacity,
                                "maxCapacity": results[0].maxCapacity
                            }]
                        })
                    }
                    else{
                        reject({
                            http: 401,
                            status: 'Failed',
                            error: 'Unauthorized'
                        })
                    }*/
                    
                })
            })
        })
    }

    public async getCartelById(id: number): Promise<any> {
        return new Promise((resolve, reject) => {
            var query = "SELECT * FROM capacity_cartel WHERE id=" + id;

            db.getConnection((err: any, conn: any) => {
                if (err) {
                    reject({
                        http: 401,
                        status: 'Failed',
                        error: err
                    })
                }

                conn.query(query, (error: any, results: any) => {
                    conn.release()

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
                        result: results
                    })
                })
            })
        })
    }

    public async getCartelsWithFreeLines(): Promise<any> {
        return new Promise((resolve, reject) => {
            var query = "SELECT capacity_cartel.*, COUNT(*) as cartelFreeLines FROM capacity_cartel INNER JOIN capacity_cartel_line ON capacity_cartel.id=capacity_cartel_line.cartelId WHERE capacity_cartel_line.ribbonId IS NULL GROUP BY capacity_cartel.id";

            db.getConnection((err: any, conn: any) => {
                if (err) {
                    reject({
                        http: 401,
                        status: 'Failed',
                        error: err
                    })
                }

                conn.query(query, (error: any, results: any) => {
                    conn.release()

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
                        result: results
                    })
                })
            })
        })
    }

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
    public async createParking(name: string, description: string, currentCapacity: number, maxCapacity: number = 0, address: string, userId: number): Promise<object> {

        return new Promise((resolve: any, reject: any) => {

            db.getConnection((err: any, conn: any) => {
                if (err) {
                    reject({
                        http: 401,
                        status: 'Failed',
                        error: err
                    })
                }

                conn.query("INSERT INTO `capacity_parking` (`name`, `description`, `currentCapacity`, `maxCapacity`, `address`, `userId`) VALUES ('" + name + "', '" + description + "', " + currentCapacity + ", " + maxCapacity + ",'" + address + "'," + userId + ");",
                    (error: any, results: any, fields: any) => {
                        conn.release()

                        if (error) {
                            reject({ error: error })
                        } else {
                            resolve({
                                http: 200,
                                status: 'Success',
                                response: "The capacity cartel has been created succesfully"
                            })
                        }
                    }
                )
            })
        })
    } // createCapacityDevice ()

    public async updateParkingActualCapacity(id: number, currentCapacity: number): Promise<object> {

        return new Promise((resolve, reject) => {


            var query = "UPDATE capacity_parking SET"

            // Checking if each param is not empty and adding it to the query
            if (currentCapacity) {
                query += " currentCapacity = '" + currentCapacity + "',"
            }

            // Removing the last comma
            query = query.slice(0, -1);

            // Adding the WHERE condition 
            query += " WHERE id = " + id;

            // Running the query
            db.getConnection((err: any, conn: any) => {
                if (err) {
                    reject({
                        http: 401,
                        status: 'Failed',
                        error: err
                    })
                }

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
                            result: "There are no parkings with this ID",
                        })
                    } else {
                        resolve({
                            http: 200,
                            status: 'Success',
                            result: "The parking capacity has been updated successfully"
                        })
                    }
                })
            })
        })
    } // ()

    // Update Paking current Capacity and max capacity for Mobile app
    public async updateParkingCapacityByAuthToken(id: number, authorization:string,provider:any,currentCapacity: number, maxCapacity: number): Promise<object> {

        if(authorization == '' && provider == '' ||(authorization == undefined && provider == undefined) ){
            return new Promise((resolve, reject) => {
                reject({
                    http: 401,
                    status: 'Failed',
                    error: 'Authorization Failed'
                })
            })
        }
        return new Promise((resolve, reject) => {


            var query = "UPDATE capacity_parking SET"

            // Checking if each param is not empty and adding it to the query
            if (currentCapacity) {
                query += " currentCapacity = '" + currentCapacity + "',"
            }
            if (maxCapacity) {
                query += " maxCapacity = '" + maxCapacity + "',"
            }
            
            // Removing the last comma
            query = query.slice(0, -1);
            console.log(query);
            // Adding the WHERE condition 
            query += " WHERE id = " + id +" and  authToken = '" + authorization+"' and provider = '"+provider+"'";
            console.log('complete query',query);

            // Running the query
            db.getConnection((err: any, conn: any) => {
                if (err) {
                    reject({
                        http: 401,
                        status: 'Failed',
                        error: err
                    })
                }

                conn.query(query, (error: any, results: any) => {
                    conn.release()

                    if (error) {
                        reject({
                            http: 401,
                            status: 'Failed',
                            error: err
                        })
                    }
                    console.log('results',results.affectedRows);
                    if (results.affectedRows == 0) {
                        resolve({
                            http: 204,
                            status: 'Success',
                            result: "There are no parkings with this ID and authorization please check",
                        })
                    } else {
                        resolve({
                            http: 200,
                            status: 'Success',
                            result: "The parking capacity has been updated successfully"
                        })
                    }
                })
            })
        })
    } // ()

    public async updateParkingCapacity(id: number, currentCapacity: number, maxCapacity: number): Promise<object> {

        return new Promise((resolve, reject) => {


            var query = "UPDATE capacity_parking SET"

            // Checking if each param is not empty and adding it to the query
            if (currentCapacity) {
                query += " currentCapacity = '" + currentCapacity + "',"
            }
            if (maxCapacity) {
                query += " maxCapacity = '" + maxCapacity + "',"
            }

            // Removing the last comma
            query = query.slice(0, -1);

            // Adding the WHERE condition 
            query += " WHERE id = " + id;

            // Running the query
            db.getConnection((err: any, conn: any) => {
                if (err) {
                    reject({
                        http: 401,
                        status: 'Failed',
                        error: err
                    })
                }

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
                            result: "There are no parkings with this ID",
                        })
                    } else {
                        resolve({
                            http: 200,
                            status: 'Success',
                            result: "The parking capacity has been updated successfully"
                        })
                    }
                })
            })
        })
    } // ()


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
    public async updateCapacityParking(id: number, name?: string, description?: string, currentCapacity?: number, maxCapacity?: number, address?: string): Promise<object> {

        return new Promise((resolve, reject) => {

            if (!name && !description && !currentCapacity && !maxCapacity && !address) {
                reject({
                    http: 406,
                    status: 'Failed',
                    error: "All fields are empty"
                })
            }

            var query = "UPDATE capacity_parking SET"

            // Checking if each param is not empty and adding it to the query
            if (name) {
                query += " name = '" + name + "',"
            }
            if (description) {
                query += " description = '" + description + "',"
            }
            if (currentCapacity) {
                query += " currentCapacity = '" + currentCapacity + "',"
            }
            if (maxCapacity) {
                query += " maxCapacity = '" + maxCapacity + "',"
            }
            if (address) {
                query += " address = '" + address + "',"
            }

            // Removing the last comma
            query = query.slice(0, -1);

            // Adding the WHERE condition 
            query += " WHERE id = " + id;

            // Running the query
            db.getConnection((err: any, conn: any) => {
                if (err) {
                    reject({
                        http: 401,
                        status: 'Failed',
                        error: err
                    })
                }

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
                            result: "There are no capacity parkings with this ID",
                        })
                    } else {
                        resolve({
                            http: 200,
                            status: 'Success',
                            result: "The capacity parking has been updated successfully"
                        })
                    }
                })
            })
        })
    } // ()

    public async deleteCapacityParking(id: number): Promise<object> {
        return new Promise((resolve, reject) => {
            db.getConnection((err: any, conn: any) => {
                if (err) {
                    reject({
                        http: 401,
                        status: 'Failed',
                        error: err
                    })
                }

                conn.query("DELETE FROM capacity_parking WHERE id = " + id,
                    (err: any, results: any) => {
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

    public getParkingSensors(id: number): Promise<object> {
        return new Promise((resolve, reject) => {
            db.getConnection((err: any, conn: any) => {

                if (err) {
                    reject({
                        http: 401,
                        status: 'Failed',
                        error: err
                    })
                }
                
                let query = "SELECT capacity_cartel.sensorId, capacity_cartel.id, sensor_info.*, capacity_cartel_line.cartelId, capacity_cartel_line.parkingId, sensor_gateway_pkid.mac_number, sensor_gateway_pkid.sensor_id FROM capacity_cartel LEFT JOIN sensor_info ON sensor_info.id = capacity_cartel.sensorId LEFT JOIN capacity_cartel_line ON capacity_cartel_line.cartelId = capacity_cartel.id LEFT JOIN sensor_gateway_pkid ON sensor_gateway_pkid.sensor_id = sensor_info.id WHERE capacity_cartel_line.parkingId = " + id
                console.log(query)
                
                conn.query(query, (err: any, results: any) => {
                    conn.release()
                    
                        console.log(results)
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
                                sensors: results
                            })
                        }
                    })
            })
        })
    }
}

export default new CapacityDevicesController();
