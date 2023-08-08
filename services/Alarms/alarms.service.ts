import Alarm from "../../src/models/Alarm/Alarm.model";
import cron from "node-cron";
import EmailSender from "../../src/utils/SMTP/EmailSender"//"../../utils/SMTP/EmailSender";
import configSMTP from "../../src/utils/SMTP/ConfigSmtp";
import MailOptions from "../../src/utils/SMTP/MailOptions";
import Ping from "../../src/models/ping/Ping.model";
import { isForOfStatement } from "typescript";
import { Devices, StatusIndividual } from "../../src/models/Alarm/Status";

class AlarmChecker {
  configSmtp: configSMTP;
  schedulerAlarms: string;

  constructor() {
    this.configSmtp = new configSMTP(
      "smtp.1and1.es",
      465,
      true,
      "alarms@geswat.es",
      "Team@9765"
    );
    this.schedulerAlarms = "*/1 * * * *";
    console.log('alarm checker service running');
  }
  // Get the Alarm from DB
  async checkAlarms() {
    const alarms = await new Alarm().getAllForAllUsers();
    alarms.forEach((element) => {
      try {
        this.processAlarm(element);
      } catch (error) {
        console.log("[ERROR]: ", error);
      }
    });
  }

  // Process Alarm
  async processAlarm(element: Alarm) {
    console.log("ELEMENT: ", element);
    element.device = JSON.parse(String(element.device));
    let device:Devices ; 
    if (!element.timeToConsiderDeactive) {
      throw new Error("Cant found available timeToConsiderDeactive.");
    }
    // Process Gateways in this Alarm
    if (element.device && element.device.gateway.length > 0) {
      console.log("Gateway: ", element.device.gateway);

      element.device.gateway.forEach(
        async (gateway: { mac_number: string; status: string }) => {
          const ping: any = await new Ping(
            0,
            null,
            gateway.mac_number
          ).getByDeveuiOrMac();
          // console.log("LastSeen: ", ping);
          if (gateway.status == StatusIndividual.Ok || gateway.status == StatusIndividual.Notified)
            device.gateway +=  this.processIfSendEmail(element, ping.message_datetime, gateway);
        }
      );
    } else {
      console.log("No Gateways in this Alarm");
    }

    // Process Sensor in this Alarm
    if (element.device && element.device.gateway.length > 0) {
      console.log("Sensor: ", element.device.sensor);

      element.device.sensor.forEach(
        async (sensor: { deveui: string; status: string }) => {
          const ping: any = await new Ping(0, sensor.deveui).getByDeveuiOrMac();
          // console.log("LastSeen: ", ping);
          if (sensor.status == StatusIndividual.Ok || sensor.status == StatusIndividual.Notified)
            device.sensor += this.processIfSendEmail(element, ping.message_datetime, sensor);
        }
      );
    } else {
      console.log("No Sensors in this Alarm");
    }
  }


// Falta obtener 
  processIfSendEmail(element: Alarm, lastSeen: any, device: any) {
    console.log(lastSeen, element.timeToConsiderDeactive, Date.now());

    // IF Should send email -->
    if (this.checkTime(lastSeen, element.timeToConsiderDeactive)) {

      const client = new EmailSender(this.configSmtp);
      if (element.email) {
        const arrayEmails = element.email.replace("[", "").replace("]", "").split(",");

        console.log(arrayEmails);
        arrayEmails.forEach((email: string) => {
          console.log("Email To send: ", email);
          const msg = new MailOptions(
            "alarmasgeswat@gmail.com",
            email,
            `Alarm ${device.deveui ? ("Sensor: " + device.deveui) : ( "Gateway: " + device.mac_number)}`,
            element.text ? element.text : "Not text Provided",
            ""
          );
          // TODO: Descomentar
          // client.sendEmail(msg);
          device.status = StatusIndividual.Notified
        });
      } else {
        console.log("Not Email Provided");
      }
    } else {
      console.log("Not Alarm All right OK :)");
    }
    return device
  }

  startCronJob() {
    console.log("Schedule CheckAlarms : ", this.schedulerAlarms);
    cron.schedule(this.schedulerAlarms, () => {
      this.checkAlarms();
    });
  }

  checkTime(lastSeenDate: string, timeToConsiderDeactive?: string) {
    if (!timeToConsiderDeactive) return false;
    const lastSeen = new Date(lastSeenDate);
    // Convert to millis
    const [hours, minutes, seconds] = timeToConsiderDeactive.split(":");
    const timeToConsiderDeactiveMs =
      (Number(hours) * 3600 + Number(minutes) * 60 + Number(seconds)) * 1000;

    // Obtener la hora actual en milisegundos
    const currentTime = Date.now();

    // Sumar el valor de lastSeen en milisegundos con el valor de element.timeToConsiderDeactive en milisegundos
    const alarmTime = lastSeen.getTime() + timeToConsiderDeactiveMs;
    // Comparar el resultado de la suma con el valor de la hora actual
    if (alarmTime < currentTime) {
      console.log("The alarm should be activated.");
      return true;
    } else {
      console.log("The alarm shouldn't be activated.");
      return false;
    }
  }
}

export default AlarmChecker;
