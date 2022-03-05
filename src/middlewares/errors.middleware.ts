import { ApiError } from "../exceptions/api-error"

const errorMiddleWare = (err:ApiError,req,res,next) => {
    console.log(err)

    if(err instanceof ApiError){
        return res.status(err.status).json({
            message:err.message,
            errors:err.errors,
            statusCode:err.status
        })
    }

    return res.status(500).json({
        message:'Непредвиденная ошибка',
        statusCode:500
    })
}  

export default errorMiddleWare