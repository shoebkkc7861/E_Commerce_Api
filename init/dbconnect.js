const {Sequelize,DataTypes,Model,QueryTypes,Op}=require("sequelize")
let sequelize= new Sequelize("mysql://root:@localhost/e_commerce")

sequelize.authenticate().then(()=>{
    console.log("Connected To Database")
}).catch(()=>{
    console.log("Not Connected to database")
})

module.exports={
    sequelize,
    DataTypes,
    Model,
    QueryTypes,
    Op
}