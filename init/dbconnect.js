const { Sequelize, DataTypes, Model, QueryTypes, Op } = require("sequelize")
require("dotenv").config()
let sequelize = new Sequelize(process.env.DB)

sequelize.authenticate().then(() => {
    console.log("Connected To Database")
}).catch(() => {
    console.log("Not Connected to database")
})

module.exports = {
    sequelize,
    DataTypes,
    Model,
    QueryTypes,
    Op
}