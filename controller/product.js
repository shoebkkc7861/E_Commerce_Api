let uploads= require("../helper/file")
let {addproduct,updateproduct,activeproduct,inactiveproduct,deleteproduct,undeleteproduct,findproduct}=require("../model/product")
const path=require("path");
const { array } = require("joi");
const app = require("../init/cors");

// async function add_product(request,response){
//     let addpic= await uploads(request,response,"avatar",{fileSize:3*1000*1000}).catch((err)=>{
//         return {error:err}
//     });
//     if(!addpic || addpic.error){
//         return response.status(401).send({error:addpic.error})
//     }
//     // return response.send(addpic)
//     console.log(addpic)
//     let add=await addproduct(request.body,addpic.path).catch((err)=>{
//         return ({error:err})
//     });

//     if(!add || add.error){
//         return response.status(401).send({error:add.error})
//     }
//     return response.send({data:add.data})
// }
async function add_product(request,response){

    let addpic= await uploads(request,response,[{name:"product",maxCount:4}],{destination:'./product-pic/',fileSize:3*1000*1000}).catch((err)=>{
        return {error:err}
    });
    
    if(!addpic || addpic.error){
        return response.status(401).send({error:addpic.error})
    }
    
    let data=[]
    for(let i of addpic.product){
        data.push(i.path)
    }

    let path = data.join("   AND   ");

    let add=await addproduct(request.body,path,request.userData).catch((err)=>{
        return ({error:err})
    });

    if(!add || add.error){
        return response.status(401).send({error:add.error})
    }
    return response.send({data:add.data})
}

async function update_product(request,response){
    let addpic= await uploads(request,response,[{name:"product",maxCount:4}],{destination:'./product-pic/',fileSize:3*1000*1000}).catch((err)=>{
        return {error:err}
    });
    
    if(!addpic || addpic.error){
        return response.status(401).send({error:addpic.error})
    }
    
    let data=[]
    for(let i of addpic.product){
        data.push(i.path)
    }

    let path = data.join("   AND   ");

    let add=await updateproduct(request.body,path,request.userData).catch((err)=>{
        return {error:err}
    });
    if(!add || add.error){
        return response.status(401).send({error:add.error})
    }
    return response.send({data:add.data})
}


async function active_product(request,response){
    let add=await activeproduct(request.body,request.userData).catch((err)=>{
        return {error:err}
    });
    if(!add || add.error){
        return response.status(401).send({error:add.error})
    }
    return response.send({data:add.data})
}

async function inactive_product(request,response){
    let add=await inactiveproduct(request.body,request.userData).catch((err)=>{
        return {error:err}
    });
    if(!add || add.error){
        return response.status(401).send({error:add.error})
    }
    return response.send({data:add.data})
}

async function delete_product(request,response){
    let add=await deleteproduct(request.body,request.userData).catch((err)=>{
        return {error:err}
    });
    if(!add || add.error){
        return response.status(401).send({error:add.error})
    }
    return response.send({data:add.data})
}

async function undelete_product(request,response){
    let add=await undeleteproduct(request.body,request.userData).catch((err)=>{
        return {error:err}
    });
    if(!add || add.error){
        return response.status(401).send({error:add.error})
    }
    return response.send({data:add.data})
}

async function find_product(request,response){
    let add=await findproduct(request.body).catch((err)=>{
        return {error:err}
    });
    if(!add || add.error){
        return response.status(401).send({error:add.error})
    }
    return response.send({data:add.data})
}

module.exports={
    add_product,
    update_product,
    active_product,
    inactive_product,
    delete_product,
    undelete_product,
    find_product
}