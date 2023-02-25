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
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
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
const database_1 = require("../database");
const utils_1 = require("../utils/utils");
/**
 * This Repository class is the base repository. It is an abstract class because it can only be
 * extended. This class is writen to support mongoose properly which means it will look different
 * if you use mongodb driver directly or use any other orm or database driver.
 *
 * The collection property is the mongoose collection in this case. For you, it can be mongodb collection for example.
 */
let Repository = class Repository {
    constructor(collection) {
        this.collection = database_1.default.getCollection(collection);
    }
    get(id, select = {}) {
        return __awaiter(this, void 0, void 0, function* () {
            const objectId = (0, utils_1.getValidObjectId)(id);
            const collection = this.collection;
            const doc = yield collection.findOne({ _id: objectId }, select);
            return doc;
        });
    }
    find(filter = {}, limit = 10, page = 0, select, sort) {
        return __awaiter(this, void 0, void 0, function* () {
            const collection = this.collection;
            const query = collection.find(filter, select);
            if (sort) {
                query.sort(sort);
            }
            if (page > 0) {
                const skip = limit * (page - 1);
                query.skip(skip);
            }
            query.limit(limit);
            const docs = yield query.toArray();
            return docs;
        });
    }
    create(data) {
        return __awaiter(this, void 0, void 0, function* () {
            if (!data) {
                throw new Error('Empty object provided');
            }
            const collection = this.collection;
            const doc = (yield collection.insertOne(data)).ops[0];
            return doc;
        });
    }
    createMany(_data) {
        throw new Error('Method not implemented.');
    }
    update(_filter, _data, _multi) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield this.collection.updateOne(_filter, { $set: _data });
        });
    }
    unsetUpdate(_filter, data) {
        return __awaiter(this, void 0, void 0, function* () {
            yield this.collection.updateOne(_filter, data);
        });
    }
    updateById(ids, data) {
        return __awaiter(this, void 0, void 0, function* () {
            let objectIds = [];
            if (Array.isArray(ids)) {
                objectIds = ids.map((id) => (0, utils_1.getValidObjectId)(id));
            }
            else {
                objectIds = [(0, utils_1.getValidObjectId)(ids)];
            }
            const collection = this.collection;
            yield collection.update({ _id: { $in: objectIds } }, data);
        });
    }
    remove(filter, multi) {
        return __awaiter(this, void 0, void 0, function* () {
            const collection = this.collection;
            if (multi) {
                yield collection.deleteMany(filter);
            }
            else {
                yield collection.deleteOne(filter);
            }
        });
    }
    removeById(ids) {
        return __awaiter(this, void 0, void 0, function* () {
            let objectIds = [];
            if (Array.isArray(ids)) {
                objectIds = ids.map((id) => (0, utils_1.getValidObjectId)(id));
            }
            else {
                objectIds = [(0, utils_1.getValidObjectId)(ids)];
            }
            const collection = this.collection;
            yield collection.deleteMany({ _id: { $in: objectIds } });
        });
    }
    getCollection() {
        return this.collection;
    }
};
Repository = __decorate([
    (0, inversify_1.injectable)(),
    __param(0, (0, inversify_1.unmanaged)()),
    __metadata("design:paramtypes", [String])
], Repository);
exports.default = Repository;
//# sourceMappingURL=repository.js.map