let {sequelize,DataTypes,Model,Op}=require("../init/dbconnect")

class Product extends Model{}

Product.init({
    id:{
        type:DataTypes.INTEGER,
        primaryKey:true,
        autoIncrement:true,
        allowNull:false
    },
    name:{
        type:DataTypes.STRING,
        allowNull:false
    },
    quantity:{
        type:DataTypes.INTEGER,
        allowNull:false
    },
    price:{
        type:DataTypes.INTEGER,
        allowNull:false
    },
    discount:{
        type:DataTypes.INTEGER,
        allowNull:false
    },
    discounted_price:{
        type:DataTypes.INTEGER,
        allowNull:false
    },
    img_path:{
        type:DataTypes.STRING,
        allowNull:true
    },
    stock_alert:{
        type:DataTypes.INTEGER,
        allowNull:false
    },
    is_active:{
        type:DataTypes.BOOLEAN,
        allowNull:false
    },
    is_deleted:{
        type:DataTypes.BOOLEAN,
        allowNull:false
    },
    createdBy:{
        type:DataTypes.INTEGER,
        allowNull:false
    },
    updatedBy:{
        type:DataTypes.INTEGER,
        allowNull:true
    }
},{
    tableName:"product",
    modelName:"Product",
    sequelize
})

module.exports= {Product,Op}