//const { Router } = require("express");
let express = require("express");
let app = express();
let { logger } = require("./init/winston")
let route = require("./route/user")
let { categoryView } = require("./controller/category")
let { find_product } = require("./controller/product")
let { register, login } = require("./controller/user")
require("dotenv").config()
const PORT = process.env.PORT


app.use(express.json());
app.use(express.urlencoded({ extended: true }))

logger.error("error");

app.post("api/v1/login", login) //for login of admin
app.post("api/v1/register", register) //for login of admin

app.use("api/v1/view_product", find_product)  //getting the product

app.use("/api/v1/view_category", categoryView) //for getting the product

app.use("/api/v1/user", route);


app.listen(PORT, () => {
    console.log(`Connected to the server on ${PORT}`)
})

