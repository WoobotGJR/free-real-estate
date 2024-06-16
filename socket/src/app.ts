import { Server } from 'socket.io';

const io = new Server({
  cors: {
    origin: 'http://localhost:5173',
  },
});

interface IUser {
  userId: string;
  socketId: string;
}

let onlineUser: IUser[] = [];

const addUser = (userId: string, socketId: string) => {
  const userExits = onlineUser.find((user) => user.userId === userId);
  if (!userExits) {
    onlineUser.push({ userId, socketId });
  }
};

const removeUser = (socketId: string) => {
  onlineUser = onlineUser.filter((user) => user.socketId !== socketId);
};

const getUser = (userId: string) => {
  return onlineUser.find((user) => user.userId === userId);
};

io.on('connection', (socket) => {
  socket.on('newUser', (userId) => {
    addUser(userId, socket.id);
  });

  socket.on('sendMessage', ({ receiverId, data }) => {
    const receiver = getUser(receiverId);

    if (receiver) {
      io.to(receiver.socketId).emit('getMessage', data);
    }
  });

  socket.on('disconnect', () => {
    removeUser(socket.id);
  });
});
io.listen(3000);
