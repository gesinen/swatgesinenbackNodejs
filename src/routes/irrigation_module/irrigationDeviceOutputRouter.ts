import { Router, Request, Response } from "express";
import irrigationController from "../../controllers/irrigation_module/irrigationDeviceController";
import irrigationDeviceOutputController from "../../controllers/irrigation_module/irrigationDeviceOutputController";

class IrrigationDeviceOutputRouter {
  public router: Router = Router();

  constructor() {
    this.getIrrigationOutputDeviceById();
    this.storeIrrigationOutputDevice();
    this.deleteIrrigationOutputDevice();
    this.updateIrrigationOutputDevice();
    this.updateValvesConfig();
    this.getIrrigationOutputDeviceIntervalById();

    //Added by shesh
    // create Valve config for milesight
    this.createIrrigationDeviceValveConfig();
    this.getIrrigationDeviceOutputInfoById();
    this.getValvesConfigByIrrigationDeviceId();
    this.deleteIrrigationSlotConfig();
    this.SyncValvePlanConfigfromDevice();
    this.getIrrigationDeviceschedulePlansUpdatedDirectlyFromDevice();
    this.UpdateIrrigationOutputValveStatusMode();
    this.getIrrigationOutputValveOnOffHistory();
  }

  /**
   * Get the user data
   * GET ('/information/:id')
   */
  public getIrrigationDeviceOutputInfoById = () =>
    this.router.get("/outputInfo/:id", (req: Request, res: Response) => {
      const id = parseInt(req.params.id);

      irrigationDeviceOutputController
        .getIrrigationDeviceOutputInfoByIdAction(id)
        .then((response: any) => {
          res.send(response);
        })
        .catch((err: any) => {
          res.send(err);
        });
    });

    /**
   * Get the user data
   * GET ('/information/:id')
   */
  public getIrrigationOutputValveOnOffHistory = () =>
  this.router.get("/history/OnOff/:irrigationDeviceId/:valve/:fromDate/:toDate", (req: Request, res: Response) => {
    const irrigationDeviceId = parseInt(req.params.irrigationDeviceId);
    const valve = parseInt(req.params.valve);
    const fromDate = req.params.fromDate;
    const toDate = req.params.toDate;
    irrigationDeviceOutputController
      .getIrrigationOutputValveOnOffHistoryAction(irrigationDeviceId,valve,fromDate,toDate)
      .then((response: any) => {
        res.send(response);
      })
      .catch((err: any) => {
        res.send(err);
      });
  });

  /**
   * Get the user data
   * GET ('/information/:id')
   */
  public getIrrigationOutputDeviceById = () =>
    this.router.get("/:id", (req: Request, res: Response) => {
      const id = parseInt(req.params.id);

      irrigationDeviceOutputController
        .getOutputByIrrigationDeviceId(id)
        .then((response: any) => {
          res.send(response);
        })
        .catch((err: any) => {
          res.send(err);
        });
    });

  /**
   * Get the user data
   * GET ('/information/:id')
   */
  public getIrrigationOutputDeviceIntervalById = () =>
    this.router.get("/intervals/:id", (req: Request, res: Response) => {
      const id = parseInt(req.params.id);

      irrigationDeviceOutputController
        .getIrrigationOutputDeviceIntervalById(id)
        .then((response) => {
          res.send(response);
        })
        .catch((err) => {
          res.send(err);
        });
    });

  /**
   * Get the user data
   * GET ('/information/:id')
   */
  public getByIrrigationDeviceIdAndIndex = () =>
    this.router.get("/:id/:index", (req: Request, res: Response) => {
      const id = parseInt(req.params.id);
      const index = parseInt(req.params.index);

      irrigationDeviceOutputController
        .getByIrrigationDeviceIdAndIndex(id, index)
        .then((response) => {
          res.send(response);
        })
        .catch((err) => {
          res.send(err);
        });
    });

