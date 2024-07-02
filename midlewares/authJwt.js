const { verify } = require('../utils/jwt-util');

const authJwt = (req, res, next) => {
    if ( req.headers.authorization ) {
        const token = req.headers.authorization.split('Bearer ')[1];
        const result = verify(token);

        if ( result.ok ) {
            req.userInfo = result.userInfo;
            next();
        } else {
            res.status(401).send({
                ok: false,
                message: result.message
            });
        }
    } else {
        res.status(401).send({
            ok: false,
            message: '인증정보가 올바르지 않습니다.'
        });
    }
}

module.exports = authJwt;