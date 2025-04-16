import { Router, Request, Response } from "express";
import BigPanelFixedTextController from "../../controllers/capacity_module/bigPanelFixedText"
class BigPanelFixedTextRouter {
    public router: Router = Router();
  
    constructor() {
      
      
      this.createBigPanelFixedText();
      this.getBigPanelFixedTextList();
      this.getBigPanelFixedTextById();
      this.updateBigPanelFixedTextById();
      this.deleteBigPanelFixedTextId();
    }

    /**
       * Create capacity device
       * POST ('/')
       */
      public createBigPanelFixedText = () =>
        this.router.post("/", (req: Request, res: Response) => {
          const params = req.body;
    
          BigPanelFixedTextController
            .createBigPanelFixedTextAction(
              params.bigPanelName,
              params.bigPanelUrl,
              params.panelText,
              params.fromDate,
              params.toDate,
              params.fromTime,
              params.toTime,
              params.scrollable,
              params.userId
              
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
          public getBigPanelFixedTextList = () =>
            this.router.get(
             "/:userId/:pageSize/:pageIndex",
              (req: Request, res: Response) => {
                BigPanelFixedTextController
                  .getBigPanelFixedTextListAction(
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
              public getBigPanelFixedTextById = () =>
                this.router.get("/:id", (req: Request, res: Response) => {
                    BigPanelFixedTextController
                    .getBigPanelFixedTextByIdAction(parseInt(req.params.id))
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
      public updateBigPanelFixedTextById = () =>
        this.router.put("/:id", (req: Request, res: Response) => {
          const id = parseInt(req.params.id);
          const params = req.body;
          BigPanelFixedTextController
            .updateBigPanelFixedTextByIdAction(
              id,
              params.bigPanelName,
              params.bigPanelUrl,
              params.panelText,
              params.fromDate,
              params.toDate,
              params.fromTime,
              params.toTime,
              params.scrollable,
              params.userId
            )
            .then((response) => {
              res.send(response);
            })
            .catch((err) => {
              res.send(err);
            });
        });

        public deleteBigPanelFixedTextId = () =>
            this.router.delete("/:id", (req: Request, res: Response) => {
                BigPanelFixedTextController
                .deleteBigPanelFixedTextIdAction(parseInt(req.params.id))
                .then((response) => {
                  res.send(response);
                })
                .catch((err) => {
                  res.send(err);
                });
            });
            
        
}
const bigPanelFixedTextRouter = new BigPanelFixedTextRouter();
export default bigPanelFixedTextRouter.router;