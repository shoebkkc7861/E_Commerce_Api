let {loginadmin, assignpermission,findall,update,getpermission,getpermission2,softdelete,softundelete,unactive,active}= require("../model/admin")


async function login(request,response){
    let task=await loginadmin(request.body).catch((err)=>{
        return {error:err}
    })
    console.log(task)
    if(!task || (task && task.error)){
        return response.status(401).send({error:task.error})
    }
    return response.send({data:task})
}

async function addpermission(request,response){
    let task=await assignpermission(request.body,request.userData).catch((err)=>{
        return {error:err}
    })
    console.log(task)
    if(!task || (task && task.error)){
        return response.status(401).send({error:task.error})
    }
    return response.send({data:task})
}


async function finduser(request,response){
    let task=await findall(request.body).catch((err)=>{
        return {error:err}
    })
    console.log(task)
    if(!task || (task && task.error)){
        return response.status(401).send({error:task.error})
    }
    return response.send({data:task})
}

async function updateuser(request,response){
    let task=await update(request.body,request.userData).catch((err)=>{
        return {error:err}
    })
    console.log(task)
    if(!task || (task && task.error)){
        return response.status(401).send({error:task.error})
    }
    return response.send({data:task})
}

async function permission(request,response){
    let task=await getpermission().catch((err)=>{
        return {error:err}
    })
    if(!task || (task && task.error)){
        return response.status(401).send({error:task.error})
    }
    return response.send(task)
}
async function userpermission(request,response){
    let task=await getpermission2(request.body).catch((err)=>{
        return {error:err}
    })
    console.log(task)
    console.log(task)
    if(!task || (task && task.error)){
        return response.status(401).send({error:task.error})
    }
    return response.send(task)
}


async function softdeleteuser(request,response){
    let done=await softdelete(request.body,request.userData).catch((err)=>{
        return {error:err}
    })
    if(!done || done.error){
        return response.status(401).send({error:done.error})
    };
    return  response.send({data:done})
}
async function softundeleteuser(request,response){
    let done=await softundelete(request.body,request.userData).catch((err)=>{
        return {error:err}
    })
    if(!done || done.error){
        return response.status(401).send({error:done.error})
    };
    return  response.send({data:done})
}

async function activeuser(request,response){
    let done=await active(request.body,request.userData).catch((err)=>{
        return {error:err}
    })
    if(!done || done.error){
        return response.status(401).send({error:done.error})
    };
    return  response.send({data:done})
}
async function unactiveuser(request,response){
    let done=await unactive(request.body,request.userData).catch((err)=>{
        return {error:err}
    })
    console.log(done)
    if(!done || done.error){
        return response.status(401).send({error:done.error})
    };
    return  response.send({data:done})
}

module.exports= {login, addpermission,finduser,updateuser,permission,userpermission, softdeleteuser,softundeleteuser,activeuser,unactiveuser}
