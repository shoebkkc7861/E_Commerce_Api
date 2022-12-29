let {sequelize,DataTypes,Model,QueryType}=require("../init/dbconnect")

class Product_category extends Model{}


Product_category.init({
    id:{
        type:DataTypes.INTEGER,
        primaryKey:true,
        autoIncrement:true,
        allowNull:false
    },
    product_id:{
        type:DataTypes.INTEGER,
        allowNull:false
    },
    category_id:{
        type:DataTypes.INTEGER,
        allowNull:false
    },
    createdBy:{
        type:DataTypes.INTEGER,
        allowNull:false
    }
},{
    modelName:"Product_category",
    tableName:"category_product",
    sequelize
})

module.exports=Product_category