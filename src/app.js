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

app.use(express.json());
app.use(cors(corsOption));
app.use('/api', routes);

const ErrorHandler = require('./middlewares/error.handler.middleware');
app.use(ErrorHandler);

const port = 3000;

app.listen(port, () => {
    console.log(port, '포트로 서버가 열렸습니다.');
});

app.get('/', (req, res) => {
    res.send(`test ${port}`);
});
