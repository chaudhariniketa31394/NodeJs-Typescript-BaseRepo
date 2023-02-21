import { FilterQuery, ObjectID } from 'mongodb';
import { TaskDocument } from '../repositories/task.repository';

export interface TaskGetDTO {
  limit: number;
  pageNumber: number;
  filter: FilterQuery<Partial<TaskDocument>>;
  path: string;
}

export interface TaskCreateDTO {
   _id?: ObjectID
  title: string;
  description: string;
}