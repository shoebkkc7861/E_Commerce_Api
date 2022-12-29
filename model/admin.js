let joi = require("joi");
let {User_permissiion,Op} = require("../schema/user_permission");
let Permission = require("../schema/permission")
let { User } = require("../schema/user");
let bcrypt = require("bcrypt")
let jwt = require("jsonwebtoken")
const { request } = require("express");
const { param } = require("express/lib/router");
const { findOne } = require("../schema/user_permission");
const { QueryTypes } = require("sequelize");

//admin login
async function checklogin(param) {
    let schema = joi.object({
        username: joi.string().max(30).min(3).email().required(),
        password: joi.string().max(200).min(3).required(),
    }).options({
        abortEarly: false
    });

    let check = schema.validate(param)
    if (check.error) {
        let error = [];
        for (let err of check.error.details) {
            error.push(err.message)
        };
        return { error: error }
    }
    return { data: check.value }
}

async function loginadmin(param) {
    let check = await checklogin(param).catch((err) => {
        return { error: err }
    });
    if (!check || check.error) {
        return { error: check.error }
    }
    let checkuser = await User.findOne({ where: { username: param.username } }).catch((err) => {
        return { error: err }
    })
    if (!checkuser || checkuser.error) {
        return { error: "Username Not Found" }
    }

    let checkpass = await bcrypt.compare(param.password, checkuser.password).catch((err) => {
        return { error: err }
    });
    if (!checkpass || checkpass.error) {
        return { error: "Username & password Invalid" }
    }
    let key = "Mohif9232";
    let token = jwt.sign({ id: checkuser.id }, key, { expiresIn: "1d" })
    if (!token || token.error) {
        return { error: "Internal Server Error" }
    }
    return { data: "Login succeefully", token }
}


//get all user
async function checkbody(param) {
    let schema = joi.object({
        user_id: joi.number().max(300).min(0),
        name: joi.string().max(30).min(1),
        username: joi.string().max(30).min(3),
    }).options({
        abortEarly: false
    });
    console.log(param)
    let check = schema.validate(param)
    if (check.error) {
        let error = [];
        for (let err of check.error.details) {
            error.push(err.message)
        };
        return { error: error }
    }
    return { data: check.value }
}
async function findall(param) {
    let check = await checkbody(param).catch((err) => {
        return { error: err }
    });
    if (!check || check.error) {
        return { error: check.error }
    }
    let query = {};
    if (param.user_id) {
        query = { where: { id: param.id } }
    }
    if (param.name) {
        query = { where: { name: param.name } }
    }
    if (param.username) {
        query = { where: { username: param.username } }
    }

    let alluser = await User.findAll(query).catch((err) => {
        return { error: err }
    })
    console.log(alluser)
    if (!alluser || (alluser && alluser.error) || alluser.length==0) {
        return { error: "Cant find user" }
    }
    return { data: alluser }
};


//for assigning permission

async function check(param) {
    let schema = joi.object({
        user_id: joi.number().max(30).min(0).required(),
        permission: joi.array().items(joi.number().min(0)).required()
    }).options({
        abortEarly: false
    });

    let check = schema.validate(param)
    if (check.error) {
        let error = [];
        for (let err of check.error.details) {
            error.push(err.message)
        };
        return { error: error }
    }
    return { data: check.value }
}

async function assignpermission(param,userData) {
    let checkbody = await check(param).catch((err) => {
        return { error: err }
    })
    if (!checkbody || (checkbody && checkbody.error)) {
        return { error: checkbody.error }
    };
    let user = await User.findOne({ where: { id: param.user_id } }).catch((err) => {
        return { error: err }
    });
    
    if (!user || (user && user.error)) {
        return { error: " ID not Matched" }
    }

    let checkper = await Permission.findAll({where:{
        id:{[Op.in]:param.permission}
    }}).catch((err)=>{
        return { error: err}
    })
    if ( !checkper || checkper.error){
        return { error: checkper.error}
    }
    if(checkper.length != param.permission.length){
        return { error: "Invalid Permissions"}
    }
    let pers = [];
    for (let i of param.permission) {
        pers.push({ user_id: user.id, permission_id: i , createdBy:userData.id})
    }
    console.log(pers)
    let perData = await User_permissiion.bulkCreate(pers).catch((err) => {
        return { error: err }
    });
    console.log(perData)
    if (!perData || (perData && perData.error)) {
        return { error: "Internal Server Error" }
    }
    return { data: "sucess" }

}


//for update user

async function checkupdate(param) {
    let schema = joi.object({
        user_id: joi.number().max(300).min(0).required(),
        name: joi.string().max(30).min(1),
        username: joi.string().max(30).min(3),
        mobile_no: joi.string().max(10).min(4)
    }).options({
        abortEarly: false
    });

    let check = schema.validate(param)
    if (check.error) {
        let error = [];
        for (let err of check.error.details) {
            error.push(err.message)
        };
        return { error: error }
    }
    return { data: check.value }
}

