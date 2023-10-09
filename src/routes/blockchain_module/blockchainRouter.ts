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
          params.user_id
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

}

const blockchainRouter = new BlockchainRouter();
export default blockchainRouter.router;
