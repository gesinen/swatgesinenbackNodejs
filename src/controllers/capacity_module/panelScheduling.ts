import conn from "../../database";
import db from "../../database";
import { Utils } from "../../utils/Utils";
//import moment from "moment-timezone"


/*
 * /capacity/panelScheduling
 */
class PanelSchedulingController {

    public async createPanelScheduleAction(name: string, url: string, panelId: number, fromDate: string,endDate:string,fromTime:string, endTime:string, panelFixedtext: string, scheduleDay:string,userId: number,scrollable:number): Promise<object> {

        return new Promise((resolve: any, reject: any) => {

            db.getConnection((err: any, conn: any) => {
                if (err) {
                    reject({
                        http: 401,
                        status: 'Failed',
                        error: err
                    })
                }

                conn.query("INSERT INTO `panelschedules` (`panelId`, `panleUrl`, `panelName`, `fromDate`,`endDate`,`fromTime`,`endTime`, `panelFixedtext`,`scheduleDay`, `userId`,`scrollable`) VALUES ("+panelId+",'" + url + "', '" + name + "', '" + fromDate + "', '" + endDate + "', '" + fromTime + "', '" + endTime + "','" + panelFixedtext + "','" + scheduleDay + "'," + userId + ","+scrollable+");",
                    (error: any, results: any, fields: any) => {
                        conn.release()

                        if (error) {
                            reject({ error: error })
                        } else {
                            resolve({
                                http: 200,
                                status: 'Success',
                                response: "The capacity panel Schedule has been created succesfully"
                            })
                        }
                    }
                )
            })
        })
    } // createCapacityDevice ()

    public async getPanelScheduleListAction(userId: number, pageSize: number, pageIndex: number): Promise<any> {
        return new Promise((resolve, reject) => {
            const first_value = (pageSize * pageIndex) - pageSize;
            var query = "SELECT * FROM panelschedules WHERE userId = " + userId +
                " ORDER BY panelschedules.id DESC LIMIT " + first_value + ', ' + pageSize + ";"

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
                        panelSchedules: results
                    })
                })
            })
        })
    }

    public async getPanelScheduleByIdAction(id: number): Promise<any> {
        return new Promise((resolve, reject) => {
            var query = "SELECT * FROM panelschedules WHERE id = "+ id;

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
                        panelSchedule: results
                    })
                })
            })
        })
    }

    public async updatePanelScheduleByIdAction(
        id:number,
        name:string,
        url:string,
        panelId:number,
        fromDate:string,
        endDate:string,
        fromTime:string,
        endTime:string,
        panelFixedtext:string,
        scheduleDay:string,
        userId:number,
        scrollable:number): Promise<object> {

        return new Promise((resolve, reject) => {

            if (!name && !panelId && !panelFixedtext) {
                reject({
                    http: 406,
                    status: 'Failed',
                    error: "All fields are empty"
                })
            }

            var query = "UPDATE panelschedules SET"

            // Checking if each param is not empty and adding it to the query
            if (name) {
                query += " panelName = '" + name + "',"
            }
            if (url) {
                query += " panleUrl = '" + url + "',"
            }
            if (panelId) {
                query += " panelId = " + panelId + ","
            }
            if (fromDate) {
                query += " fromDate = '" + fromDate + "',"
            }
            if (endDate) {
                query += " endDate = '" + endDate + "',"
            }
            if (fromTime) {
                query += " fromTime = '" + fromTime + "',"
            }
            if (endTime) {
                query += " endTime = '" + endTime + "',"
            }
            if (panelFixedtext) {
                query += " panelFixedtext = '" + panelFixedtext + "',"
            }
            if (scheduleDay) {
                query += " scheduleDay = '" + scheduleDay + "',"
            }
            query += " scrollable = '" + scrollable + "',"

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
                            result: "There is no Panel Schedule with this ID",
                        })
                    } else {
                         
                        resolve({
                            http: 200,
                            status: 'Success',
                            result: "The Panel Schedule has been updated successfully"
                        })
                    }
                })
            })
        })
    }

    public async deletePanelScheduleByIdAction(id: number): Promise<object> {
        return new Promise((resolve, reject) => {
            db.getConnection((err: any, conn: any) => {
                conn.query("DELETE FROM panelschedules WHERE id = " + id, (err: any, results: any) => {
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
                            result:'Deleted The panel Schedule Record'
                        })
                    }
                })
            })
        })
    }


}

export default new PanelSchedulingController();