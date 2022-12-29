let {sequelize,DataTypes,Model,Op}=require("../init/dbconnect")

class Category extends Model{}

Category.init({
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
    description:{
        type:DataTypes.STRING,
        allowNull:false
    },
    pid:{
        type:DataTypes.INTEGER,
        allowNull:false
    },
    createdBy:{
        type:DataTypes.INTEGER,
        allowNull:false
    },
    updatedBy:{
        type:DataTypes.INTEGER,
        allowNull:true
    },
    is_active:{
        type:DataTypes.INTEGER,
        allowNull:false
    },
    is_deleted:{
        type:DataTypes.INTEGER,
        allowNull:false
    }
},{
    modelName:"Category",
    tableName:"category",
    sequelize
})


module.exports={Category,Op}