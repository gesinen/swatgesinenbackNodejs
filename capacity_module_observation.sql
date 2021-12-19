CREATE TABLE `capacity_module_observation` (
    `id` int(11) NOT NULL,
    `device_id` int(11) NOT NULL,
    `sensor_id` int(11) NOT NULL,
    `device_eui` int(11) NOT NULL,
    `observation_value` float NOT NULL,
    `message_timestamp` timestamp,
    `time` varchar(255),
    `user_id` int(11) NOT NULL
)