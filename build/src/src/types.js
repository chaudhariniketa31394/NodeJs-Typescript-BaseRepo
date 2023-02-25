"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.TYPES = void 0;
/**
 * InversifyJS need to use the type as identifiers at runtime.
 * We use symbols as identifiers but you can also use classes and or string literals.
 */
exports.TYPES = {
    UserService: Symbol('UserService'),
    UserController: Symbol('UserController'),
    UserRepository: Symbol('UserRepository'),
    TaskService: Symbol('TaskService'),
    TaskController: Symbol('TaskController'),
    TaskRepository: Symbol('TaskRepository'),
};
//# sourceMappingURL=types.js.map