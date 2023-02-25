"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.validatePayload = void 0;
const Ajv = require("ajv");
const addFormats = require("ajv-formats");
const ajv = new Ajv.default({ allErrors: true, verbose: true }); // code: { source: true, formats: MyFormat } 
// ajv.addFormat("email", /^([a-zA-Z0-9_\-\.]+)@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.)|(([a-zA-Z0-9\-]+\.)+))([a-zA-Z]{2,4}|[0-9]{1,3})(\]?)$/);
ajv.addFormat("mobile", /^[6789]\d{9}$/);
ajv.addFormat("zip", /\b\d{6}\b/g);
// ajv.addKeyword('isNotEmpty', {
//     type: 'string',
//     validate: function (data:any) {
//         return typeof data === 'string' && data.trim() !== ''
//     },
//     errors: false
// })
addFormats(ajv);
function validatePayload(schemaObj, payloadObj) {
    try {
        const data = payloadObj;
        const validate = ajv.compile(schemaObj);
        const valid = validate(data);
        if (valid)
            return { statusCode: 200, isValid: true };
        if (!valid)
            throw validate.errors;
    }
    catch (error) {
        const errorObj = {
            statusCode: 404,
            isValid: false,
            error: fromAJVErrorsToIErrors(error),
            errorCode: 404
        };
        return errorObj;
    }
}
exports.validatePayload = validatePayload;
function fromAJVErrorsToIErrors(errors) {
    return errors.map((error) => {
        let field = error.dataPath || error.params && error.params.missingProperty || error.params && error.params.additionalProperty || error.instancePath || "";
        let addParams = error.params && error.params.additionalProperty ? "- " + error.params.additionalProperty : "";
        if (field.startsWith("/")) {
            field = field.substring(1);
        }
        return {
            field,
            message: error.message + addParams,
        };
    });
}
//# sourceMappingURL=validators.js.map