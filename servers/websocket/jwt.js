const jwt = require('jsonwebtoken');

function tokenToID(token) {
    return new Promise((resolve, reject) => {
        jwt.verify(token, "secret", (err, decoded) => {
            if(err) { reject(err) }
            resolve(decoded.id)
        })
    })
}

module.exports.tokenToID = tokenToID;