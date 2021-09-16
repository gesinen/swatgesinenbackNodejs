import { Request, Response } from 'express';
import db from '../database';

class ExampleController {
    
    public getDeviceById( req: Request, res: Response) {
        res.send({
            response: req.params.id
        })
    }


}

export const exampleController = new ExampleController();