let Cart = require("../schema/cart")
let { Product, Op } = require("../schema/product")
let joi = require("joi")
const { sequelize, QueryTypes } = require("../init/dbconnect")
const { object } = require("joi")
const { get } = require("../init/cors")
const { getpermission } = require("./user")

function cartJoi(param) {
    let schema = joi.object({
        product_id: joi.number().min(1).required(),
        quantity:joi.number().min(0).required()
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

async function cartAdd(param, userData) {
    let check = cartJoi(param)
    if (!check || check.error) {
        return { error: check.error }
    }
    let find = await Cart.findOne({ where: { user_id: userData.id, product_id: param.product_id } }).catch((err) => {
        return { error: err }
    })
    if (find) {
        return { error: " This product is already in your cart please choose another" }
    }
    let add = await Cart.create({ user_id: userData.id, product_id: param.product_id , quantity:param.quantity}).catch((err) => {
        return { error: err }
    })
    if (!add || add.error) {
        return { error: " Internal Server error" }
    }
    return { data: " product Added to cart successfullyy..." }
}

function updateJoi(param) {
    let schema = joi.object({
        product_id: joi.number().min(1).required(),
        quantity:joi.number().min(0).max(5).required()
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

async function cartUpdate(param,userData){
    let check = updateJoi(param)
    if(!check || check.error){
        return { error: check.error}
    }
    let find = await Cart.findOne({where:{product_id:param.product_id,
      user_id:userData.id}}).catch((err)=>{
        return { error: err}
      })
      if(!find || find.error){
        return { error : " Internal Server Error"}
      }
      let update= await Cart.update({quantity:param.quantity},{where:{id:find.id}}).catch((err)=>{
        return { error: err}
      })
      if(!update || update.error){
      return { error: "OOps something went wrong please try again later"}
      }
      return { data : " Ok"}
}

async function cartView(userData) {

    let find = await Cart.findAll({ where: { user_id: userData.id } }).catch((err) => {
        return { error: err }
    })
    if (!find || find.error) {
        return { error: "internal  server error" }
    }
    // let p_pid = [];
    // for (let a of find) {
    //     p_pid.push(a.product_id)
    // }
    // let get = await Product.findAll({ attributes: ["name", "price", "discounted_price", "img_path"], where: { id: { [Op.in]: p_pid } } }).catch((err) => {
    //     return { error: err }
    // })
    // if (!get || get.error) {
    //     return { error: get.error }
    // }
    // return { data: get }

    let getProduct= await sequelize.query("SELECT product.name, product.price, product.discount ,product.discounted_price, product.img_path, cart.quantity FROM product LEFT JOIN cart ON product.id = cart.product_id LEFT JOIN user ON user.id = cart.user_id where user.id = :key", {
        replacements:{key:userData.id},
        type:QueryTypes.SELECT
    }).catch((err)=>{
        return { error: err}
    });
    // getProduct.forEach((value)=>{
    //     value.total_price=0
    // })
    let  final_price=0
    for(let a in getProduct){
        getProduct[a].total_price=getProduct[a].discounted_price * getProduct[a].quantity;
        final_price=(getProduct[a].total_price + final_price)
    }
   
    getProduct.push({final_price:final_price})
   
    if(!getProduct || getProduct.error){
        return { error:"Internal server error"}
    }
    if(getProduct.length == 0){
        return { data: "Use dont have anything in your cart "}
    }
    return { data: getProduct}
}

function removeCartJoi(param) {
    let schema = joi.object({
        product_id: joi.number().min(1).required()
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

async function cartRemove(param, userData) {
    let check = removeCartJoi(param)
    if (!check || check.error) {
        return { error: check.error }
    }
    let find = await Cart.findOne({
        where: {
            [Op.and]: [{
                product_id: param.product_id,
                user_id: userData.id
            }]
        }
    }).catch((err) => {
        return { error: err }
    })
    if (!find || find.error) {
        return { error: "Your cart dont have this product" }
    }
    let remove = await Cart.destroy({
        where: {
            // [Op.and]: [{
            //     product_id: param.product_id,
            //     user_id: userData.id
            // }]
            id:find.id
        }
    }).catch((err) => {
        return { error: err }
    })
    if (!remove || remove.error) {
        return { error: "internal server error" }
    }
    return { data: "Product successfullyy removed from your cart" }
}


module.exports = { cartAdd,cartUpdate ,cartView , cartRemove}