let {registerpatient,loginpatient,addprofile,updateProfile,getme,forget,reset,change,updateprofile,deactivate}=require("../model/user")
let {request,response}=require("express")
const uploads = require("../helper/file")



async function register(request,response){
    let patient=await registerpatient(request.body).catch((err)=>{
        return {error:err}
    })
    if(!patient || patient.error){
        return response.status(500).send({error:patient.error})
    }
    return response.send(patient)
}

async function login (request,response){
    let patient=await loginpatient(request.body).catch((err)=>{
        return {error:err}
    })
    if(!patient || patient.error){
        return response.status(401).send({error:patient.error})
    }
    return response.send({data:patient})
}

async function my_profile_pic(request,response){
    let addfile= await uploads(request,response,"profile_pic",{destination:'./profile-pic/',fileSize:3*1000*1000}).catch((err)=>{
        return {error:err}
    });
    console.log(addfile)
    if(!addfile || addfile.error){
        return response.status(401).send({error:addfile.error})
    }
    let addmyprofile= await addprofile(request.file.path,request.userData).catch((err)=>{
        return {error:err}
    })
    
    if(!addmyprofile || addmyprofile.error){
        return response.status(401).send({error:addmyprofile.error})
    }
    return response.send({data:addmyprofile})
}


async function update_profile_pic(request,response){
    let addfile= await uploads(request,response,"update_pic",{fileSize:3*1000*1000}).catch((err)=>{
        return {error : err}
    })
    if(!addfile || addfile.error){
        return response.status(401).send({error:addfile.error})
    }
    let updatepic =await updateProfile(addfile.path,request.userData).catch((err)=>{
        return {error:err}
    })
    if(!updatepic || updatepic.error ){
        return response.status(401).send({error:updatepic.error});
    }
    return response.send({data:updatepic})
}


async function about_me(request,response){
    let get=await getme(request.body,request.userData).catch((err)=>{
        return {error:err}
    })
    if(!get || get.error){
        return response.status(401).send({error:get.error})
    }
    return response.send({data:get})
}

async function forgetpassword (request,response){
    let userpass=await forget(request.body).catch((err)=>{
        return { error:err }
    })
    if(!userpass || (userpass && userpass.error)){
        return response.status(401).send({ error : userpass.error })
    }
    return response.send({data:userpass})
}


async function resetpassword (request,response){
    let userpass=await reset(request.body).catch((err)=>{
        return {error:err}
    })
    console.log(userpass)
    if(!userpass || (userpass && userpass.error)){
        return response.status(401).send({error:userpass.error})
    }
    return response.send({data:userpass})
}


async function changepassword(request,response){
    let check=await change(request.body,request.userData).catch((err)=>{
        return {error:err}
    })
    console.log(check)
    if(!check || check.error){
        return response.status(402).send({error:check.error})
    }
    return response.send({data:check})
}

async function updatemyprofile(request,response){
    let check=await updateprofile(request.body,request.userData).catch((err)=>{
        return {error:err}
    })
    console.log(check)
    if(!check || check.error){
        return response.status(402).send({error:check.error})
    }
    return response.send({data:check})
}

async function deactivateme(request,response){
    let check = await deactivate(request.body,request.userData).catch((err)=>{
        return {error:err}
    });
    console.log(check)
    if (!check || check.error){
        return response.status(401).send({error:check.error})
    };
    return  response.send({data:check})
}
module.exports= {register,login,my_profile_pic,update_profile_pic,forgetpassword,about_me,resetpassword,changepassword,updatemyprofile,deactivateme}