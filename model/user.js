let { User } = require("../schema/user")
let User_permissiion = require("../schema/user_permission")
let joi = require("joi");
let bcrypt = require("bcrypt");
let jwt = require("jsonwebtoken");
let mail = require("nodemailer");
let randomstring = require("randomstring");
let { email } = require("../helper/email");
const { sequelize, QueryTypes } = require("../init/dbconnect");


//for register of user 


async function checkregister(param) {
    let schema = joi.object({
        name: joi.string().max(30).min(3).required(),
        username: joi.string().max(30).min(3).required(),
        password: joi.string().max(200).min(3).required(),
        mobile_no: joi.string().max(30).min(4).required()
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

async function registerpatient(param) {
    let valid = await checkregister(param).catch((err) => {
        return { error: err }
    })
    if (!valid || valid.error) {
        return { error: valid.error }
    }

    let checkpatient = await User.findOne({ where: { username: param.username } }).catch((error) => {
        return { error }
    })
    console.log(checkpatient)
    if (checkpatient) {
        return { error: "This user is already existed" }
    }
    param.password = await bcrypt.hash(param.password, 10).catch((err) => {
        return { error: err }
    })
    let adduser = await User.create({
        name: param.name,
        username: param.username,
        password: param.password,
        mobile_no: param.mobile_no,
        is_deleted: false,
        is_active: true
    }).catch((err) => {
        return { error: err }
    })

    if (!adduser || adduser.error) {
        return { error: "Internal Server Error" }
    }
    console.log(adduser)
    let givepermission = await User_permissiion.create({
        user_id: adduser.id,
        permission_id: 9
    }).catch((err) => {
        return { error: err }
    });
    if (!givepermission || givepermission.error) {
        return { error: givepermission.error }
    }
    return { data: "registered Successfully", adduser }
}

//for login of user

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

async function loginpatient(param) {
    let check = await checklogin(param).catch((err) => {
        return { error: err }
    });
    if (!check || check.error) {
        return { error: check.error }
    }
    let checkpatient = await User.findOne({ where: { username: param.username } }).catch((err) => {
        return { error: err }
    })
    if (!checkpatient || checkpatient.error) {
        return { error: "Username Not Found" }
    }
    let info = await sequelize.query("SELECT user.is_active, user.is_deleted FROM user WHERE id= :data", {
        replacements: { data: checkpatient.id },
        type: QueryTypes.SELECT
    }).catch((err) => {
        return { error: err }
    })
    if (!info || info.error) {
        return { error: info.error }
    }
    if (info[0].is_deleted == 1) {
        return { error: "Your account is temporary deactivated please try again later" }
    }
    if (info[0].is_active == 0) {
        return { error: "Your account is temporaryy blocked please try again later" }
    }
    let checkpass = await bcrypt.compare(param.password, checkpatient.password).catch((err) => {
        return { error: err }
    });
    if (!checkpass || checkpass.error) {
        return { error: "Username & password Invalid" }
    }
    let key = "Mohif9232";
    let token = jwt.sign({ id: checkpatient.id }, key, { expiresIn: "1d" })
    if (!token || token.error) {
        return { error: "Internal Server Error" }
    }
    return { data: "Login succeefully", token }
}
//for adding profile pic

async function addprofile(imagePath, loginUser) {
    let finduser = await User.findOne({ where: { id: loginUser.id } }).catch((err) => {
        return { error: err }
    });
    if (!finduser || finduser.error) {
        return { error: "Something Went Wrong" }
    }
    let addImage = await User.update({ profile_pic_path: imagePath }, { where: { id: finduser.id } }).catch((err) => {
        return { error: err }
    });
    if (!addImage || addImage.error) {
        return { error: "something went wrong" }
    }
    return { data: "profile pic uploaded successfullyy" }
}

//for updating profile pic

async function updateProfile(imagePath, loginUser) {
    let find = await User.findOne({ where: { id: loginUser.id } }).catch((err) => {
        return { error: err }
    });
    if (!find || find.error) {
        return { error: "Something is not correct" }
    };
    let updatepic = await User.update({ profile_pic_path: imagePath }, { where: { id: find.id } }).catch((err) => {
        return { error: err }
    });
    if (!updatepic || updatepic.error) {
        return { error: "Internal Server Error" }
    }
    return { data: "Your Profile pic updated successfully...." }
}

//for get me

async function getme(param, userData) {

    let findme = await User.findOne({ attributes: ["name", "username", "mobile_no", "profile_pic_path"], where: { id: userData.id } }).catch((err) => {
        return { error: err }
    });
    if (!findme || findme.error) {
        return { error: "Internal Server Error" }
    }
    return { data: findme }
}
//for forget password

async function checkforget(param) {
    let schema = joi.object({
        username: joi.string().max(300).min(1).required()
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

async function forget(param) {
    let check = await checkforget(param).catch((err) => {
        return { error: err }
    })
    console.log(check)
    if (!check || check.error) {
        return { error: check.error }
    }
    let getuser = await User.findOne({ where: { username: param.username } }).catch((err) => {
        return { error: err }
    })
    if (!getuser || getuser.error) {
        return { error: "username not found" }
    }
    let token = randomstring.generate(10)
    let addtoken = await User.update({ token: token }, { where: { id: getuser.id } }).catch((err) => {
        return { error: err }
    })
    if (!addtoken || addtoken.error) {
        return { error: addtoken.error }
    }
    let mailoption = {
        from: "mohif.waghu@somaiya.edu",
        to: getuser.username,
        subject: "forget password token",
        text: "for reset your password please use this token:" + token
    };
    let sendmail = await email(mailoption).catch((err) => { return { error: err } });
    if (!sendmail || sendmail.error) {
        return { error: sendmail }
    }
    console.log(sendmail)
    return { data: sendmail }

}

//for reset password

async function checkreset(param) {
    let schema = joi.object({
        token: joi.string().max(200).min(1).required(),
        newpassword: joi.string().max(20).min(3).required()
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
async function reset(param) {
    let check = await checkreset(param).catch((err) => {
        return { error: err }
    })
    if (!check || check.error) {
        return { error: check.error }
    }
    let verifytoken = await User.findOne({ where: { token: param.token } }).catch((err) => {
        return { error: err }
    });
    if (!verifytoken || (verifytoken && verifytoken.error)) {
        return { error: "Token not valid please provide valid token" }

    }

    let resetpass = await User.update({ password: await bcrypt.hash(param.newpassword, 10) }, { where: { id: verifytoken.id } }).catch((err) => {
        return { error: err }
    });
    if (!resetpass || (resetpass && resetpass.error)) {
        return { error: resetpass.error }
    }

    let emptytoken = await User.update({ token: "" }, { where: { id: verifytoken.id } }).catch((err) => {
        return { error: err }
    })
    if (!emptytoken || emptytoken.error) {
        return { error: "Internal Server Error" }
    }
    return { data: "Password reset successfully", resetpass }

}


//for change password

async function changepass(param) {
    let schema = joi.object({
        password: joi.string().max(20).min(3).required(),
        newpassword: joi.string().max(20).min(3).required()
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

async function change(param, userData) {
    let check = await changepass(param).catch((err) => {
        return { error: err }
    });
    if (!check || check.error) {
        return { error: check.error }
    }
    let findpass = await User.findOne({ where: { id: userData.id } }).catch((err) => {
        return { error: err }
    })
    if (!findpass || findpass.error) {
        return { error: "username is incorrect" }
    };
    let checkpass = await bcrypt.compare(param.password, findpass.password).catch((err) => {
        return { error: err }
    });

    if (!checkpass || (checkpass && checkpass.error)) {
        return { error: "Invalid Username & password" }
    }
    let changepassword = await User.update({ password: await bcrypt.hash(param.newpassword, 10) }, {
        where: {
            id: findpass.id
        }
    }).catch((err) => {
        return { error: err }
    });
    console.log(changepassword)

    if (!changepassword || changepassword.error) {
        return { error: "internal server error" }
    }
    return { data: "password changed successfully" }
}


//for update user by themselves

async function checkupdate(param) {
    let schema = joi.object({
        name: joi.string().max(30).min(2),
        username: joi.string().max(30).min(3),
        mobile_no: joi.string().max(11).min(5)
    }).options({
        abortEarly: false
    });

    let check = schema.validate(param)
    if (check.error) {
        let error = [];
        for (let err of check.error.details) {
            error.push(err.message)
        }
        return { error: check.error }
    }
    return { data: check.value }
}

async function updateprofile(param, userData) {
    let check = await checkupdate(param).catch((err) => {
        return { error: err }
    })
    if (!check || check.error) {
        return { error: check.error }
    }
    let finduser = await User.findOne({ where: { id: userData.id } }).catch((err) => {
        return { error: err }
    });
    if (!finduser || (finduser && finduser.error)) {
        return { error: "ID not found" }
    }
    let updatename = await User.update(param, { where: { id: finduser.id } }).catch((err) => {
        return { error: err }
    });
    if (!updatename || (updatename && updatename.error)) {
        return { error: "Internal Server Error" }
    }
    console.log(updatename)
    return { data: " Your Profile Updated Successfully", updatename }
}


//for deactivate account



async function deactivate(param, userData) {
    let finduser = await User.findOne({ where: { id: userData.id } }).catch((err) => {   //id ke jagah token baadme
        return { error: err }
    });
    if (!finduser || (finduser && finduser.error)) {
        return { error: "Invalid Token" }
    }
    let update = await User.update({ is_deleted: 1 }, { where: { id: finduser.id } }).catch((err) => {
        return { error: err }
    });
    console.log(update)
    if (!update || update.error) {
        return { error: "Internal Server Error" }
    }
    return { data: "You are deactivate successfully for activation again please login again" }

}

module.exports = {
    registerpatient,
    loginpatient,
    addprofile,
    updateProfile,
    getme,
    forget,
    reset,
    change,
    updateprofile,
    deactivate
}