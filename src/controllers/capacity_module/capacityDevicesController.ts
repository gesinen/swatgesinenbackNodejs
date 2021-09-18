import { Request, Response } from "express";
import db from "../../database";
import mysql from "mysql";

/**
 * Route: /capacity/devices
 */
class CapacityDevicesController {
	/**
	 * Creating a new capacity device
     * POST (/)
	 *
	 * @param name
	 * @param description
	 * @param sensor_id
	 * @param user_id
	 * @param capacity
	 * @param max_capacity
	 * @param type
	 * @param address
	 * @param coordinates_x
	 * @param coordinates_y
	 *
	 * @returns A promise
	 */
	public async createCapacityDevice( name: string, description: string, sensor_id: number, user_id: number, capacity: number, max_capacity: number, type: string, address: string, coordinates_x: string, coordinates_y: string): Promise<object> {

        return new Promise( (resolve, reject) => {

            db.query(
                "INSERT INTO capacity_devices"+
                "(name, description, sensor_id, user_id, capacity, max_capacity, type, address, coordinates_x, coordinates_y)" +
				" VALUES ('" + name + "','" + description + "'," + sensor_id + "," + user_id + "," + capacity + "," + max_capacity + ",'" + type + "','" + address + "','" + coordinates_x + "','" + coordinates_y + "')" , 
                
                (error, results, fields) => {   
                    if (error) {
                        reject({ error: error })
                    } else {
                        resolve({
                            status: 200,
                            response: 'The capacity device has been created succesfully',
                            capacity_device: {
                                name: name,
                                description: description,
                                sensor_id: sensor_id,
                                user_id: user_id,
                                capacity: capacity,
                                max_capacity: max_capacity,
                                type: type,
                                address: address,
                                coordinates_x: coordinates_x,
                                coordinates_y: coordinates_y
                            }
                        })
                    }
                }
            )
        })
	}
}

export default new CapacityDevicesController();
