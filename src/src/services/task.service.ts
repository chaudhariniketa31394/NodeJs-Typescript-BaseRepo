import { injectable, inject } from 'inversify';
import paginate, { Pagination } from '../utils/pagination';
import {TaskGetDTO,TaskCreateDTO } from '../dto/task.dto';
import { ITaskRepository, TaskDocument } from '../repositories/task.repository';
import { TYPES } from '../types';
import { ObjectId } from 'mongodb';


/**
 * User without sensitive fields.
 * This is useful when returning data to client.
 */
export type NormalizedTaskDocument = Pick<TaskDocument, '_id' | 'title' | 'description'>;

/**
 * Interface for UserService
 */
export interface ITaskService {
  createTask(data: TaskCreateDTO): Promise<void>;
  getAllTasks(data: TaskGetDTO): Promise<Pagination<TaskDocument>>;
  updateTask(id: ObjectId, data: TaskCreateDTO): Promise<TaskCreateDTO>;
  deleteTask(id: ObjectId): Promise<any>;
  normalizeContent(data: string): string;
}

/**
 * The actual class that contains all the business logic related to users.
 * Controller sanitize/validate(basic) and sends data to this class methods.
 */
@injectable()
export default class TaskService implements ITaskService {

  @inject(TYPES.TaskRepository) private taskRepository: ITaskRepository;

  public async createTask(data: TaskCreateDTO): Promise<void> {
    const normalizedTitle = this.normalizeContent(data.title);
    const normalizedDesc = this.normalizeContent(data.description);

    const taskData: TaskCreateDTO = {
      title: normalizedTitle,
      description: normalizedDesc,
    };

    await this.taskRepository.create(taskData);
  }

  public async getAllTasks(getUserDto: TaskGetDTO): Promise<Pagination<TaskDocument>> {
    let documents: TaskDocument[];
    const filter = getUserDto.filter || {};
    documents = await this.taskRepository.find(filter, getUserDto.limit, getUserDto.pageNumber);

    return paginate(documents, getUserDto.limit, getUserDto.pageNumber, getUserDto.path);
  }

  public async updateTask(id: string, data: TaskCreateDTO): Promise<TaskCreateDTO> {
    await this.taskRepository.update({_id: id }, data); 
    return data
  }

  public async deleteTask(id: string): Promise<any> {
    await this.taskRepository.removeById(id); 
    return {msg: 'Task deleted'}
  }
  

  public normalizeContent(data: string): string {
    return data.toLowerCase();
  }

}