  /**
   * Get user related municipality_id
   * GET ('/municipality/{user_id}')
   * params user_id -> id of the user we want to get the municipality_id from
   */
  public storeIrrigationOutputDevice = () =>
    this.router.post("/", (req: Request, res: Response) => {
      const params = req.body;
      console.log("router store params");
      console.log(params);
      irrigationDeviceOutputController
        .storeIrrigationOutputDevice(
          params.irrigationDeviceId,
          params.sensorId,
          params.sensorIndex,
          params.intervals,
          params.status,
          params.name,
          params.sensorIdInput,
          params.description,
          params.deviceTypeId
        )
        .then((response: any) => {
          res.send(response);
        })
        .catch((err: any) => {
          res.send(err);
        });
    });

  /**
   * Get user related municipality_id
   * GET ('/municipality/{user_id}')
   * params user_id -> id of the user we want to get the municipality_id from
   */
  public deleteIrrigationOutputDevice = () =>
    this.router.delete("/:id", (req: Request, res: Response) => {
      const id = parseInt(req.params.id);

      irrigationDeviceOutputController
        .deleteIrrigationOutputDevice(id)
        .then((response: any) => {
          res.send(response);
        })
        .catch((err: any) => {
          res.send(err);
        });
    });

  /**
   * Get user related municipality_id
   * POST ('/municipality/{user_id}')
   * params user_id -> id of the user we want to get the municipality_id from
   */
  public updateValvesConfig = () =>
    this.router.post("/config/valves", async (req: Request, res: Response) => {
      try {
        const params = req.body;
        console.log(params);
        let acumRes: number = 0;
        for (let i = 0; i < params.valves.length; i++) {
          let res: any =
            await irrigationDeviceOutputController.updateIrrigationOutputDeviceInterval(
              params.body.data.id,
              params.valves[i],
              params.valvesIndex[i]
            );
          if (res.http == 200) {
            acumRes++;
          }
          console.log("res", res);
        }
        if (params.valves.length == acumRes) {
          res.send({
            http: 200,
            status: "Success",
            result: "Irrigation device valve intervals updated succesfully",
          });
        } else {
          res.send({
            http: 204,
            status: "Success",
            result: "Irrigation device valve intervals couldnt be updated",
          });
        }
      } catch (error) {
        res.send(error);
      }
    });


  /**
   * Get user related municipality_id
   * GET ('/municipality/{user_id}')
   * params user_id -> id of the user we want to get the municipality_id from
   */
  public updateIrrigationOutputDevice = () =>
    this.router.put("/", (req: Request, res: Response) => {
      console.log("*** updateIrrigationOutputDevice ***", "update");
      const params = req.body;
      console.log(params);
      irrigationDeviceOutputController
        .updateIrrigationOutputDevice(
          params.irrigationDeviceId,
          params.sensorId,
          params.index,
          params.name,
          params.inputSensorId,
          params.description,
          params.deviceTypeId
        )
        .then((response: any) => {
          res.send(response);
        })
        .catch((err: any) => {
          res.send(err);
        });
    });

    /**
   * post valve config irrigation device output valve milesight
   * POST ('/createconfig/{valves}')
   */
  public createIrrigationDeviceValveConfig = () =>
  this.router.post("/createconfig/valves", async (req: Request, res: Response) => {
    try {
      const params = req.body;
      console.log('params',params);
      
      let acumRes: number = 0;
      
      for(let j = 0 ;j<params.length;j++){ 
        let res: any;
        if(params[j].id != null){
         res =
            await irrigationDeviceOutputController.updateIrrigationDeviceValveConfigSlotAction(
              params[j].id,params[j]);
        }
        else{            
           res = await irrigationDeviceOutputController.createIrrigationDeviceValveConfigAction(params[j]);
        }
          if (res.http == 200) {
            acumRes++;
          }
          console.log("res", res);
      } 
        
      
      
      if (params.length == acumRes) {
        res.send({
          http: 200,
          status: "Success",
          result: "Irrigation device valve intervals updated succesfully",
        });
      } else {
        res.send({
          http: 204,
          status: "Success",
          result: "Irrigation device valve intervals couldnt be updated",
        });
      }
    } catch (error) {
      res.send(error);
    }
  });

