let Product = require("../schema/product");
let joi = require("joi");
let {Category,Op}= require("../schema/category")
let Product_category = require("../schema/product_category")
const { array } = require("joi");
const { findAll } = require("../schema/product");

// for adding product in database
function productadd(param) {
    let schema = joi.object({
        name: joi.string().max(30).min(1).required(),
        quantity: joi.number().required(),
        price: joi.number().required(),
        discount: joi.number().required(),
        // discounted_price: joi.string().max(100).min(0).required(),
        stock_alert: joi.number().max(1000).min(0).required(),
        category: joi.array().items(joi.number().min(0)).required()
    }).options({ abortEarly: false })
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

async function addproduct(param, imagePath, loginUser) {
    let check = await productadd(param);
    if (check.error) {
        return { error: check.error }
    }
    let findproduct = await Product.findOne({ where: { name: param.name } }).catch((err) => {
        return { error: err }
    });
    if (findproduct) {
        return { error: "This Product is already existed" }
    }
    console.log(param)
    let category = param.category;
    delete param.category;

    let checkCategory= await Category.findAll({where:{id:{[Op.in]:category}}}).catch((err)=>{
        return { error: err}
    });

    if(!checkCategory || checkCategory.error){
        return {error:checkCategory}
    }
    
    if(checkCategory.length != category.length){
        return { error: "Please enter Proper categories"}
    }
   
   let newprice= (param.price - param.discount);
   
    let addproduct = await Product.create({
        name: param.name,
        quantity: param.quantity,
        price: param.price,
        discount: param.discount,
        discounted_price: newprice,
        img_path: imagePath,
        stock_alert: param.stock_alert,
        is_active: true,
        is_deleted: false,
        createdBy: loginUser.id
    }).catch((err) => {
        return { error: err }
    })
    if (!addproduct || addproduct.error) {
        return { error: "Internal Server Error" }
    }

    let category_id = [];
    for (let cat of category) {
        category_id.push({ category_id: cat, product_id: addproduct.id ,createdBy:loginUser.id })
    }
    let add = await Product_category.bulkCreate(category_id).catch((err) => {
        return { error: err }
    })
    if (!add || add.error) {
        return { error: "Internal server Error" }
    }
    return { data: "product added successfully" }

}


// for updating product 


function productupdate(param) {
    let schema = joi.object({

        product_id: joi.number().max(100).min(0).required(),
        name: joi.string().max(30).min(1),
        quantity: joi.number(),
        price: joi.number(),
        discount: joi.string().max(100).min(0),
        stock_alert: joi.string().max(1000).min(0)
    }).options({ abortEarly: false })
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

async function updateproduct(param, imagePath, userData) {
    let check = await productupdate(param)
    if (check.error || !check) {
        return { error: check.error }
    } let findpro = await Product.findOne({ where: { id: param.product_id } }).catch((err) => {
        return { error: err }
    })
    if (!findpro || findpro.error) {
        return { error: "Product not found" }
    }
    let newprice= (param.price - param.discount);
    let updateproduct = await Product.update({
        name: param.name,
        quantity: param.quantity,
        price: param.price,
        discount: param.discount,
        discounted_price: newprice,
        img_path: imagePath,
        stock_alert: param.stock_alert,
        updatedBy: userData.id
    }, { where: { id: findpro.id } }).catch((err) => {
        return { error: err }
    });
    if (!updateproduct || updateproduct.error) {
        return { error: "Internal Server Error" }
    }
    return { data: "Updated Succeessfully" }
}


//for block product

function productinactive(param) {
    let schema = joi.object({
        product_id: joi.number().max(100).min(0).required(),
        name: joi.string().max(100).min(0).required()

    }).options({ abortEarly: false })
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

async function inactiveproduct(param,userData) {
    let check = await productinactive(param)
    if (check.error) {
        return { error: check.error }
    };
    let findpro = await Product.findOne({ where: { id: param.product_id, name: param.name } }).catch((err) => {
        return { error: err }
    })
    if (!findpro || findpro.error) {
        return { error: "Id and Name not matched" }
    }
    let updatepro = await Product.update({ is_active: false , updatedBy:userData.id}, { where: { id: findpro.id } }).catch((err) => {
        return { error: err }
    });
    if (!updatepro || updatepro.error) {
        return { error: "server error" }
    }
    return { data: "product block succeesfuuly" }
}

//for unblock the product


function productactive(param) {
    let schema = joi.object({
        product_id: joi.number().max(100).min(0).required(),
        name: joi.string().max(100).min(0).required()

    }).options({ abortEarly: false })
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

async function activeproduct(param,userData) {
    let check = await productactive(param)
    if (check.error) {
        return { error: check.error }
    };
    let findpro = await Product.findOne({ where: { id: param.product_id, name: param.name } }).catch((err) => {
        return { error: err }
    })
    if (!findpro || findpro.error) {
        return { error: "Id and Name not matched" }
    }
    let updatepro = await Product.update({ is_active: true , updatedBy:userData.id}, { where: { id: findpro.id } }).catch((err) => {
        return { error: err }
    });
    if (!updatepro || updatepro.error) {
        return { error: "server error" }
    }
    return { data: "product unblock succeesfuuly" }
}


// for soft delete the product


function productdelete(param) {
    let schema = joi.object({
        product_id: joi.number().max(100).min(0).required(),
        name: joi.string().max(300).min(1).required()

    }).options({
        abortEarly: false
    })
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

async function deleteproduct(param,userData) {
    console.log(param)
    let check = productdelete(param)
    if (check.error) {
        return { error: check.error }
    };
    console.log(check)
    let findpro = await Product.findOne({ where: { id: param.product_id, name: param.name } }).catch((err) => {
        return { error: err }
    })
    if (!findpro || findpro.error) {
        return { error: "Id and Name not matched" }
    }
    let updatepro = await Product.update({ is_deleted: true ,updatedBy: userData.id}, { where: { id: findpro.id } }).catch((err) => {
        return { error: err }
    });
    if (!updatepro || updatepro.error) {
        return { error: "product not found" }
    }
    return { data: "product deleted succeesfuuly" }
}


//for undo the soft delete


function productundelete(param) {
    let schema = joi.object({
        product_id: joi.number().max(100).min(0).required(),
        name: joi.string().max(100).min(0).required()

    }).options({ abortEarly: false })
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

async function undeleteproduct(param,userData) {
    let check = await productundelete(param)
    if (check.error) {
        return { error: check.error }
    };
    let findpro = await Product.findOne({ where: { id: param.product_id, name: param.name } }).catch((err) => {
        return { error: err }
    })
    if (!findpro || findpro.error) {
        return { error: "Id and Name not matched" }
    }
    let updatepro = await Product.update({ is_deleted: false , updatedBy:userData.id}, { where: { id: findpro.id } }).catch((err) => {
        return { error: err }
    });
    if (!updatepro || updatepro.error) {
        return { error: "product not found" }
    }
    return { data: "product undeleted succeesfuuly" }
}


//for view the product


function productfind(param) {
    let schema = joi.object({
        product_id: joi.number().max(100).min(0),
        name: joi.string().max(100).min(0)

    }).options({ abortEarly: false })
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

async function findproduct(param) {
    let check = await productfind(param);
    if (!check || check.error) {
        return { error: check.error }
    }
    let query = {};
    if (param.product_id) {
        query = { where: { id: param.product_id } }
    }
    if (param.name) {
        query = { where: { name: param.name } }
    }
    let find = await Product.findAll(query).catch((err) => {
        return { error: err }
    })
    console.log(find[0].img_path)
    let url= `<a href = ${find[0].img_path}>img</a>`
    console.log(url)

    if (!find || (find && find.error) || find.length == 0) {
        return { error: "product for this id or this name is not available" }
    }

    return { data: find }
}


module.exports = {
    addproduct,
    updateproduct,
    activeproduct, //for unblock
    inactiveproduct, //for block
    deleteproduct, //for soft delete
    undeleteproduct, //for undo delete
    findproduct  //view product 
}