import express from 'express';
import dotenv from 'dotenv';
import path from 'path';
import morgan from 'morgan';

dotenv.config();

const app = express();
app.set('port', process.env.PORT || 2980);

// middlewares
app.use((req, res, next) => {
  if (process.env.MODE === 'production') morgan('combined')(req, res, next);
  else morgan('dev')(req, res, next);
});

app.use('/', express.static(path.join(__dirname, '../public')));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

// router
app.use((req, res, next) => {
  res.status(404).send('NOT FOUND');
});

// 에러처리 미들웨어
app.use((err, req, res, next) => {
  res.status(500).send(err.message);
  console.error(err);
});

app.listen(app.get('port'), () => {
  console.log(`${app.get('port')}번 포트에 서버가 열렸어요!`);
});
