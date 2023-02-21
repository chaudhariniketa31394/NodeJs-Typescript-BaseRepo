import { injectable, inject } from 'inversify';
import { Request as ExpressRequest, Response as ExpressResponse } from 'express';
import { MissingFieldError } from '../errors/app.errors';
import { TaskGetDTO as TaskGetDto, TaskCreateDTO } from '../dto/task.dto';
import { ITaskService } from '../services/task.service';
import { getValidObjectId } from '../utils/utils';
import { ITaskRepository, TaskDocument } from '../repositories/task.repository';
import { TYPES } from '../types';
import { FilterQuery } from 'mongodb';

@injectable()
export default class TaskController {
  @inject(TYPES.TaskRepository) private taskRepository: ITaskRepository;

  @inject(TYPES.TaskService) private taskService: ITaskService;

  private limit: number;

  constructor() {
    this.limit = 20;
  }

  public async find(req: ExpressRequest, res: ExpressResponse): Promise<void> {
    const limit = req.query.limit ? parseInt(req.query.limit as string) : this.limit;
    const pageNumber = req.query.page ? parseInt(req.query.page as string) : 1;

    const getTaskDto: TaskGetDto = {
      pageNumber,
      limit,
      filter: req.query.filter as FilterQuery<Partial<TaskDocument>>,
      path: req.path,
    };

    const response = await this.taskService.getAllTasks(getTaskDto);
    res.send(response);
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

    if (!req.body.title) {
      throw new MissingFieldError('title');
    }

    if (!req.body.description) {
      throw new MissingFieldError('description');
    }

    const createTaskDto: TaskCreateDTO = {
      title: req.body.title,
      description: req.body.description
    };

    await this.taskService.createTask(createTaskDto);

    res.sendStatus(201);
  }

  public async update(req: ExpressRequest, res: ExpressResponse): Promise<void> {
    if (!req.params.id) {
      throw new MissingFieldError('id');
    }

    const updateTaskDto: TaskCreateDTO = {
        title: req.body.title,
        description: req.body.description
      };

    res.send(await this.taskService.updateTask(getValidObjectId(req.params.id), updateTaskDto));


  }

  public async delete (req: ExpressRequest, res: ExpressResponse): Promise<void> {
    if (!req.params.id) {
        throw new MissingFieldError('id');
      }
  
      res.send(await this.taskService.deleteTask(getValidObjectId(req.params.id)));
  }

}
