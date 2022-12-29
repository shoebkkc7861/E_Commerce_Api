let {register,login, about_me,my_profile_pic,update_profile_pic,forgetpassword,resetpassword,changepassword,updatemyprofile,deactivateme}=require("../controller/user")
let {categoryView}=require("../controller/category")
let {find_product}=require("../controller/product")
let {errorhandler}=require("../middleware/errorhandling")
let {authenticate}=require("../middleware/auth")
let {auth}=require("../middleware/authpermission")
let cors= require("../init/cors")
let express=require("express");
require("express-async-errors")
let app= express();

app.use(cors);
app.post("/login", login) //for login of admin
app.post("/register", register) //for login of admin

app.get("/about_me",auth("common"),about_me);
app.post("/my_profile_pic",auth("common"),my_profile_pic);
app.put("/update_my_profile_pic",auth("common"),update_profile_pic);

app.get("/view_product",find_product)
app.get("/view_category",categoryView)


app.post("/change_password",auth("common"),changepassword);
app.post("/update_profile",auth("common"),updatemyprofile)

app.post("/forget_password",forgetpassword);
app.put("/reset_password",resetpassword);

app.put("/deactivate_account",auth("common"),deactivateme);



app.use(errorhandler)
module.exports=app