const { Sequelize, DataTypes, Model, QueryTypes, Op } = require("sequelize")
require("dotenv")
let sequelize = new Sequelize("mysql://root:MyStrongPassword1234$@localhost:/Ecommerce")

sequelize.authenticate().then(() => {
    console.log("Connected To Database")
}).catch((err) => {
    console.log(err)
})

module.exports = {
    sequelize,
    DataTypes,
    Model,
    QueryTypes,
    Op
}