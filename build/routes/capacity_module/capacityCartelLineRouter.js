"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const capacityCartelLine_1 = __importDefault(require("../../controllers/capacity_module/capacityCartelLine"));
class CapacityCartelLineRouter {
    constructor() {
        this.router = (0, express_1.Router)();
        /**
         * Create capacity device
         * POST ('/')
         */
        this.createCartelLine = () => this.router.post("/", (req, res) => {
            const params = req.body;
            capacityCartelLine_1.default
                .createCartelLine(parseInt(params.sensor_id), parseInt(params.user_id), parseInt(params.max_capacity))
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
        this.getCartelLines = () => this.router.get("/:cartelId", (req, res) => {
            capacityCartelLine_1.default
                .getCartelLines(parseInt(req.params.cartelId))
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
           *
          public getFreeCartelLines = () => this.router.get('/:id', (req: Request, res: Response) => {
              capacityCartelLineController.getFreeCartelLines(parseInt(req.params.id))
                  .then(response => {
                      res.send(response)
                  })
                  .catch(err => {
                      res.send({
                          http: 401,
                          status: 'Failed',
                          error: err
                      })
                      res.send(err)
                  })
          })*/
        this.deleteCartelLine = () => this.router.delete("/:id", (req, res) => {
            capacityCartelLine_1.default
                .deleteCapacityCartelLine(parseInt(req.params.id))
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
        this.updateCapacityDeviceAction = () => this.router.put("/:id", (req, res) => {
            const id = parseInt(req.params.id);
            const params = req.body;
            capacityCartelLine_1.default
                .updateCartelLine(params.cartelId, params.parkingId, params.lineNum)
                .then((response) => {
                res.send(response);
            })
                .catch((err) => {
                res.send(err);
            });
        });
        this.getCartelLines();
        this.createCartelLine();
        this.deleteCartelLine();
        this.updateCapacityDeviceAction();
    }
}
const capacityCartelLineRouter = new CapacityCartelLineRouter();
exports.default = capacityCartelLineRouter.router;
