// Simple Definition
// 👉 asyncHandler is a wrapper function that:
// ✔ runs async controllers
// ✔ catches errors automatically
// ✔ sends errors to Express middleware

// 🔥 One-Line Understanding
// 👉 Instead of writing try-catch in every API, we write this function once and reuse it everywhere.

const asyncHandler = (requestHandler) => {
    return (req, res, next) => {
        Promise.resolve(requestHandler(req, res, next)).catch((err) => next(err));
    };
};

export { asyncHandler };

// const asyncHandler =() =>{}
// const asyncHandler =(func) => () =>{}
// const asyncHandler =(fun) => async =>() => {}

// const asyncHandler = (fn) => async (req,res,next) => {
//     try{
//         await fun(req,res,next)
//     }catch (error){
//         res.status(error.code || 500).json({
//             success:false,
//             message: error.message
//         })
//     }
// }
