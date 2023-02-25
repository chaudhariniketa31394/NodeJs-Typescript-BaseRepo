"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const asyncWrapper_1 = require("./utils/asyncWrapper");
const user_controller_1 = require("./controllers/user.controller");
const task_controller_1 = require("./controllers/task.controller");
const path = require("path");
const swaggerUi = require("swagger-ui-express");
const YAML = require("yamljs");
const swaggerDocument = YAML.load(path.join(__dirname + '/../../swaggerdoc.yaml'));
const inversify_1 = require("./inversify");
/**
 * Configure all the services with the express application
 */
function default_1(app) {
    // Iterate over all our controllers and register our routes
    const UserControllerInstance = inversify_1.default.get(user_controller_1.default);
    const TaskControllerInstance = inversify_1.default.get(task_controller_1.default);
    /**
     * Configure swagger
     */
    app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));
    app.get('/users', (0, asyncWrapper_1.default)(UserControllerInstance.find.bind(UserControllerInstance)));
    app.get('/users/:id', (0, asyncWrapper_1.default)(UserControllerInstance.get.bind(UserControllerInstance)));
    app.post('/user', (0, asyncWrapper_1.default)(UserControllerInstance.create.bind(UserControllerInstance)));
    app.post('/login', (0, asyncWrapper_1.default)(UserControllerInstance.login.bind(UserControllerInstance)));
    app.post('/sendotp', (0, asyncWrapper_1.default)(UserControllerInstance.sendOtp.bind(UserControllerInstance)));
    app.post('/validateotp', (0, asyncWrapper_1.default)(UserControllerInstance.validateOtp.bind(UserControllerInstance)));
    app.get('/logout', (0, asyncWrapper_1.default)(UserControllerInstance.logout.bind(UserControllerInstance)));
    app.post('/task', (0, asyncWrapper_1.default)(TaskControllerInstance.create.bind(TaskControllerInstance)));
    app.post('/delete-task', (0, asyncWrapper_1.default)(TaskControllerInstance.delete.bind(TaskControllerInstance)));
    app.post('/tasks', (0, asyncWrapper_1.default)(TaskControllerInstance.find.bind(TaskControllerInstance)));
    app.get('/task/:id', (0, asyncWrapper_1.default)(TaskControllerInstance.get.bind(TaskControllerInstance)));
    app.post('/update-task', (0, asyncWrapper_1.default)(TaskControllerInstance.update.bind(TaskControllerInstance)));
}
exports.default = default_1;
//# sourceMappingURL=routes.js.map