// let express= require("express");
// require("express-async-errors")

// function errorhandler(error,request,response,next){
//     response.status(501).send("Internal Server Error")
// };

// module.exports={errorhandler}

let errorhandler = (error ,req,res,next)=>{
    let status = 505
    let data = {
        message:"Internal server error",
        originalError:error.message
    } 
    return res.status(status).json({status:"fail",error:data});
}

module.exports={errorhandler}