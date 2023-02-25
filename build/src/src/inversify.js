"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const inversify_1 = require("inversify");
const types_1 = require("./types");
const user_repository_1 = require("./repositories/user.repository");
const user_service_1 = require("./services/user.service");
const user_controller_1 = require("./controllers/user.controller");
const task_repository_1 = require("./repositories/task.repository");
const task_service_1 = require("./services/task.service");
const task_controller_1 = require("./controllers/task.controller");
const container = new inversify_1.Container({ defaultScope: 'Singleton' });
container.bind(user_controller_1.default).to(user_controller_1.default);
container.bind(types_1.TYPES.UserRepository).to(user_repository_1.default);
container.bind(types_1.TYPES.UserService).to(user_service_1.default);
container.bind(task_controller_1.default).to(task_controller_1.default);
container.bind(types_1.TYPES.TaskRepository).to(task_repository_1.default);
container.bind(types_1.TYPES.TaskService).to(task_service_1.default);
exports.default = container;
//# sourceMappingURL=inversify.js.map