/***
 * Daniel Burruchaga
 * 29/06/2023
 */

export const queryUpdate = `
UPDATE alarms
SET name = ?, description = ?,isActive = ?, timeToConsiderDeactive = ?,
text = ?, email = ?, device = ?, updated_at = CURRENT_TIMESTAMP
WHERE id = ?;
`
export const queryGetAll = "SELECT * FROM alarms where user_creator = ? ;";
export const queryGetAllForAllUsers = "SELECT * FROM alarms;";
export const queryGetFromId = "SELECT * FROM alarms WHERE id = ? and user_creator = ?;";
export const queryDelete = "DELETE FROM alarms WHERE id = ? AND user_creator = ?; ";
export const queryCreate = `INSERT INTO alarms (id, name, description, isActive, timeToConsiderDeactive, text, email, device, user_creator) VALUES (UUID(), ?, ?, ?, ?, ?, ?, ?, ?);`;
export const queryCreateTable = `
CREATE TABLE IF NOT EXISTS alarms (
    id VARCHAR(36) NOT NULL,
    name VARCHAR(255) NOT NULL,
    description VARCHAR(255) NOT NULL,
    isActive BOOLEAN NOT NULL,
    timeToConsiderDeactive TIME NOT NULL,
    text VARCHAR(255) NOT NULL,
    email VARCHAR(511) NOT NULL,
    device JSON NOT NULL,
    user_creator INT NOT NULL,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (user_creator) REFERENCES users(id),
    PRIMARY KEY (id)
);`;
/***
 * shesh singh
 * 21/07/2023
 */

// notifications
export const queryUpdateAlarmNotificationStatus = `
UPDATE alarm_notifications
SET status = ? WHERE id = ?;
`
export const queryGetAllAlarmNotification = "SELECT alarms.name as AlarmName,alarms.description as AlarmDescription,alarms.device as AlarmDevice,alarms.email as AlarmEmail, alarm_notifications.* FROM alarm_notifications  INNER JOIN alarms ON alarms.id = alarm_notifications.alarm_id where user_id = ?  ORDER BY created_dt DESC";
export const queryGetAllNotificationCount = "select count(*) as total from alarm_notifications where user_id  = ?;";
export const queryGetFromIdAlarmNotification = "SELECT alarms.name as AlarmName,alarms.description as AlarmDescription,alarms.device as AlarmDevice,alarms.email as AlarmEmail, alarm_notifications.* FROM alarm_notifications  INNER JOIN alarms ON alarms.id = alarm_notifications.alarm_id WHERE id = ? and user_id = ?;";
export const queryDeleteAlarmNotification = `DELETE FROM alarm_notifications WHERE id = ? AND user_creator = ?; `;
export const queryCreateTableAlarmNotifications = `
    CREATE TABLE IF NOT EXISTS alarm_notifications (
          id varchar(36) NOT NULL,
        alarm_id varchar(36) NOT NULL,
        user_id int(11) NOT NULL, 
        gateway_mac varchar(64)  DEFAULT NULL,
        device_eui varchar(64)  DEFAULT NULL,
        sensor_id int(11) DEFAULT NULL,
        status varchar(64)  DEFAULT NULL,
        description varchar(255)  DEFAULT NULL,
        email varchar(255)  DEFAULT NULL,
        email_text varchar(255)  DEFAULT NULL,
        created_dt datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
        updated_dt datetime on update CURRENT_TIMESTAMP,
        foreign key (alarm_id) references alarms(id),
        PRIMARY KEY (id)   
        );`;
