import conn from "../../database";
import db from "../../database";
import { Utils } from "../../utils/Utils";
//import moment from "moment-timezone"


/*
 * /capacity/bigPanelFixed
 */
class BigPanelFixedTextController {

    public async createBigPanelFixedTextAction(bigPanelName: string, bigPanelUrl: string, panelText: string, fromDate: string,toDate:string,fromTime:string, toTime:string, scrollable:number, userId: number): Promise<object> {

        return new Promise((resolve: any, reject: any) => {

            db.getConnection((err: any, conn: any) => {
                if (err) {
                    reject({
                        http: 401,
                        status: 'Failed',
                        error: err
                    })
                }

                conn.query("INSERT INTO `capacity_panel_fixed_text` (`bigPanelUrl`, `panelText`, `fromDate`, `toDate`,`fromTime`,`toTime`,`bigPanelName`, `scrollable`,`userId`) VALUES ('"+bigPanelUrl+"','" + panelText + "', '" + fromDate + "', '" + toDate + "', '" + fromTime + "',  '" + toTime + "','" + bigPanelName + "'," + scrollable + ","+userId+");",
                    (error: any, results: any, fields: any) => {
                        conn.release()

                        if (error) {
                            reject({ error: error })
                        } else {
                            resolve({
                                http: 200,
                                status: 'Success',
                                response: "The capacity panel fixed text has been created succesfully"
                            })
                        }
                    }
                )
            })
        })
    } // createCapacityDevice ()

    public async getBigPanelFixedTextListAction(userId: number, pageSize: number, pageIndex: number): Promise<any> {
        return new Promise((resolve, reject) => {
            const first_value = (pageSize * pageIndex) - pageSize;
            var query = "SELECT * FROM capacity_panel_fixed_text WHERE userId = " + userId +
                " ORDER BY capacity_panel_fixed_text.id DESC LIMIT " + first_value + ', ' + pageSize + ";"

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
                        bigPanels: results
                    })
                })
            })
        })
    }

    public async getBigPanelFixedTextByIdAction(id: number): Promise<any> {
        return new Promise((resolve, reject) => {
            var query = "SELECT * FROM capacity_panel_fixed_text WHERE id = "+ id;

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
                        bigPanel: results
                    })
                })
            })
        })
    }

    public async updateBigPanelFixedTextByIdAction(
        id:number,
        bigPanelName: string,
        bigPanelUrl: string,
        panelText: string,
        fromDate: string,
        toDate:string,
        fromTime:string,
        toTime:string,
        scrollable:number,
        userId: number): Promise<object> {

        return new Promise((resolve, reject) => {

            if (!bigPanelUrl && !panelText) {
                reject({
                    http: 406,
                    status: 'Failed',
                    error: "All fields are empty"
                })
            }

            var query = "UPDATE capacity_panel_fixed_text SET"

            // Checking if each param is not empty and adding it to the query
            if (bigPanelName) {
                query += " bigPanelName = '" + bigPanelName + "',"
            }
            if (bigPanelUrl) {
                query += " bigPanelUrl = '" + bigPanelUrl + "',"
            }
            if (panelText) {
                query += " panelText = '" + panelText + "',"
            }
            if (fromDate) {
                query += " fromDate = '" + fromDate + "',"
            }
            if (toDate) {
                query += " toDate = '" + toDate + "',"
            }
            if (fromTime) {
                query += " fromTime = '" + fromTime + "',"
            }
            if (toTime) {
                query += " toTime = '" + toTime + "',"
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
                            result: "There is no big Panel fixed with this ID",
                        })
                    } else {
                         
                        resolve({
                            http: 200,
                            status: 'Success',
                            result: "The big Panel fixed text has been updated successfully"
                        })
                    }
                })
            })
        })
    }

    public async deleteBigPanelFixedTextIdAction(id: number): Promise<object> {
        return new Promise((resolve, reject) => {
            db.getConnection((err: any, conn: any) => {
                conn.query("DELETE FROM capacity_panel_fixed_text WHERE id = " + id, (err: any, results: any) => {
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

export default new BigPanelFixedTextController();