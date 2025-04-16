import { Router, Request, Response } from "express";
import PanelSchedulingController from "../../controllers/capacity_module/panelScheduling";
class PanelSchedulingRouter {
    public router: Router = Router();
  
    constructor() {
      
      
      this.createPanelSchedule();
      this.getPanelScheduleList();
      this.getPanelScheduleById();
      this.updatePanelScheduleById();
      this.deletePanelScheduleById();
    }

    /**
       * Create capacity device
       * POST ('/')
       */
      public createPanelSchedule = () =>
        this.router.post("/", (req: Request, res: Response) => {
          const params = req.body;
    
          PanelSchedulingController
            .createPanelScheduleAction(
              params.name,
              params.url,
              params.panelId,
              params.fromDate,
              params.endDate,
              params.fromTime,
              params.endTime,
              params.panelFixedtext,
              params.scheduleDay,
              params.userId,
              params.scrollable
            )
            .then((response) => {
              res.send(response);
            })
            .catch((err) => {
              res.send(err);
            });
        });

        /**
           * Get a panel schedule List
           * GET ('/:userId/:pageSize/:pageIndex')
           */
          public getPanelScheduleList = () =>
            this.router.get(
             "/:userId/:pageSize/:pageIndex",
              (req: Request, res: Response) => {
                PanelSchedulingController
                  .getPanelScheduleListAction(
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
              public getPanelScheduleById = () =>
                this.router.get("/:id", (req: Request, res: Response) => {
                    PanelSchedulingController
                    .getPanelScheduleByIdAction(parseInt(req.params.id))
                    .then((response) => {
                      res.send(response);
                    })
                    .catch((err) => {
                      res.send(err);
                    });
                });

    /**
       * Update a panel schedule
       * PUT ('/:id')
       */
      public updatePanelScheduleById = () =>
        this.router.put("/:id", (req: Request, res: Response) => {
          const id = parseInt(req.params.id);
          const params = req.body;
          PanelSchedulingController
            .updatePanelScheduleByIdAction(
              id,
              params.name,
              params.url,
              params.panelId,
              params.fromDate,
              params.endDate,
              params.fromTime,
              params.endTime,
              params.panelFixedtext,
              params.scheduleDay,
              params.userId,
              params.scrollable
            )
            .then((response) => {
              res.send(response);
            })
            .catch((err) => {
              res.send(err);
            });
        });

        public deletePanelScheduleById = () =>
            this.router.delete("/:id", (req: Request, res: Response) => {
                PanelSchedulingController
                .deletePanelScheduleByIdAction(parseInt(req.params.id))
                .then((response) => {
                  res.send(response);
                })
                .catch((err) => {
                  res.send(err);
                });
            });
            
        
}
const panelSchedulingRouter = new PanelSchedulingRouter();
export default panelSchedulingRouter.router;