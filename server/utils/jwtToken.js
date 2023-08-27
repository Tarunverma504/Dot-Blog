const jwt = require('jsonwebtoken');
function createToken(id){    
    return jwt.sign({id}, 'Dot-Blog2_SecretKey', {
    });
}
module.exports = createToken;
