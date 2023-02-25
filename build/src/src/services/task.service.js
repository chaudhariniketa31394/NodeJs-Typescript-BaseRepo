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
const pagination_1 = require("../utils/pagination");
const types_1 = require("../types");
/**
 * The actual class that contains all the business logic related to users.
 * Controller sanitize/validate(basic) and sends data to this class methods.
 */
let TaskService = class TaskService {
    createTask(data) {
        return __awaiter(this, void 0, void 0, function* () {
            const normalizedTitle = this.normalizeContent(data.title);
            const normalizedDesc = this.normalizeContent(data.description);
            const taskData = {
                title: normalizedTitle,
                description: normalizedDesc,
            };
            yield this.taskRepository.create(taskData);
        });
    }
    getAllTasks(getUserDto) {
        return __awaiter(this, void 0, void 0, function* () {
            let documents;
            const filter = getUserDto.filter || {};
            documents = yield this.taskRepository.find(filter, getUserDto.limit, getUserDto.pageNumber);
            return (0, pagination_1.default)(documents, getUserDto.limit, getUserDto.pageNumber, getUserDto.path);
        });
    }
    updateTask(id, data) {
        return __awaiter(this, void 0, void 0, function* () {
            yield this.taskRepository.update({ _id: id }, data);
            return data;
        });
    }
    deleteTask(id) {
        return __awaiter(this, void 0, void 0, function* () {
            yield this.taskRepository.removeById(id);
            return { msg: 'Task deleted' };
        });
    }
    normalizeContent(data) {
        return data.toLowerCase();
    }
};
__decorate([
    (0, inversify_1.inject)(types_1.TYPES.TaskRepository),
    __metadata("design:type", Object)
], TaskService.prototype, "taskRepository", void 0);
TaskService = __decorate([
    (0, inversify_1.injectable)()
], TaskService);
exports.default = TaskService;
//# sourceMappingURL=task.service.js.map