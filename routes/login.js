const express = require('express');
const router = express.Router();
const bcrypt = require('bcrypt');

const jwt = require('../utils/jwt-util');

const getConnection = require('../utils/mysql-pool');
const mybatisMapper = require('mybatis-mapper');

mybatisMapper.createMapper(['./mappers/userMapper.xml']);

router.get('/', function(req, res, next) {
    const obj = {};
    obj.test = '1234';
    obj.profile = process.env.profile;

    res.json(obj);
});

router.post('/auth', function(req, res, next) {
    const { userId, userPw } = req.body;

    const format = {language: 'sql', indent: '  '};
    const param = {};
    param.userId = userId;

    const query = mybatisMapper.getStatement('userMapper', 'selectUser', param, format);

    getConnection((conn) => {
        conn.query(query, function(error, results, fields) {
            if (error) {
                console.log(error);
            }

            if (results) {
                const resObj = {};
                resObj.code = 500;
                resObj.message = '아이디 또는 비밀번호를 확인해주세요.';

                const isPasswordCompare = bcrypt.compareSync(userPw, results[0].user_pw);

                if ( !isPasswordCompare ) {
                    res.json(resObj);
                    return false;
                }

                const user = {};
                user.userId = results[0].user_id;
                user.userName = results[0].user_nm;

                const accessToken = jwt.sign('accessToken', user);
                const accessTokenExpireMin = process.env.jwt_access_expire_minute;
                
                resObj.accessToken = accessToken;
                resObj.accessTokenExpireSecond = accessTokenExpireMin * 60;

                const refreshToken = jwt.sign('refreshToken', user);
                const refreshTokenExpireMin = process.env.jwt_refresh_expire_minute;

                res.cookie('refreshToken', refreshToken, {
                    expires: new Date(Date.now() + (refreshTokenExpireMin*60*1000)),
                    httpOnly: true,
                    sameSite: false
                });

                let tokenType = process.env.jwt_token_type;
                if ( tokenType.lastIndexOf(' ') == -1 ) {
                    tokenType = tokenType + ' ';
                }

                resObj.tokenType = tokenType;

                resObj.code = 200;
                resObj.message = '성공';

                res.json(resObj);
            } else {
                res.json(resObj);
            }
        });

        conn.release();
    });
});

router.post('/token', function(req, res, next) {
    const resObj = {};
    resObj.code = 500;
    resObj.message = '인증정보가 올바르지 않습니다.';

    // ------------------------------------------------------------------------
    // 접근 토큰 유효성 검증
    // ------------------------------------------------------------------------
    const accessToken = req.body.accessToken;

    if ( !accessToken ) {
        res.json(resObj);
        return false;
    }

    const authResult = jwt.verify(accessToken);

    // ------------------------------------------------------------------------
    // 갱신 토큰 유효성 검증
    // ------------------------------------------------------------------------
    const refreshToken = req.cookies.refreshToken;

    if ( !refreshToken ) {
        res.json(resObj);
        return false;  
    }

    const refreshResult = jwt.refreshVerify(refreshToken);

    if ( !refreshResult.userInfo || !refreshResult.userInfo.userId ) {
        res.json(resObj);
        return false; 
    }

    // ------------------------------------------------------------------------
    // 접근 토큰이 만료된 경우에만 재발급
    // ------------------------------------------------------------------------
    let newAccessToken = '';

    if ( authResult.ok === false && authResult.message === 'jwt expired' ) {
        if ( refreshResult.ok === false ) {
            res.status(401).send({
                ok: false,
                message: '로그인 후 이용해 주세요.'
            });
        } else {
            const user = refreshResult.userInfo;
            newAccessToken = jwt.sign('refreshToken', user);
        }
    } else {
        newAccessToken = accessToken;
    }

    const accessTokenExpireMin = process.env.jwt_access_expire_minute;

    resObj.accessToken = newAccessToken;
    resObj.accessTokenExpireSecond = accessTokenExpireMin * 60;

    let tokenType = process.env.jwt_token_type;
    if ( tokenType.lastIndexOf(' ') == -1 ) {
        tokenType = tokenType + ' ';
    }

    resObj.tokenType = tokenType;

    resObj.code = 200;
    resObj.message = '성공';

    res.json(resObj);
});

module.exports = router;