"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.TaskUpdateSchema = exports.TaskCreateSchema = void 0;
exports.TaskCreateSchema = {
    type: "object",
    properties: {
        title: { type: "string", minLength: 3 },
        description: { type: "string", minLength: 5 },
        status: { type: "string", enum: ["Completed", "InProgress", "Pending"] }
    },
    required: ["description", "title", "status"],
    additionalProperties: false
};
exports.TaskUpdateSchema = {
    type: "object",
    properties: {
        title: { type: "string", minLength: 3 },
        description: { type: "string", minLength: 5 },
        status: { type: "string", enum: ["Completed", "InProgress", "Pending"] },
        taskid: { type: "string" }
    },
    required: ["taskid"],
    additionalProperties: false
};
//# sourceMappingURL=task.model.js.map