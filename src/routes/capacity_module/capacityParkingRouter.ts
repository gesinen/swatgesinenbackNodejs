import { Router, Request, Response } from "express";
import capacityParkingController from "../../controllers/capacity_module/capacityParking";

class CapacityParkingRouter {
  public router: Router = Router();

  constructor() {
    this.getParkingById();
    this.getParkingList();
    this.createParking();
    this.deleteParking();
    this.updateParkingCapacity();
    this.updateCapacityParkingAction();//this.updateCapacityDeviceAction();
    this.updateParkingActualCapacity();
    this.getParkingSensors();
    this.getParkingUserByGateway();
    this.getParkingMessages();
    this.updateParkingLimitMinMaxCapacity();

    //for Mobile Application
    this.getParkingByIdUsingAuthToken();
    this.getParkingListUsingAuthToken();
    this.updateParkingCapacityByAuthToken();
  }

  /**
   * Create capacity device
   * POST ('/')
   */
  public createParking = () =>
    this.router.post("/", (req: Request, res: Response) => {
      const params = req.body;

      capacityParkingController
        .createParking(
          params.name,
          params.description,
          params.currentCapacity,
          params.maxCapacity,
          params.limiteminimo,
          params.limitemaximo,
          params.type,
          params.address,
          params.userId,
          params.subArea
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
  public getParkingList = () =>
    this.router.get(
      "/:userId/:pageSize/:pageIndex",
      (req: Request, res: Response) => {
        capacityParkingController
          .getParkingList(
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

    public getParkingMessages = () =>
        this.router.get(
            "/messages/:parkingId/:pageSize/:pageIndex",
            (req: Request, res: Response) => {
                capacityParkingController
                    .getParkingMessages(
                        parseInt(req.params.parkingId),
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
  public getParkingById = () =>
    this.router.get("/:id", (req: Request, res: Response) => {
      capacityParkingController
        .getParking(parseInt(req.params.id))
        .then((response) => {
          res.send(response);
        })
        .catch((err) => {
          res.send(err);
        });
    });

    /**
   * Get a capacity device Parking List
   * GET 
   */
  public getParkingListUsingAuthToken = () =>
  this.router.get(
    "/byAuth/list/:pageSize/:pageIndex",
    (req: Request, res: Response) => {
      capacityParkingController
        .getParkingListByAuthToken(
          parseInt(req.params.pageSize),
          parseInt(req.params.pageIndex),
          req.headers.authorization,
          req.headers.provider
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
   * Get a capacity device with an ID Using Auth Token for Mobile Application
   * GET ('/:id')
   */
  public getParkingByIdUsingAuthToken = () =>
  this.router.get("/byAuth/:id", (req: Request, res: Response) => {
    capacityParkingController
      .getParkingByAuthToken(parseInt(req.params.id),req.headers.authorization,req.headers.provider)
      .then((response) => {
        res.send(response);
      })
      .catch((err) => {
        res.send(err);
      });
  });

  /**
   * Update a capacity device for mobile Application 
   * PUT ('/:id')
   */
   public updateParkingCapacityByAuthToken = () =>
   this.router.put("/byAuth/:id", (req: Request, res: Response) => {
     const id = parseInt(req.params.id);
     const params = req.body;

     capacityParkingController
       .updateParkingCapacityByAuthToken(id, req.headers.authorization,req.headers.provider, params.currentCapacity, params.maxCapacity)
       .then((response) => {
         res.send(response);
       })
       .catch((err) => {
         res.send(err);
       });
   });

  public deleteParking = () =>
    this.router.delete("/:id", (req: Request, res: Response) => {
      capacityParkingController
        .deleteCapacityParking(parseInt(req.params.id))
        .then((response) => {
          res.send(response);
        })
        .catch((err) => {
          res.send(err);
        });
    });

  /**
   * Update a capacity parking limit max min for parking area loop
   * PUT ('/:id')
   */
  public updateParkingLimitMinMaxCapacity = () =>
    this.router.put("/spacesLimitMinMax/:id", (req: Request, res: Response) => {
      const id = parseInt(req.params.id);
      const params = req.body;

      capacityParkingController
        .updateParkingCapacityLimitMinMax(id, params.limitminimo, params.limitmaximo,params.mode)
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
  public updateParkingCapacity = () =>
    this.router.put("/spaces/:id", (req: Request, res: Response) => {
      const id = parseInt(req.params.id);
      const params = req.body;

      capacityParkingController
        .updateParkingCapacity(id, params.currentCapacity, params.maxCapacity)
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
   public updateParkingActualCapacity = () =>
   this.router.put("/currentspaces/:id", (req: Request, res: Response) => {
     const id = parseInt(req.params.id);
     const params = req.body;

     capacityParkingController
       .updateParkingActualCapacity(id, params.currentCapacity)
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
  public updateCapacityParkingAction = () =>
    this.router.put("/:id", (req: Request, res: Response) => {
      const id = parseInt(req.params.id);
      const params = req.body;

      capacityParkingController
        .updateCapacityParking(
          id,
          params.name,
          params.description,
          params.currentCapacity,
          params.maxCapacity,
          params.limiteminimo,
          params.limitemaximo,
          params.type,
          params.address
        )
        .then((response) => {
          res.send(response);
        })
        .catch((err) => {
          res.send(err);
        });
    });

  public getParkingSensors = () =>
    this.router.get("/mqtt/:id", (req: Request, res: Response) => {
      const id = parseInt(req.params.id);

      capacityParkingController
        .getParkingSensors(id)
        .then((response) => {
          res.send(response);
        })
        .catch((err) => {
          res.send(err);
        });
    });

  public getParkingUserByGateway = () =>
      this.router.get("/gateway/:mac", (req: Request, res: Response) => {
          const mac = req.params.mac;

          capacityParkingController
              .getParkingUserByGateway(mac)
              .then((response) => {
                  res.send(response);
              })
              .catch((err) => {
                  res.send(err);
              })
      })
}

const capacityParkingRouter = new CapacityParkingRouter();
export default capacityParkingRouter.router;
