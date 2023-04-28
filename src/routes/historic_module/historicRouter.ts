import { Router, Request, Response } from "express";
import historicController from "../../controllers/historic_module/historicController";
import SensorValue from "../../models/Sensor_Historic";
import moment from 'moment';
// Router
class HistoricRouter {
  public router: Router = Router();

  constructor() {
    this.getHistoricInfoFromSpecificIdHistoric();
    this.getAllHistoricInfo();
    this.postCreateHistoric();
    this.putCreateHistoric();
    this.deleteHistoricFromSpecificIdHistoric();
    this.updateHistoricFromSpecificIdHistoric();
  }
  public getDataFromReq(req: any) {
    const array = req.body.sensors;
    // WaterExternal1,waterExternal2...
    let arrayWithSensors = [];

    for (let i = 0; i < array.length; i++) {
      const sensor = array[i];

      // S01 S02 ...
      let arrayWithValues = [];

      for (let d = 0; d < sensor.observations.length; d++) {
        const id = 0;
        const sensorName = sensor.sensor;
        const value = Number(sensor.observations[d].value);
        const received_at = sensor.observations[d].timestamp;
        const today = new Date();
        const created_at = today.toLocaleTimeString();
        console.log(created_at);

        const device_id = sensor.device_id;
        const sensor_id = sensor.sensor_id;
        const user_id = sensor.user_id;

        const valueSensor = new SensorValue(
          id,
          sensorName,
          value,
          created_at,
          received_at,
          device_id,
          sensor_id,
          user_id
        );
        console.log(valueSensor);
        arrayWithValues.push(valueSensor);
      }
      arrayWithSensors.push(arrayWithValues);
    }
    console.log("arrayWithSensors");
    console.log(arrayWithSensors);
    return arrayWithSensors;
  }

  public getDataFromReqNew(sensor:string,req: any) {
    const array = req.body.observations;
    // WaterExternal1,waterExternal2...
   
      let arrayWithValues = [];

      for (let d = 0; d < array.length; d++) {
        const id = 0;
        
        const value = Number(array[d].value);
        const received_at = moment(array[d].timestamp, 'DD/MM/YYYY hh:mm:ss').format('YYYY-MM-DD hh:mm:ss');
        const today = new Date();
        console.log('recieved date',array[d].timestamp,received_at);
        const created_at = today.toLocaleTimeString();
        console.log(created_at);
        const sensorName = sensor;
        const device_id = 1;
        const sensor_id = 1;
        const user_id = 1;

        const valueSensor = new SensorValue(
          id,
          sensorName,
          value,
          created_at,
          received_at,
          device_id,
          sensor_id,
          user_id
        );
        console.log(valueSensor);
        arrayWithValues.push(valueSensor);
      }
    return arrayWithValues;
  }

  /***/

  public getHistoricInfoFromSpecificIdHistoric = () =>
    this.router.get("/:id", (req: Request, res: Response) => {
      const id = req.params.id;

      historicController
        .getHistoricInfoFromSpecificId(Number(id))
        .then((r: any) => {
          res.send(r);
        })
        .catch((err: any) => {
          res.send(err);
        });
    });

  /***/

  public getAllHistoricInfo = () =>
    this.router.get("/", (req: Request, res: Response) => {
      historicController
        .getAllHistoric()
        .then((r: any) => {
          res.send(r);
        })
        .catch((err: any) => {
          res.send(err);
        });
    });

  /***/
  
  /*public postCreateHistoric = () => {
    this.router.post("/", (req: Request, res: Response) => {
      console.log("ARRIVED:");
      let sensorName = req.params.sensorname;
      historicController
        .createHistoric(this.getDataFromReq(req))
        .then((r: any) => {
          res.send(r);
        })
        .catch((err: any) => {
          res.send(err);
        });
    });
  };*/

  public postCreateHistoric = () => {
    this.router.post("/:provider/:sensorname", (req: Request, res: Response) => {
      console.log("ARRIVED:");
      let sensorName = req.params.sensorname;
      let provider = req.params.provider;
      historicController
        .createHistoric(this.getDataFromReqNew(sensorName,req))
        .then((r: any) => {
          res.send(r);
        })
        .catch((err: any) => {
          res.send(err);
        });
    });
  };

  public putCreateHistoric = () => {
    this.router.put("/:provider/:sensorname", (req: Request, res: Response) => {
      console.log("ARRIVED:");
      let sensorName = req.params.sensorname;
      let provider = req.params.provider;
      historicController
        .createHistoric(this.getDataFromReqNew(sensorName,req))
        .then((r: any) => {
          res.send(r);
        })
        .catch((err: any) => {
          res.send(err);
        });
    });
  };

  /***/

  public deleteHistoricFromSpecificIdHistoric = () => {
    this.router.delete("/:id", (req: Request, res: Response) => {
      historicController
        .deleteHistoric(Number(req.params.id))
        .then((r: any) => {
          res.send(r);
        })
        .catch((err: any) => {
          res.send(err);
        });
    });
  };

  /***/

  public updateHistoricFromSpecificIdHistoric = () =>
    this.router.delete("/:id", (req: Request, res: Response) => {
      // TODO: Arreglar iteracion [0] [0]
      const historicObj = this.getDataFromReq(req)[0][0];
      historicObj.id = Number(req.params.id);
      historicController
        .updateHistoric(historicObj)
        .then((r: any) => {
          res.send(r);
        })
        .catch((err: any) => {
          res.send(err);
        });
    });
}

const historicRoutes = new HistoricRouter();
export default historicRoutes.router;