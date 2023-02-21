import { injectable } from 'inversify';
import { ObjectID } from 'mongodb';
import Repository, { IRepository } from './repository';

/**
 * The schema definition. In other word,
 * A Document of the user collection contains following fields.
 */
export interface TaskDocument {
  _id: ObjectID;
  title: string;
  description: string;
  deletedAt?: Date;
  createdAt?: Date;
}

/**
 * Repository interface.
 */
export interface ITaskRepository extends IRepository<TaskDocument> {
}

/**
 * User repository. In the constructor we pass the collection name to the
 * parent constructor.
 *
 */
@injectable()
export default class UserRepository extends Repository<TaskDocument> implements ITaskRepository {
  constructor() {
    super('tasks'); // Passing collection name
  }
}
