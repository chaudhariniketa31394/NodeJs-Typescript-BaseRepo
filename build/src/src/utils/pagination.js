"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
function paginate(documents, limit, pageNumber, path) {
    return {
        data: documents,
        limit,
        pageNumber,
        next: documents.length < limit ? '' : `${process.env.BASE_URL}${path}?page=${pageNumber + 1}`,
        previous: (pageNumber > 1) ? `${process.env.BASE_URL}${path}?page=${pageNumber - 1}` : '',
    };
}
exports.default = paginate;
//# sourceMappingURL=pagination.js.map