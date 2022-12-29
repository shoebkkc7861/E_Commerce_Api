const { logger } = require("../init/winston");
let { category, updatecat, viewCategory, softdeletecat, softundeletecat, activecat, unactivecat } = require("../model/category")


async function add_category(request, response) {
    let add = await category(request.body, request.userData).catch((err) => {
        return { error: err }
    });
    if (!add || add.error) {
        return response.status(401).send({ error: add.error })
    }
    return response.send({ data: add.data })
}


async function update_category(request, response) {
    let update = await updatecat(request.body, request.userData).catch((err) => {
        return { error: err }
    })
    console.log(update)
    if (!update || (update && update.error)) {
        return response.status(401).send({ error: update.error })
    }
    return response.send({ data: update })
}

async function categoryView(request, response) {
    let check = await viewCategory(request.body).catch((err) => {
        return { error: err }
    })
    if (!check || check.error) {
        return response.status(401).send({ error: check.error })
    }
    return response.send({ data: check })
}


async function delete_category(request, response) {
    let update = await softdeletecat(request.body, request.userData).catch((err) => {
        return { error: err }
    })
    console.log(update)
    if (!update || (update && update.error)) {
        return response.status(401).send({ error: update.error })
    }
    return response.send({ data: update })
}


async function undelete_category(request, response) {
    let update = await softundeletecat(request.body, request.userData).catch((err) => {
        return { error: err }
    })
    console.log(update)
    if (!update || (update && update.error)) {
        return response.status(401).send({ error: update.error })
    }
    return response.send({ data: update })
}

async function active_category(request, response) {
    let update = await activecat(request.body, request.userData).catch((err) => {
        return { error: err }
    })
    console.log(update)
    if (!update || (update && update.error)) {
        return response.status(401).send({ error: update.error })
    }
    return response.send({ data: update })
}

async function unactive_category(request, response) {
    let update = await unactivecat(request.body, request.userData).catch((err) => {
        return { error: err }
    })
    console.log(update)
    if (!update || (update && update.error)) {
        return response.status(401).send({ error: update.error })
    }
    return response.send({ data: update })
}


module.exports = { add_category, update_category, categoryView, delete_category, undelete_category, active_category, unactive_category }
