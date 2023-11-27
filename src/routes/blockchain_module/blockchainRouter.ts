import { Router, Request, Response } from "express";
import blockchainController from "../../controllers/blockchaim_module/blockchainController";

class BlockchainRouter {
  public router: Router = Router();

  constructor() {
    this.createAutomaticGeneratorAction();
    this.updateAutomaticGeneratorAction(); 
    this.getAllAutomaticGeneratorListForPDFGenerationAction();
    this.getAutomaticGeneratorByIdAction();
    this.getHashDetailAction();
    this.deleteAtomaticGeneratorAction();
    this.getAllAutomaticGeneratorAction();
    this.deletePDFHistoryAction();
    this.getAllPDFHistoryAction(); 
    this.getTheRealBalaceFromDirectAPIAction(); 
    // All the routes for event_up postgres
    // get the all devices by application_name
    this.getAllDeviceFromEventAction();
    // get the all device types
    this.getAllDeviceTypeFromEventAction();
    // get all the objects of device by device type
    this.getAllDeviceObjectByTypeFromEventAction();

    this.getDeviceObjectByDeviceNameLastValueFromEventAction();
    this.getDeviceObjectByDeviceNamePeriodicValueFromEventAction();

    this.findtheAssetswitheFilenameAndHashAction();

    // these are change in config.json
    this.readInfoFromFileAction();
    this.WriteInfoToFileAction();

    // these are change and read from production.json
    this.readInfoFromProdFileAction();
    this.WriteInfoToProdFileAction();

    // this is method to command stop docker container and remove image, remove container, build new, run again hash-nft
    this.dockerImageAppStopAndStart();

  }

  public createAutomaticGeneratorAction = () =>
    this.router.post("/", (req: Request, res: Response) => {
      const params = req.body;
      console.log("params of blockchain", params)
      blockchainController.createAutomaticGenerator(
          params.name,
          params.description,
          params.startingdate,
          params.periodicity,
          params.status,
          params.valuetype,
          params.devices,
          params.user_id,
          params.device_type,
          params.objects_name
        )
        .then((response) => {
          res.send(response);
        })
        .catch((err) => {
          res.send(err);
        });
    });

    public getAllAutomaticGeneratorAction = () =>
    this.router.get("/:userId/:pageSize/:pageIndex", (req: Request, res: Response) => {
      blockchainController.getAllAutomaticGenerator(parseInt(req.params.userId),
      parseInt(req.params.pageSize),
      parseInt(req.params.pageIndex))
        .then((r: any) => {
          res.send(r);
        })
        .catch((err: any) => {
          res.send(err);
        });
    });

    public getAllAutomaticGeneratorListForPDFGenerationAction = () =>
    this.router.get("/pdfgeneration", (req: Request, res: Response) => {
      blockchainController.getAllAutomaticGeneratorListForPDFGeneration()
        .then((r: any) => {
          res.send(r);
        })
        .catch((err: any) => {
          res.send(err);
        });
    });

    /**
   * Get a automatic generator with an ID
   * GET ('/:id')
   */
  public getAutomaticGeneratorByIdAction = () =>
  this.router.get("/:userId/:id", (req: Request, res: Response) => {
    blockchainController
      .getAutomaticGeneratorById(parseInt(req.params.userId),parseInt(req.params.id))
      .then((response) => {
        res.send(response);
      })
      .catch((err) => {
        res.send(err);
      });
  });

  public deleteAtomaticGeneratorAction = () =>
    this.router.delete("/:userId/:id", (req: Request, res: Response) => {
      blockchainController
        .deleteAtomaticGenerator(parseInt(req.params.userId),parseInt(req.params.id))
        .then((response) => {
          res.send(response);
        })
        .catch((err) => {
          res.send(err);
        });
    });

    /**
   * Update a AutomaticGenerator
   * PUT ('/:id')
   */
  public updateAutomaticGeneratorAction = () =>
  this.router.put("/spaces/:id", (req: Request, res: Response) => {
    const id = parseInt(req.params.id);
    const params = req.body;

    blockchainController
      .updateAutomaticGenerator(id, params.currentCapacity, params.maxCapacity)
      .then((response) => {
        res.send(response);
      })
      .catch((err) => {
        res.send(err);
      });
  });

  /**
   * Get a automatic generator with an ID
   * GET ('/:hash')
   */
  public getHashDetailAction = () =>
  this.router.get("/checkHash/:userId/:hash", (req: Request, res: Response) => {
    blockchainController
      .getHashDetail(parseInt(req.params.userId),req.params.hash)
      .then((response) => {
        res.send(response);
      })
      .catch((err) => {
        res.send(err);
      });
  });

  getTheRealBalaceFromDirectAPIAction = () =>
  this.router.get("/accountbalance", (req: Request, res: Response) => {
    blockchainController
      .getTheRealBalaceFromDirectAPI()
      .then((response) => {
        console.log('router',response)
        res.send(response);
      })
      .catch((err) => {
        res.send(err);
      });
  });


