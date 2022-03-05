import { StatusCode, StatusCodeTypes } from "./statusCode";

export interface ResponseJson<D> {
    statusCode: StatusCodeTypes
    message: string
    data: D 
}