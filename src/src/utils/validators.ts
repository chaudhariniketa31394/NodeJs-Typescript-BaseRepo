

const Ajv = require("ajv")


const addFormats = require("ajv-formats")
const ajv = new Ajv.default({ allErrors: true, verbose: true })// code: { source: true, formats: MyFormat } 

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
addFormats(ajv)


export function validatePayload(schemaObj:any, payloadObj:any) {
    try {
        const data = payloadObj
        const validate = ajv.compile(schemaObj)
        const valid = validate(data)
        if (valid) return {statusCode:200,isValid:true}
        if (!valid) throw validate.errors
    } catch (error:any) {
        const errorObj = {
            statusCode: 404,
            isValid:false,
            error: fromAJVErrorsToIErrors(error),
            errorCode: 404
        }
        return errorObj
    }
}






function fromAJVErrorsToIErrors(errors: any): IError[] {
    return errors.map((error: any) => {
      let field: string = error.dataPath || error.params && error.params.missingProperty || error.params && error.params.additionalProperty ||error.instancePath || "";
      let addParams = error.params && error.params.additionalProperty ? "- " + error.params.additionalProperty: "";
      if (field.startsWith("/")) {
        field = field.substring(1);
      }
      return {
        field,
        message: error.message + addParams,
      };
    });
  }
  export interface IError {
    field: string;
    message: string;
    statusCode?: number
  }