"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
const inversify_1 = require("inversify");
const app_errors_1 = require("../errors/app.errors");
const utils_1 = require("../utils/utils");
const types_1 = require("../types");
const validators_1 = require("../utils/validators");
const task_model_1 = require("../dto/model/task.model");
let TaskController = class TaskController {
    constructor() {
        this.limit = 20;
    }
    find(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const { limit, pageNumber, filterquery } = req.body;
            const query = {
                query: filterquery,
                options: {
                    limit: parseInt(limit) || this.limit,
                    //sort: {DocumentCreatedOn: -1},
                    projection: { title: 1, description: 1, status: 1 },
                    skip: (parseInt(pageNumber) > 0) ? limit * (parseInt(pageNumber) - 1) : 0
                },
                pageNumber: pageNumber,
                path: req.path
            };
            const result = yield this.taskService.getAllTasks(query);
            res.status(200).send((0, utils_1.response)(null, result, 'data fetch successfully'));
        });
    }
    get(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            if (!req.params.id) {
                throw new app_errors_1.MissingFieldError('id');
            }
            const task = yield this.taskRepository.get((0, utils_1.getValidObjectId)(req.params.id));
            res.send(task);
        });
    }
    /**
     * Create user
     *
     * @requires title A valid title
     * @requires description A valid description
     **/
    create(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const validate = yield (0, validators_1.validatePayload)(task_model_1.TaskCreateSchema, req.body);
            if (validate && validate.isValid && validate.statusCode == 200) {
                const result = yield this.taskService.createTask(req.body);
                res.status(201).send((0, utils_1.response)(null, result, 'task created'));
            }
            else
                res.status(validate.statusCode).send((0, utils_1.response)(validate.error, null, null));
        });
    }
    update(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const validate = yield (0, validators_1.validatePayload)(task_model_1.TaskUpdateSchema, req.body);
            if (validate && validate.isValid && validate.statusCode == 200) {
                req.body.taskid = (0, utils_1.getValidObjectId)(req.body.taskid);
                yield this.taskService.updateTask(req.body);
                res.status(200).send((0, utils_1.response)(null, null, 'task updated'));
            }
            else
                res.status(validate.statusCode).send((0, utils_1.response)(validate.error, null, null));
            // res.send(await this.taskService.updateTask(getValidObjectId(req.params.id), updateTaskDto));
        });
    }
    delete(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            if (!req.body.id) {
                throw new app_errors_1.MissingFieldError('id');
            }
            yield this.taskService.deleteTask((0, utils_1.getValidObjectId)(req.body.id));
            res.status(200).send((0, utils_1.response)(null, null, "Task deleted successfully"));
        });
    }
};
__decorate([
    (0, inversify_1.inject)(types_1.TYPES.TaskRepository),
    __metadata("design:type", Object)
], TaskController.prototype, "taskRepository", void 0);
__decorate([
    (0, inversify_1.inject)(types_1.TYPES.TaskService),
    __metadata("design:type", Object)
], TaskController.prototype, "taskService", void 0);
TaskController = __decorate([
    (0, inversify_1.injectable)(),
    __metadata("design:paramtypes", [])
], TaskController);
exports.default = TaskController;
//# sourceMappingURL=task.controller.js.map