let { login, addpermission, finduser, updateuser, permission, softdeleteuser, activeuser, userpermission, softundeleteuser, unactiveuser } = require("../controller/admin")
let { add_category, update_category,categoryView,delete_category, undelete_category, active_category, unactive_category } = require("../controller/category");
let { errorhandler } = require("../middleware/errorhandling")
let { add_product, update_product, find_product,active_product, inactive_product, delete_product, undelete_product } = require("../controller/product")
let express = require("express");
let cors = require("../init/cors")
let { auth } = require("../middleware/authpermission")
let { authenticate } = require("../middleware/auth")
require("express-async-errors")
let app = express();

app.use(cors);


app.post("/login", login) //for login of admin

app.get("/getuser", auth("getUser"), finduser) // get the all user
app.post("/assignpermission", auth("assignpermission"), addpermission) // to give the permission to user
app.delete("/delete_user", auth("deleteUser"), softdeleteuser) // for soft delete user
app.delete("/undelete_user", auth("deleteUser"), softundeleteuser)  //for undo soft delete

app.post("/activate_user", auth("deleteUser"), activeuser)  //for active user
app.post("/deactivate_user", auth("deleteUser"), unactiveuser)  //for unblock
app.get("/get_permission", auth("getpermission"), permission)  //getting all the permission
app.get("/get_permission_of_user", auth("getpermission"), userpermission)  //for getting permission of user

app.post("/update_user", auth("updateUser"), updateuser) //for updating user
app.post("/add_category", auth("addproduct"), add_category)   //adding category
app.put("/update_category", auth("updateproduct"), update_category)// update category

app.delete("/delete_category", auth("deleteproduct"), delete_category)// delete category
app.delete("/undelete_category", auth("deleteproduct"), undelete_category)// undo delete category
app.delete("/activate_category", auth("deleteproduct"), active_category)// unblock category
app.delete("/deactivate_category", auth("deleteproduct"), unactive_category)// block category

app.post("/add_product", auth("addproduct"), add_product) // for adding product
app.get("/view_product",find_product)
app.get("/view_category",categoryView)

app.put("/update_product", auth("updateproduct"), authenticate, update_product)// for updating product
app.put("/activate_product", auth("activeproduct"), authenticate, active_product)  // for unblock product
app.put("/deactivate_product", auth("activeproduct"), authenticate, inactive_product) // for block product
app.delete("/delete_product", auth("deleteproduct"), authenticate, delete_product) //for delete product

app.delete("/undelete_product", auth("deleteproduct"), authenticate, undelete_product) // for undelete the product



app.use(errorhandler)
module.exports = app