async function update(param,userData) {
    let check = await checkupdate(param).catch((err) => {
        return { error: err }
    });
    if (!check || check.error) {
        return { error: check.error }
    }
    let finduser = await User.findOne({ where: { id: param.user_id } }).catch((err) => {
        return { error: err }
    })
    if (!finduser || finduser.error) {
        return { error: "Id not found" }
    }
    let updateuser = await User.update({
        name: param.name,
        username: param.username,
        mobile_no: param.mobile_no,
        updatedBy:userData.id
    }, { where: { id: finduser.id } }).catch((err) => {
        return { error: err }
    });
    if (!updateuser || updateuser.error) {
        return { error: " Internal Server Error" }
    }
    return { data: "Updated Successfully" }
}


//get the permissions of the user

async function checkuser(param) {
    let schema = joi.object({
        user_id: joi.number().max(100).min(1).required(),
        name: joi.string().max(30).min(1)
    }).options({
        abortEarly: false
    });

    let check = schema.validate(param)
    if (check.error) {
        let error = [];
        for (let err of check.error.details) {
            error.push(err.message)
        };
        return { error: error }
    }
    return { data: check.value }
}
async function getpermission2(param) {
    let jo = await checkuser(param).catch((err) => {
        return { error: err }
    });
    if (!jo || jo.error) {
        return { error: jo.error }
    }

    let check = await User.findOne({ where: { id: param.user_id } }).catch((err) => {
        return { error: err }
    });
    console.log(check)
    if (!check || check.error) {
        return { error: "id not found" }
    }
    let [result] = await User.sequelize.query("SELECT user.id , user.name , GROUP_CONCAT(permission.permission) AS permission FROM user LEFT JOIN user_permission ON user.id = user_permission.user_id LEFT JOIN permission ON permission.id=user_permission.permission_id WHERE user.id = :key GROUP BY user.id", {
        replacements: { key: param.user_id },
        type: QueryTypes.SELECT
    }).catch((err) => {
        return { error: err }
    })
    let permission = result
    if (!permission || permission.error) {
        return { error: permission.error }

    }
    return { data: permission }
}


//get all the permission from the table

async function getpermission(param) {

    let [result] = await User.sequelize.query("SELECT * FROM permission").catch((err) => {
        return { error: err }
    })
    let permission = result
    if (!permission || permission.error) {
        return { error: permission.error }

    }
    console.log(permission)
    return { data: permission }
}

//for soft delete the user

async function checkdelete(param) {
    let schema = joi.object({
        user_id: joi.number().max(100).min(0).required(),
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




async function softdelete(param,userData) {
    let check = await checkdelete(param).catch((err) => {
        return { error: err }
    })
    if (!check || check.error) {
        return { error: check.error }
    };

    let finduser = await User.findOne({
        where: {
            id: param.user_id,
            name:param.name
        }
    }).catch((err) => {
        return { error: err }
    });
    if (!finduser || (finduser && finduser.error)) {
        return { error: "Id and Name not matched" }
    }
    let update = await User.update({ is_deleted: true , is_active:false, updatedBy:userData.id}, {
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


//for undo the soft delete

async function checkundelete(param) {
    let schema = joi.object({
        user_id: joi.number().max(100).min(0).required(),
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


async function softundelete(param,userData) {
    let check = await checkundelete(param).catch((err) => {
        return { error: err }
    })
    if (!check || check.error) {
        return { error: check.error }
    };

    let finduser = await User.findOne({
        where: {
            id: param.user_id,
            name:param.name
        }
    }).catch((err) => {
        return { error: err }
    });
    if (!finduser || (finduser && finduser.error)) {
        return { error: "Id and Name not matched" }
    }
    let update = await User.update({ is_deleted: false , is_active:true, updatedBy:userData.id}, {
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


//for unblock the block user

async function checkactive(param) {
    let schema = joi.object({
        user_id: joi.number().max(100).min(0).required(),
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


async function active(param,userData) {
    let check = await checkactive(param).catch((err) => {
        return { error: err }
    })
    if (!check || check.error) {
        return { error: check.error }
    };

    let finduser = await User.findOne({
        where: {
            id: param.user_id,
            name:param.name
        }
    }).catch((err) => {
        return { error: err }
    });
    if (!finduser || (finduser && finduser.error)) {
        return { error: "Id and Name not matched" }
    }
    let update = await User.update({ is_active: true , updatedBy:userData.id}, {
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

//for block the user

async function checkunactive(param) {
    let schema = joi.object({
        user_id: joi.number().max(100).min(0).required(),
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


async function unactive(param,userData) {
    let check = await checkunactive(param).catch((err) => {
        return { error: err }
    })
    if (!check || check.error) {
        return { error: check.error }
    };

    let finduser = await User.findOne({
        where: {
            id: param.user_id,
            name:param.name
        }
    }).catch((err) => {
        return { error: err }
    });
    if (!finduser || (finduser && finduser.error)) {
        return { error: "Id and Name not matched" }
    }
    let update = await User.update({ is_active: false , updatedBy:userData.id}, {
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

module.exports = { loginadmin, assignpermission, findall, update, getpermission, getpermission2, softdelete, softundelete, unactive, active }