  public getAllPDFHistoryAction = () =>
  this.router.get("/pdfhistory/:userId/:pageSize/:pageIndex", (req: Request, res: Response) => {
    blockchainController.getAllPDFHistory(parseInt(req.params.userId),
    parseInt(req.params.pageSize),
    parseInt(req.params.pageIndex))
      .then((r: any) => {
        res.send(r);
      })
      .catch((err: any) => {
        res.send(err);
      });
  }); 

  public deletePDFHistoryAction = () =>
    this.router.delete("/delpdfhistory/:userId/:id", (req: Request, res: Response) => {
      blockchainController
        .deletePDFHistory(parseInt(req.params.userId),parseInt(req.params.id))
        .then((response) => {
          res.send(response);
        })
        .catch((err) => {
          res.send(err);
        });
    });

    public getAllDeviceFromEventAction = () =>
    this.router.post("/pgEventAll", (req: Request, res: Response) => {
      const params = req.body;
      
      blockchainController.getAllDeviceFromEvent(params.application_name)
        .then((r: any) => {
          //console.log('R',r);
          res.send(r);
        })
        .catch((err: any) => {
          res.send(err);
        });
    });

    public getAllDeviceTypeFromEventAction = () =>
    this.router.get("/pgDeviceTypeEventAll", (req: Request, res: Response) => {
      blockchainController.getAllDeviceTypeFromEvent()
        .then((r: any) => {
          //console.log('R',r);
          res.send(r);
        })
        .catch((err: any) => {
          res.send(err);
        });
    });

    

    public getAllDeviceObjectByTypeFromEventAction = () =>
    this.router.post("/pgDeviceObjectsByTypeEventAll", (req: Request, res: Response) => {
      const params = req.body;
      blockchainController.getAllDeviceObjectByTypeFromEvent(params.application_name)
        .then((r: any) => {
          //console.log('R',r);
          res.send(r);
        })
        .catch((err: any) => {
          res.send(err);
        });
    });

    public getDeviceObjectByDeviceNameLastValueFromEventAction= () =>
    this.router.post("/pgDeviceObjectsByNameLastValueEventup", (req: Request, res: Response) => {
      const params = req.body;
      blockchainController.getDeviceObjectByDeviceNameLastValueFromEvent(params.device_name)
        .then((r: any) => {
          //console.log('R',r);
          res.send(r);
        })
        .catch((err: any) => {
          res.send(err);
        });
    });

    public getDeviceObjectByDeviceNamePeriodicValueFromEventAction= () =>
    this.router.post("/pgDeviceObjectsByNamePeriodValueEventup", (req: Request, res: Response) => {
      const params = req.body;
      blockchainController.getDeviceObjectByDeviceNamePeriodicValueFromEvent(params.device_name,params.start_time,params.end_time)
        .then((r: any) => {
          //console.log('R',r);
          res.send(r);
        })
        .catch((err: any) => {
          res.send(err);
        });
    });

    public findtheAssetswitheFilenameAndHashAction= () =>
    this.router.post("/findtheAssetOnBlockchain", (req: Request, res: Response) => {
      const params = req.body;
      blockchainController.findtheAssetswitheFilenameAndHash(params.fileName,params.hash)
        .then((r: any) => {
          //console.log('R',r);
          res.send(r);
        })
        .catch((err: any) => {
          res.send(err);
        });
    });
    
    // this is only for production file to read the info 
    public readInfoFromProdFileAction= () =>
    this.router.post("/readfromprodfile", (req: Request, res: Response) => {
      const params = req.body;
      blockchainController.readInfoFromProdFile(params.fileName)
        .then((r: any) => {
          
          res.send(r);
        })
        .catch((err: any) => {
          res.send(err);
        });
    });

    // this is only for production file to update the info but the value 

    public WriteInfoToProdFileAction= () =>
    this.router.post("/writetoprodfile", (req: Request, res: Response) => {
      const params = req.body;
      blockchainController.WriteInfoToProdFile(params.fileName,params.token,params.mnemonic,params.networkvalue)
        .then((r: any) => {
          //console.log('R',r);
          res.send(r);
        })
        .catch((err: any) => {
          res.send(err);
        });
    });

    public readInfoFromFileAction= () =>
    this.router.post("/readfromfile", (req: Request, res: Response) => {
      const params = req.body;
      blockchainController.readInfoFromFile(params.fileName)
        .then((r: any) => {
          
          res.send(r);
        })
        .catch((err: any) => {
          res.send(err);
        });
    });

    public WriteInfoToFileAction= () =>
    this.router.post("/writetofile", (req: Request, res: Response) => {
      const params = req.body;
      blockchainController.WriteInfoToFile(params.fileName,params.token,params.mnemonic,params.networkvalue)
        .then((r: any) => {
          //console.log('R',r);
          res.send(r);
        })
        .catch((err: any) => {
          res.send(err);
        });
    });

    public dockerImageAppStopAndStart= () =>
    this.router.post("/dockerRestartProcess", (req: Request, res: Response) => {
      const params = req.body;
      blockchainController.dockerRestartProcess()
        .then((r: any) => {
          //console.log('R',r);
          res.send(r);
        })
        .catch((err: any) => {
          res.send(err);
        });
    });

}

const blockchainRouter = new BlockchainRouter();
export default blockchainRouter.router;
