
let {Category,Op} = require("../schema/category");
let joi = require("joi")


//for adding new category

async function checkcategory(param) {
    let schema = joi.object({
        name: joi.string().max(30).min(1).required(),
        description: joi.string().max(100).min(5).required(),
        pid: joi.number().max(100).min(0).required()
    }).options({ abortEarly: false });

    let check = schema.validate(param)
    if (check.error) {
        let error = [];
        for (let err of check.error.details) {
            error.push(err.message)
        }
        return { error: error }
    }
    return { data: check.value }
}

async function category(param, userData) {
    let check = await checkcategory(param).catch((err) => {
        return { error: err }
    });
    if (!check || check.error) {
        return { data: check.error }
    }
    // let findcategory = await Category.findOne({ where: { name: param.name } }).catch((err) => {
    //     return { error: err }
    // });
    // if (findcategory) {
    //     return { error: "This Category is already existed" }
    // }
    let storeproduct = await Category.create({
        name: param.name,
        description: param.description,
        pid: param.pid,
        is_active: true,
        is_deleted: false,
        createdBy: userData.id
    }).catch((err) => {
        return { error: err }
    });
    if (!storeproduct || (storeproduct && storeproduct.error)) {
        return { error: "Internal Server Error" }
    }
    return { data: "Category Added Successfull", storeproduct }
}

//for view category

async function checkcategoryview(param) {
    let schema = joi.object({
        id:joi.number().max(100).min(1),
        name: joi.string().max(30).min(1)
    }).options({ abortEarly: false });

    let check = schema.validate(param)
    if (check.error) {
        let error = [];
        for (let err of check.error.details) {
            error.push(err.message)
        }
        return { error: error }
    }
    return { data: check.value }
}

async function viewCategory(param){
    let check= await checkcategoryview(param).catch((err)=>{
        return {error:err}
    })
    if(!check || check.error){
        return { error: check.error}
    }
    let query={};
    if(param.id){
        query={where:{id:param.id}}
    }
    if(param.name){
        query={where:{name:param.name}}
    }
    let find= await Category.findAll(query).catch((err)=>{
        return {error:err}
    })
    if(!find || find.error || find.length==0){
        return {error:"This category is not available"}
    }
    return {data:find}
}
// for updating the category

async function checkupdatecategory(param) {
    let schema = joi.object({
        category_id: joi.number().max(100).min(0).required(),
        name: joi.string().max(30).min(1),
        description: joi.string().max(100).min(5),
        pid: joi.number().max(1).min(0),

    }).options({ abortEarly: false });

    let check = schema.validate(param)
    if (check.error) {
        let error = [];
        for (let err of check.error.details) {
            error.push(err.message)
        }
        return { error: error }
    }
    return { data: check.value }
};

async function updatecat(param,userData) {
    let check = await checkupdatecategory(param).catch((err) => {
        return { error: err }
    });
    if (!check || check.error) {
        return { error: check.error }
    };
    let checkproduct = await Category.findOne({ where: { id: param.category_id } }).catch((err) => {
        return { error: err }
    })
    if (!checkproduct || checkproduct.error) {
        return { error: "Product not found" }
    }
    let updateproduct = await Category.update({
        name: param.name,
        description: param.description,
        pid: param.pid,
        updatedBy: userData.id
    }, { where: { id: checkproduct.id } }).catch((err) => {
        return { error: err }
    })
    console.log(updateproduct)
    if (!updateproduct || (updateproduct && updateproduct.error)) {
        return { error: "Internal Server Error" }
    }
    return { data: "Your product updated Successfully" }
}


//for soft delete the category

async function checkdelete(param) {
    let schema = joi.object({
        category_id: joi.number().max(100).min(0).required(),
        name: joi.string().max(30).min(1).required(),
    }).options({ abortEarly: false })

    let check = schema.validate(param);
    if (!check || check.error) {
        let error = [];
        for (let a of check.error.details) {
            error.push(a.message)
        }
        return { error: error };
    }
    return { data: check.value }
}


