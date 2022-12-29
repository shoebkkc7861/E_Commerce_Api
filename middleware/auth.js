let express= require("express");
let jwt=require("jsonwebtoken")

async function authenticate(request,response,next){
    if(!request.headers || !request.headers.token){
        return response.status(401).send("Token NOT FOUND")
    }
    let verify='';
    try {
     verify= jwt.verify(request.headers.token,"Mohif9232")        
    } catch (error) {
        if(!verify || verify.error){
            return response.status(402).send("Token Invalid")
        }
    }
    console.log(verify)
    // request.body.id=verify.id;

    next();
}




module.exports={authenticate}