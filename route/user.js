let { register, login, my_profile_pic, update_profile_pic, forgetpassword, about_me, resetpassword, changepassword, updatemyprofile, deactivateme, activateme, addpermission, finduser, updateuser, permission, userpermission, softdeleteuser, softundeleteuser, activeuser, unactiveuser, exporUsert } = require("../controller/user")
let { add_category, update_category, categoryView, delete_category, undelete_category, active_category, unactive_category } = require("../controller/category");
let { errorhandler } = require("../middleware/errorhandling")
let { add_product, update_product, find_product, active_product, inactive_product, delete_product, undelete_product, exportProduct } = require("../controller/product")
let { placeOrder, orderView, orderAllview, payment, confirmOrder, cancelOrder, cancelOrderAdmin, delivery_status } = require("../controller/order")
let express = require("express");
let { addCart, updateCart, viewCart, removeCart } = require("../controller/cart")
let cors = require("../init/cors")
let { auth } = require("../middleware/authpermission")
let { authenticate } = require("../middleware/auth");

require("express-async-errors")
let app = express();

app.use(cors);

app.post("/login", login) //for login of admin
app.post("/register", register) //for login of admin

app.get("/about_me", auth("common"), about_me);
app.post("/my_profile_pic", auth("common"), my_profile_pic);
app.put("/update_my_profile_pic", auth("common"), update_profile_pic);

app.get("/view_product", find_product)
app.get("/view_category", categoryView)


app.post("/add_to_cart", auth("common"), addCart);
app.get("/view_cart", auth("common"), viewCart);
app.put("/update_cart", auth("common"), updateCart);
app.delete("/remove_from_cart", auth("common"), removeCart);

app.post("/place_order", auth("common"), placeOrder)
app.get("/view_my_order", auth("common"), orderView)
app.post("/payment", auth("common"), payment);

app.post("/confirm_order", auth("confirmOrder"), confirmOrder)
app.post("/cancel_my_order", auth("common"), cancelOrder)
app.post("/cancel_user_order", auth("cancelOrder"), cancelOrderAdmin)
app.post("/delivery_status", auth("makeDelivery"), delivery_status)

app.post("/change_password", auth("common"), changepassword);
app.post("/update_profile", auth("common"), updatemyprofile)

app.post("/forget_password", forgetpassword);
app.put("/reset_password", resetpassword);

app.delete("/deactivate_account", auth("common"), deactivateme);
app.put("/activate_account", activateme);


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
app.get("/view_product", find_product)
app.get("/view_category", categoryView)

app.put("/update_product", auth("updateproduct"), update_product)// for updating product
app.put("/activate_product", auth("activeproduct"), active_product)  // for unblock product
app.put("/deactivate_product", auth("activeproduct"), inactive_product) // for block product
app.delete("/delete_product", auth("deleteproduct"), delete_product) //for delete product
app.delete("/undelete_product", auth("deleteproduct"), undelete_product)// for undelete the product

app.get("/view_all_order", auth("viewOrder"), orderAllview)

app.get("/export_user", auth("getUser"), exporUsert) // for get data of user in excel file
app.get("/export_product", auth("addproduct"), exportProduct) // for get data of product in excel file





app.use(errorhandler)


module.exports = app