async function softdeletecat(param,userData) {
    let check = await checkdelete(param).catch((err) => {
        return { error: err }
    })
    if (!check || check.error) {
        return { error: check.error }
    };

    let finduser = await Category.findOne({
        where: {
            id: param.category_id,
            name: param.name
        }
    }).catch((err) => {
        return { error: err }
    });
    if (!finduser || (finduser && finduser.error)) {
        return { error: "Id and Name not matched" }
    }
    let update = await Category.update({ is_deleted: true , is_active:false, updatedBy:userData.id}, {
        where: {
            id: finduser.id,
            name: param.name
        }
    }).catch((err) => {
        return { error: err }
    });

    if (!update || update.error) {
        return { error: " Internal Server Error" }
    }

    return { data: "Your request succeessfully updated" }
}


//for undo the soft delete category

async function checkundelete(param) {
    let schema = joi.object({
        category_id: joi.number().max(100).min(0).required(),
        name: joi.string().max(30).min(1).required(),
    }).options({ abortEarly: false })

    let check = schema.validate(param);
    if (!check || check.error) {
        let error = [];
        for (let a of check.error.details) {
            error.push(a.message)
        }
        return { error: error };
    }
    return { data: check.value }
}


async function softundeletecat(param,userData) {
    let check = await checkundelete(param).catch((err) => {
        return { error: err }
    })
    if (!check || check.error) {
        return { error: check.error }
    };

    let finduser = await Category.findOne({
        where: {
            id: param.category_id,
            name: param.name
        }
    }).catch((err) => {
        return { error: err }
    });
    if (!finduser || (finduser && finduser.error)) {
        return { error: "Id and Name not matched" }
    }
    let update = await Category.update({ is_deleted: false , is_active:true, updatedBy:userData.id}, {
        where: {
            id: finduser.id,
            name: param.name
        }
    }).catch((err) => {
        return { error: err }
    });

    if (!update || update.error) {
        return { error: " Internal Server Error" }
    }

    return { data: "Your request succeessfully updated" }
}


//for unblock the category

async function checkactive(param) {
    let schema = joi.object({
        category_id: joi.number().max(100).min(0).required(),
        name: joi.string().max(30).min(1).required()
    }).options({ abortEarly: false })

    let check = schema.validate(param);
    if (!check || check.error) {
        let error = [];
        for (let a of check.error.details) {
            error.push(a.message)
        }
        return { error: error };
    }
    return { data: check.value }
}


async function activecat(param,userData) {
    let check = await checkactive(param).catch((err) => {
        return { error: err }
    })
    if (!check || check.error) {
        return { error: check.error }
    };

    let finduser = await Category.findOne({
        where: {
            id: param.category_id,
            name: param.name
        }
    }).catch((err) => {
        return { error: err }
    });
    if (!finduser || (finduser && finduser.error)) {
        return { error: "Id and Name not matched" }
    }
    let update = await Category.update({ is_active: true ,updatedBy:userData.id}, {
        where: {
            id: finduser.id,
        }
    }).catch((err) => {
        return { error: err }
    });

    if (!update || update.error) {
        return { error: " Internal Server Error" }
    }

    return { data: "Your request succeessfully updated" }
}


//for block the category

async function checkunactive(param) {
    let schema = joi.object({
        category_id: joi.number().max(100).min(0).required(),
        name: joi.string().max(30).min(1).required()
    }).options({ abortEarly: false })

    let check = schema.validate(param);
    if (!check || check.error) {
        let error = [];
        for (let a of check.error.details) {
            error.push(a.message)
        }
        return { error: error };
    }
    return { data: check.value }
}


async function unactivecat(param,userData) {
    let check = await checkunactive(param).catch((err) => {
        return { error: err }
    })
    if (!check || check.error) {
        return { error: check.error }
    };

    let finduser = await Category.findOne({
        where: {
            id: param.category_id,
            name: param.name
        }
    }).catch((err) => {
        return { error: err }
    });
    if (!finduser || (finduser && finduser.error)) {
        return { error: "Id and Name not matched" }
    }
    let update = await Category.update({ is_active: false , updatedBy:userData.id}, {
        where: {
            id: finduser.id
        }
    }).catch((err) => {
        return { error: err }
    });

    if (!update || update.error) {
        return { error: " Internal Server Error" }
    }

    return { data: "Your request succeessfully updated" }
}


module.exports = { category, updatecat,viewCategory, softdeletecat, softundeletecat, activecat, unactivecat }