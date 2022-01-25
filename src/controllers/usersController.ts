import db from "../database";

/*
 * /users
 */
class UsersController {
    /**
     * GET ('/information/:id')
     * Getting the information about the user
     * 
     * @async
     * @param id - The user Id
     * 
     * @return 
     */
    public async getUserInformation (id:number): Promise<object> {
        
        return new Promise ((resolve:any, reject:any) => {
            
            db.getConnection((err:any, conn:any) => {
                
                let query = "SELECT id, email, user_name, first_name, last_name, phone, address, city, state, country FROM users WHERE id = " + id;
                
                conn.query(query, (error:any, results:any) => {
                    conn.release()

                    if (error) {
                        reject({
                            http: 406,
                            status: 'Failed',
                            error: error
                        })
                    }

                    if (results.length == 0) {
                        resolve({
                            http: 204,
                            status: 'Success',
                            result: 'There are no users with this ID',
                            user_data: {} 
                        })
                    }

                    resolve({
                        http: 200,
                        status: 'Success',
                        user_data: results[0] 
                    })
                })
            })
        })
    }

    /**
     * POST ('/login')
     * Getting the information about the user
     * 
     * @async
     * @param id - The user Id
     * 
     * @return 
     */
     public async getUserLogin (mail:string, pass:string): Promise<object> {
        
        return new Promise ((resolve:any, reject:any) => {
            
            db.getConnection((err:any, conn:any) => {
                
                let query = "SELECT * FROM users WHERE email = '" + mail + "' AND pwd = '" + pass + "'";
                console.log('QUERY', query);
                
                conn.query(query, (error:any, results:any) => {
                    conn.release()

                    if (error) {
                        reject({
                            http: 406,
                            status: 'Failed',
                            error: error
                        })
                    }

                    if (results == undefined || results.length == 0) {
                        resolve({
                            http: 204,
                            status: 'Success',
                            result: 'There are no users with this ID',
                            user_data: {} 
                        })
                    }

                    resolve({
                        http: 200,
                        status: 'Success',
                        user_data: results[0] 
                    })
                })
            })
        })
    }
}

export default new UsersController();