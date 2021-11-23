import db from "../../database";

class WaterDevicesController {

    /**
     * POST ('/')
     * Create a new water device
     * 
     * @async
     * @param name 
     * @param sensor_id 
     * @param variable_name 
     * @param water_group_id 
     * @param water_user_id 
     * @param user_id 
     * @param municipality_id 
     * @param description 
     * @param units 
     * @param contract_number 
     * @param device_diameter 
     * @param sewer_rate_id 
     * @param installation_address 
     * 
     * @returns 
     */
    public async createWaterDevice(name: string, sensor_id: number, variable_name: string = null, water_group_id: number = null, water_user_id: number = null, user_id: number, municipality_id: number = null, description: string = null, units: string = null, contract_number: string = null, device_diameter: number = null, sewer_rate_id: number = null, installation_address: string = null): Promise<object> {

        if (name) {
            name = "'" + name + "'"
        }
        if (variable_name) {
            variable_name = "'" + variable_name + "'"
        }
        if (description) {
            description = "'" + description + "'"
        }
        if (units) {
            units = "'" + units + "'"
        }
        if (contract_number) {
            contract_number = "'" + contract_number + "'"
        }
        if (installation_address) {
            installation_address = "'" + installation_address + "'"
        }
        
        var query = "INSERT INTO water_devices (name, sensor_id, variable_name, water_group_id, water_user_id, user_id, municipality_id, description, units, contract_number, device_diameter, sewer_rate_id, installation_address) VALUES (" + name + ","  + sensor_id + ","  + variable_name + ","  + water_group_id + ","  + water_user_id + ","  + user_id + ","  + municipality_id + ","  + description + ","  + units + ","  + contract_number + ","  + device_diameter + ","  + sewer_rate_id + ","  + installation_address + ")";

        return new Promise ((resolve: any, reject: any) => {
            db.getConnection((error: any, conn: any) => {

                // If the connection with the database fails
                if (error) {
                    reject({
                        http: 401,
                        status: 'Failed',
                        error: error
                    })
                }
    
                conn.query(query, (err: any, results: any) => {
                    conn.release()
                    
                    // If the query fails
                    if (err) {
                        reject({
                            http: 401,
                            status: 'Failed',
                            error: err
                        })
                    }
                    
                    // Response
                    resolve({
                        http: 200,
                        status: 'Success',
                        response: 'The water device has been created successfully.'
                    })
                })
            })
        })
    }

    /**
     * GET ('/page')
     * 
     * @async
     * @param user_id 
     * @param page_index 
     * @param page_size 
     * 
     * @returns 
     */
    public async getWaterDevicesListing(user_id: number, page_index: number, page_size: number) {

        const first_value = (page_size * page_index) - page_size;
        const second_value = (page_size * page_index);

        var query = "SELECT w.*, o.observation_value, o.message_timestamp, s.device_e_u_i FROM water_devices w LEFT JOIN (SELECT observation_value, message_timestamp, device_id FROM water_module_observation ORDER BY id DESC LIMIT 1) o ON (o.device_id = w.id) LEFT JOIN (SELECT device_EUI AS device_e_u_i, id FROM sensor_info) s ON (w.sensor_id = s.id) WHERE w.user_id = "+user_id+" ORDER BY w.id DESC LIMIT "+ first_value + ', ' + second_value;



        return new Promise ((resolve:any, reject:any) => {

            db.getConnection((error:any, conn:any) => {

                // If the connection with the database fails
                if (error) {
                    reject({
                        http: 401,
                        status: 'Failed',
                        error: error
                    })
                }

                conn.query(query, (err:any, results:any) => {
                    conn.release()
                    
                    // If the query fails
                    if (err) {
                        reject({
                            http: 401,
                            status: 'Failed',
                            error: err
                        })
                    }
                    
                    // Response
                    resolve({
                        http: 200,
                        status: 'Success',
                        water_devices: results
                    })
                })
            })
        })

    }

    /**
     * GET ('/admin_page')
     * 
     * @async
     * @param user_id 
     * @param page_index 
     * @param page_size 
     * 
     * @returns 
     */
     public async getAdminWaterDevicesListing(user_id: number, page_index: number, page_size: number) {

        // Pagination limit values
        const first_value = (page_size * page_index) - page_size;
        const second_value = (page_size * page_index);

        var query = "SELECT w.*, o.observation_value, o.message_timestamp, s.device_e_u_i FROM water_devices w LEFT JOIN (SELECT observation_value, message_timestamp, device_id FROM water_module_observation ORDER BY id DESC LIMIT 1) o ON (o.device_id = w.id) LEFT JOIN (SELECT device_EUI AS device_e_u_i, id FROM sensor_info) s ON (w.sensor_id = s.id) LEFT JOIN (SELECT * FROM users WHERE under_admin = "+ user_id +") u ON (w.user_id = u.id) ORDER BY w.id DESC LIMIT "+ first_value + ', ' + second_value;

        return new Promise ((resolve:any, reject:any) => {

            db.getConnection((error:any, conn:any) => {

                // If the connection with the database fails
                if (error) {
                    reject({
                        http: 401,
                        status: 'Failed',
                        error: error
                    })
                }

                conn.query(query, (err:any, results:any) => {
                    conn.release()
                    
                    // If the query fails
                    if (err) {
                        reject({
                            http: 401,
                            status: 'Failed',
                            error: err
                        })
                    }
                    
                    // Response
                    resolve({
                        http: 200,
                        status: 'Success',
                        water_devices: results
                    })
                })
            })
        })

    }
}

export default new WaterDevicesController();