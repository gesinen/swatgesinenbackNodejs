import { Router, Request, Response } from "express";
import capacityCartelController from "../../controllers/capacity_module/capacityCartel";

class CapacityCartelRouter {
  public router: Router = Router();

  constructor() {
    this.getCartel();
    this.getCartelById();
    this.createCartel();
    this.deleteCartel();
    this.updateCartel();
  }

  /**
   * Create capacity device
   * POST ('/')
   */
  public createCartel = () =>
    this.router.post("/", (req: Request, res: Response) => {
      const params = req.body;
      console.log("createCartelParams", params);
      capacityCartelController
        .createCapacityCartel(
          parseInt(params.sensorId),
          params.name,
          params.description,
          params.latitude,
          params.longitude,
          parseInt(params.userId),
          params.cartelLines
        )
        .then((response) => {
          res.send(response);
        })
        .catch((err) => {
          res.send(err);
        });
    });

  /**
   * Get a capacity device with an ID
   * GET ('/:id')
   */
  public getCartel = () =>
    this.router.get(
      "/:userId/:pageSize/:pageIndex",
      (req: Request, res: Response) => {
        capacityCartelController
          .getCapacityCartelList(
            parseInt(req.params.userId),
            parseInt(req.params.pageSize),
            parseInt(req.params.pageIndex)
          )
          .then((response) => {
            res.send(response);
          })
          .catch((err) => {
            res.send(err);
          });
      }
    );

  /**
   * Get a capacity device with an ID
   * GET ('/:id')
   */
  public getCartelById = () =>
    this.router.get("/:id", (req: Request, res: Response) => {
      capacityCartelController
        .getCartelById(parseInt(req.params.id))
        .then((response) => {
          res.send(response);
        })
        .catch((err) => {
          res.send(err);
        });
    });

  public deleteCartel = () =>
    this.router.delete("/:id", (req: Request, res: Response) => {
      capacityCartelController
        .deleteCapacityCartel(parseInt(req.params.id))
        .then((response) => {
          res.send(response);
        })
        .catch((err) => {
          res.send(err);
        });
    });

  /**
   * Update a capacity device
   * PUT ('/:id')
   */
  public updateCartel = () =>
    this.router.put("/:id", (req: Request, res: Response) => {
      const id = parseInt(req.params.id);
      const params = req.body;

      capacityCartelController
        .updateCapacityCartel(
          id,
          params.cartelLines,
          params.name,
          params.description,
          parseInt(params.sensorId),
          params.latitude,
          params.longitude,
          params.authToken,
          params.provider
        )
        .then((response) => {
          res.send(response);
        })
        .catch((err) => {
          res.send(err);
        });
    });
}

const capacityCartelRouter = new CapacityCartelRouter();
export default capacityCartelRouter.router;
