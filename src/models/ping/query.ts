/***
 * Daniel Burruchaga
 * 23/05/2023
 */


export const queryGetAllGateway = "SELECT * FROM gateway_ping;";
export const queryGetAllDevice = "SELECT * FROM sensor_ping;";
export const queryGetFromIdGateway = "SELECT * FROM gateway_ping WHERE id = ?;";
export const queryGetFromIdDevice = "SELECT * FROM sensor_ping WHERE id = ?;";

export const queryGetSensorLastSeenByDeveui = "SELECT * FROM sensor_ping WHERE device_EUI = ?;";
export const queryGetGatewayLastSeenByMac = "SELECT * FROM gateway_ping WHERE mac_number = ?;";
