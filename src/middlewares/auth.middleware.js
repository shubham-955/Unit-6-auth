var jwt = require('jsonwebtoken');

const getUserByToken = (token) => {
    return new Promise((resolve, reject) => {
        jwt.verify(token, process.env.JWT_SECRET_KEY, (err, user) => {
            if (err) return reject(err);
            resolve(user);
        })
    })
}

const authCheck = async (req, res, next) => {
    // 1.read the request header
    const headers = req.headers;
    // 2.get the access token from header
    const accesstoken = headers.accesstoken;
    // 3.if the access token is not present in header, then 400
    if (!(accesstoken && accesstoken.startsWith("Bearer "))) {
        return res.status(400).send("User does not have access to post products")
    }
    // 4.get the user info from the token
    const token = accesstoken.split(" ")[1]
    let user;
    try {
        // 5.if token exist then get the user and validate the token
        user = await getUserByToken(token)
        req.user = user.user;
        // 6.if the token matches with user, allow him to go next 
    } catch (error) {
        // 7.else 400 
        return res.status(400).send("Authorization not provided or not valid")
    }
    return next()
}

module.exports = authCheck;