   /**
   * Get user related municipality_id
   * POST ('/municipality/{user_id}')
   * params user_id -> id of the user we want to get the municipality_id from
   */
   public getValvesConfigByIrrigationDeviceId = () =>
   this.router.get("/configSolts/valves/:id", async (req: Request, res: Response) => {
     
      const id = parseInt(req.params.id);
       
         irrigationDeviceOutputController
         .getValvesConfigByIrrigationDeviceIdAction(id)
         .then((response: any) => {
          res.send(response);
        })
        .catch((err: any) => {
          res.send(err);
        });
    });   

   /**
   * Get config plans from device directly updated
   * POST ('/municipality/{user_id}')
   * params user_id -> id of the user we want to get the municipality_id from
   */
   public getIrrigationDeviceschedulePlansUpdatedDirectlyFromDevice = () =>
   this.router.get("/configSolts/plans/:id", async (req: Request, res: Response) => {
     
      const id = parseInt(req.params.id);
       
         irrigationDeviceOutputController
         .getIrrigationDeviceschedulePlansUpdatedDirectlyFromDeviceAction(id)
         .then((response: any) => {
          res.send(response);
        })
        .catch((err: any) => {
          res.send(err);
        });
    });
   
    /**
   * Get config plans from device directly updated
   * POST ('/municipality/{user_id}')
   * params user_id -> id of the user we want to get the municipality_id from
   */
   public SyncValvePlanConfigfromDevice = () =>
   this.router.post("/configSolts/syncPlan", async (req: Request, res: Response) => {
     try{
      const params = req.body;
      let deviceId = params.irrigationoutputId;
      let slotNumber = params.slotNumber;
      let funres:any;
      let myres:any;
          myres =  await irrigationDeviceOutputController
         .SyncValvePlanConfigfromDeviceAction(deviceId,slotNumber);
         console.log('myres',myres);
        
        if(myres.opetation != 'INSERT')
        {
          console.log('update',myres.result[0].id);
          let id = myres.result[0].id;
          funres = await irrigationDeviceOutputController.updateIrrigationDeviceValveConfigSlotAction(id,params);
           // res.send();  
          }
           else{       
            console.log('inserting'); 
            funres = await irrigationDeviceOutputController.createIrrigationDeviceValveConfigAction(params);
           //res.send(); 
          }
          // console.log('res',res);
           //res.send();
           if(funres.http == 200){
           res.send({
            http: 200,
            status: "Success",
            result: "sync is done",
          });
        }
        else{
          res.send({
            http: 204,
            status: "Success",
            result: "No Action performed",
          });
        }
        
      }catch(error) {
          res.send(error);
          
        };
    });
   
    /**
   * Get user related municipality_id
   * GET ('/municipality/{user_id}')
   * params user_id -> id of the user we want to get the municipality_id from
   */
  public deleteIrrigationSlotConfig = () =>
  this.router.delete("/configslot/:id", (req: Request, res: Response) => {
    const id = parseInt(req.params.id);

    irrigationDeviceOutputController
      .deleteIrrigationSlotConfigAction(id)
      .then((response: any) => {
        res.send(response);
      })
      .catch((err: any) => {
        res.send(err);
      });
  });

  /**
   * Get user related municipality_id
   * GET ('/municipality/{user_id}')
   * params user_id -> id of the user we want to get the municipality_id from
   */
  public UpdateIrrigationOutputValveStatusMode = () =>
    this.router.put("/valveStatusMode/:id/:sensorIndex/:valveStatusMode", (req: Request, res: Response) => {
      console.log("*** updateIrrigationOutputDevice  status mode***", "update");
      const id = parseInt(req.params.id);
      const sensorIndex = parseInt(req.params.sensorIndex);
      const valvestatusMode = req.params.valveStatusMode;
      irrigationDeviceOutputController
        .UpdateIrrigationOutputValveStatusModeAction(
          id,
          sensorIndex,
          valvestatusMode
        )
        .then((response: any) => {
          res.send(response);
        })
        .catch((err: any) => {
          res.send(err);
        });
    });
   
}

const irrigationDeviceOutputRouter = new IrrigationDeviceOutputRouter();
export default irrigationDeviceOutputRouter.router;
