import { Request, Response, NextFunction } from "express";
import { PendidikanService } from "../services/pendidikan.service";
//import { AppError } from '../middleware/errorHandler';

export class PendidikanController {
  private pendidikanService: PendidikanService;

  constructor() {
    this.pendidikanService = new PendidikanService();
  }

  getAll = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const examples = await this.pendidikanService.getAll();
      console.log(req);
      res.json({
        status: "success",
        data: examples,
      });
    } catch (error) {
      next(error);
    }
  };

  //   getById = async (req: Request, res: Response, next: NextFunction) => {
  //     try {
  //       const { id } = req.params;
  //       const example = await this.exampleService.getById(parseInt(id));

  //       if (!example) {
  //         throw new AppError('Example not found', 404);
  //       }

  //       res.json({
  //         status: 'success',
  //         data: example,
  //       });
  //     } catch (error) {
  //       next(error);
  //     }
  //   };

  create = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const example = await this.pendidikanService.create(req.body);
      res.status(201).json({
        status: "success",
        data: example,
      });
    } catch (error) {
      next(error);
    }
  };

  //   update = async (req: Request, res: Response, next: NextFunction) => {
  //     try {
  //       const { id } = req.params;
  //       const example = await this.exampleService.update(parseInt(id), req.body);

  //       if (!example) {
  //         throw new AppError('Example not found', 404);
  //       }

  //       res.json({
  //         status: 'success',
  //         data: example,
  //       });
  //     } catch (error) {
  //       next(error);
  //     }
  //   };

  //   delete = async (req: Request, res: Response, next: NextFunction) => {
  //     try {
  //       const { id } = req.params;
  //       await this.exampleService.delete(parseInt(id));

  //       res.status(204).send();
  //     } catch (error) {
  //       next(error);
  //     }
  //   };
}
