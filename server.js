const express = require('express');
const app = express();

const path = require('path');
const dotenv = require('dotenv');
const cors = require('cors');
const cookieParser = require('cookie-parser');

app.set('port', process.env.PORT || 8080);

app.listen(app.get('port'), function() {
    console.log(app.get('port'), '번 포트에서 대기 중');
});

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(cors({
    origin: [
        'http://127.0.0.1:5500',
        'http://localhost:5500'
    ],
    credentials: true
}));

app.use(cookieParser());

const router = require('./routes/index');
app.use(router);

if (process.env.NODE_ENV === 'production') {
    dotenv.config({ path: path.join(__dirname, 'env/.env.production') });
} else if (process.env.NODE_ENV === 'development') {
    dotenv.config({ path: path.join(__dirname, 'env/.env.development') });
} else if (process.env.NODE_ENV === 'local') {
    dotenv.config({ path: path.join(__dirname, 'env/.env.local') });
} else {
    throw new Error('process.env.NODE_ENV를 설정하지 않았습니다!');
}