import 'dotenv/config';
import express from 'express';
import postRoute from './routes/post.route';
import authRoute from './routes/auth.route';
import userRoute from './routes/user.route';
import chatRoute from './routes/user.route';
import messageRoute from './routes/user.route';
import cookieParser from 'cookie-parser';
import cors from 'cors';

const app = express();
const port = process.env.PORT || 8800;

app.use(cors({ origin: process.env.CLIENT_URL, credentials: true }));
app.use(express.json());
app.use(cookieParser());

app.use('/api/auth', authRoute);
app.use('/api/post', postRoute);
app.use('/api/users', userRoute);
app.use('/api/chat', chatRoute);
app.use('/api/message', messageRoute);

app.listen(port, () => {
  console.log('server is running');
});
