import { messagesService } from "../repositories";

export const renderChat = (req, res) => {
  const user = req.session.user;
  res.render("chat", { user });
};

export const createMessage = (socket) => {
  socket.on("chatMessage", async ({ user, msg }) => {
    io.emit("message", { user, msg });
    await messagesService.createMessage(user, msg);
  });
};