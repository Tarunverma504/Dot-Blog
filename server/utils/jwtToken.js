const jwt = require('jsonwebtoken');
function createToken(data){    
    return jwt.sign({data}, 'Dot-Blog2_SecretKey', {
    });
}
function getTokenValue(token){
    return jwt.verify(token, 'Dot-Blog2_SecretKey').data;
}
module.exports = {createToken, getTokenValue};
