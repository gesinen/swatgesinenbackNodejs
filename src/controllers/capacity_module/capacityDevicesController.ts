import { Request, Response } from 'express';
import db from '../../database';
import mysql from 'mysql';

class CapacityDevicesController {
    
    /**
     * Creating a new capacity device
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
     * @returns True if the device is created well or False if there is an error
     */
    public async createCapacityDevice( name: string, description: string, sensor_id: number, user_id: number, capacity: number, max_capacity: number, type: string, address: string, coordinates_x: string, coordinates_y: string): Promise<object> {
        const obj = {
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

        return obj;
    }
}

export default new CapacityDevicesController();