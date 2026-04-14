const errorMiddleware = (err, req, res, next) => {
    const statusCode = err.statusCode || 500;

    res.status(statusCode).json({
        success: false,
        message: err.message || "Internal Server Error",
    });
};

export default errorMiddleware;

// class ApiError extends Error{
//     constructor(
//         statusCode,
//         message = "Something went worng",
//         errors = [],
//         stack = ""
//     ){
//         super(message)
//         this.statusCode = statusCode
//         this.data = null
//         this.message = message
//         this.success = false
//         this.errors = errors

//         if(stack){
//             this.stack = stack
//         }else{
//             Error.captureStackTrace(this , this.constructor)
//         }
//     }
// }

// export { ApiError }