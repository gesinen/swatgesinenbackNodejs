// Model

// Model
/*class SensorValue {
  id: number;
  sensorName: Text;
  value:number;
  created_at: any;
  // timestamp received in the message 
  received_at: any;
  device_id: number;
  sensor_id: number;
  user_id: number;
  
  constructor(id: number = 0, sensorName: Text,value: number, created_at: any, received_at:any,device_id:number,sensor_id : number, user_id: number) {
    this.id = id;
    this.sensorName = sensorName;
    this.created_at = created_at;
    this.received_at = received_at;
    this.value = value;
    this.device_id = device_id;
    this.sensor_id = sensor_id;
    this.user_id = user_id;
  }
}*/
class SensorValue {
    id: number;
    sensorName: string;
    value:number;
    created_at: any;
    // timestamp received in the message 
    received_at: any;
    device_id: number;
    sensor_id: number;
    user_id: number;
    
    constructor(id: number = 0, sensorName: string,value: number, created_at: any, received_at:any,device_id:number,sensor_id : number, user_id: number) {
      this.id = id;
      this.sensorName = sensorName;
      this.created_at = created_at;
      this.received_at = received_at;
      this.value = value;
      this.device_id = device_id;
      this.sensor_id = sensor_id;
      this.user_id = user_id;
    }
  }
  export default SensorValue;