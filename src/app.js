const express = require('express');
const app = express();
const routes = require('./routes');
const cors = require('cors');
const corsOption = {
    origin: true,
    credentials: true,
    withCredential: true,
    optionsSuccessStatus: 200,
    exposedHeaders: ['accesstoken', 'refreshtoken'],
};

require('dotenv').config();
// const env = process.env;

app.use(express.json());
app.use(cors(corsOption));
app.use('/api', routes);

const ErrorHandler = require('./middlewares/error.handler.middleware');
app.use(ErrorHandler);

app.listen(3000, () => {
    console.log(3000, '포트로 서버가 열렸습니다.');
});

app.get('/', (req, res) => {
    res.send(`test 3000`);
});
