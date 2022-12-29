let axios= require("axios")

async function axi(request,response){
    let data = await axios.get("http://localhost:3002/api/v1/user/forget_password").catch((err)=>{
        return { error : err}
    });
    if ( !data || data.error){
        return response.status(500).send({error:data.error})
    }
    return response.send({data:data.data})
}

module.exports= axi