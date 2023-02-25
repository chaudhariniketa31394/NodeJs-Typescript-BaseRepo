import { injectable, inject } from 'inversify';
import { Request as ExpressRequest, Response as ExpressResponse } from 'express';
import { MissingFieldError } from '../errors/app.errors';
import {MongoQuerySpec} from '../repositories/repository'
import { ITaskService } from '../services/task.service';
import { getValidObjectId, response } from '../utils/utils';
import { ITaskRepository} from '../repositories/task.repository';
import { TYPES } from '../types';
import { validatePayload } from '../utils/validators';
import { TaskCreateSchema, TaskUpdateSchema } from '../dto/model/task.model';

@injectable()
export default class TaskController {
  @inject(TYPES.TaskRepository) private taskRepository: ITaskRepository;

  @inject(TYPES.TaskService) private taskService: ITaskService;

  private limit: number;

  constructor() {
    this.limit = 20;
  }

  public async find(req: ExpressRequest, res: ExpressResponse): Promise<void> {

    const {limit , pageNumber,filterquery} = req.body
    const query: MongoQuerySpec = {
      query: filterquery,
      options:{
        limit: parseInt(limit) || this.limit,
        //sort: {DocumentCreatedOn: -1},
        projection: {title:1,description:1,status:1},
        skip: (parseInt(pageNumber)  > 0) ? limit * (parseInt(pageNumber) - 1) : 0        
      },
      pageNumber:pageNumber,
      path: req.path
    }   
    const result = await this.taskService.getAllTasks(query);
    res.status(200).send(response(null,result,'data fetch successfully'));
  }

  public async get(req: ExpressRequest, res: ExpressResponse): Promise<void> {
    if (!req.params.id) {
      throw new MissingFieldError('id');
    }

    const task = await this.taskRepository.get(getValidObjectId(req.params.id));
    res.send(task);
  }

  /**
   * Create user
   *
   * @requires title A valid title
   * @requires description A valid description
   **/
  public async create(req: ExpressRequest, res: ExpressResponse) {
    const validate:any = await validatePayload(TaskCreateSchema, req.body);
    if (validate && validate.isValid && validate.statusCode == 200) {
       const result = await this.taskService.createTask(req.body);
       res.status(201).send(response(null,result,'task created'));
    }
    else res.status(validate.statusCode).send(response(validate.error,null,null));
   }

  public async update(req: ExpressRequest, res: ExpressResponse): Promise<void> {
    
    const validate:any = await validatePayload(TaskUpdateSchema, req.body);
    if (validate && validate.isValid && validate.statusCode == 200) {
      req.body.taskid = getValidObjectId(req.body.taskid)
      await this.taskService.updateTask(req.body)
      res.status(200).send(response(null,null,'task updated'))
    }else res.status(validate.statusCode).send(response(validate.error,null,null));
    
   // res.send(await this.taskService.updateTask(getValidObjectId(req.params.id), updateTaskDto));


  }

  public async delete (req: ExpressRequest, res: ExpressResponse): Promise<void> {
    if (!req.body.id) {
        throw new MissingFieldError('id');
      }
      await this.taskService.deleteTask(getValidObjectId(req.body.id))
      res.status(200).send(response(null,null,"Task deleted successfully"));
  }

}
