function checkBody(body, keys){
    let verifBody = true
    for (let i = 0; i<keys.length; i++){
        if(!body[keys[i]]){
            verifBody = false
        }
    }
    
    return verifBody
}

module.exports = {checkBody}