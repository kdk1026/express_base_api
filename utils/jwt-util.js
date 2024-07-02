const path = require('path');
const dotenv = require('dotenv');
const jwt = require('jsonwebtoken');

if (process.env.NODE_ENV === 'production') {
    dotenv.config({ path: path.join(__dirname, '../env/.env.production') });
} else if (process.env.NODE_ENV === 'development') {
    dotenv.config({ path: path.join(__dirname, '../env/.env.development') });
} else if (process.env.NODE_ENV === 'local') {
    dotenv.config({ path: path.join(__dirname, '../env/.env.local') });
} else {
    throw new Error('process.env.NODE_ENV를 설정하지 않았습니다!');
}

module.exports = {
    sign: (tokenKind, user) => {
        const secret = process.env.jwt_secret;

        const payload = {
            tokenKind: tokenKind,
            userInfo: JSON.stringify(user)
        };

        let expiresIn = '1h';
        if (tokenKind === 'refreshToken') {
            expiresIn = '7d';
        }

        return jwt.sign(payload, secret, {
            algorithm: 'HS256',
            expiresIn: expiresIn
        });
    },
    verify: (token) => {
        const secret = process.env.jwt_secret;
        let decoded = null;

        try {
            decoded = jwt.verify(token, secret);

            if (decoded.tokenKind !== 'accessToken') {
                return {
                    ok: false,
                    message: '인증정보가 올바르지 않습니다.'
                }
            } else {
                return {
                    ok: true,
                    userInfo: JSON.parse(decoded.userInfo)
                }
            }
        } catch (err) {
            return {
                ok: false,
                message: err.message
            }
        }
    },
    refreshVerify: (token) => {
        const secret = process.env.jwt_secret;
        let decoded = null;

        try {
            decoded = jwt.verify(token, secret);

            if (decoded.tokenKind !== 'refreshToken') {
                return {
                    ok: false,
                    message: '인증정보가 올바르지 않습니다.'
                }
            } else {
                return {
                    ok: true,
                    userInfo: JSON.parse(decoded.userInfo)
                }
            }
        } catch (err) {
            return {
                ok: false,
                message: err.message
            }
        }
    }
};