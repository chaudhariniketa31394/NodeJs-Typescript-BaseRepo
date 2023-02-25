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
let TaskController = class TaskController {
    constructor() {
        this.limit = 20;
    }
    find(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const limit = req.query.limit ? parseInt(req.query.limit) : this.limit;
            const pageNumber = req.query.page ? parseInt(req.query.page) : 1;
            const getTaskDto = {
                pageNumber,
                limit,
                filter: req.query.filter,
                path: req.path,
            };
            const response = yield this.taskService.getAllTasks(getTaskDto);
            res.send(response);
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
            if (!req.body.title) {
                throw new app_errors_1.MissingFieldError('title');
            }
            if (!req.body.description) {
                throw new app_errors_1.MissingFieldError('description');
            }
            const createTaskDto = {
                title: req.body.title,
                description: req.body.description
            };
            yield this.taskService.createTask(createTaskDto);
            res.sendStatus(201);
        });
    }
    update(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            if (!req.params.id) {
                throw new app_errors_1.MissingFieldError('id');
            }
            const updateTaskDto = {
                title: req.body.title,
                description: req.body.description
            };
            res.send(yield this.taskService.updateTask((0, utils_1.getValidObjectId)(req.params.id), updateTaskDto));
        });
    }
    delete(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            if (!req.params.id) {
                throw new app_errors_1.MissingFieldError('id');
            }
            res.send(yield this.taskService.deleteTask((0, utils_1.getValidObjectId)(req.params.id)));
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