const jwt = require('jsonwebtoken');

function tokenToID(token) {
    return new Promise((resolve, reject) => {
        if(token === undefined || token === null) { reject("No token provided") }
        jwt.verify(token, process.env.JWT_KEY, { algorithms: ['HS256'] }, (err, decoded) => {
            if(err) { reject(err); console.log(err) }
            if(decoded.id == undefined || decoded.id == null) { reject("Invalid token") }
            if(decoded.exp * 1000 < Date.now()) { console.log(decoded.exp, Date.now()); reject("Token expired") }
            resolve(decoded.id)
        })
    })
}

module.exports.tokenToID = tokenToID;