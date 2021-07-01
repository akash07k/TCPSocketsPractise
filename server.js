const net = require("net");
let HOST = "127.0.0.1";
let PORT = "6969";
let sockets = [];

let server = net.createServer();

server.listen(PORT, HOST, () => {
  console.log(`TCP server is listening on ${HOST}:${PORT}`);
});

server.on("connection", (socket) => {
  let clientAddress = `${socket.remoteAddress}:${socket.remotePort}`;
  console.log(`New client connected: ${clientAddress}`);
  sockets.push(socket);
  socket.on("data", (data) => {
    console.log(`Client ${clientAddress}: ${data}`);
    // Write the data back to all the connected, the client will receive it as data from the server
    sockets.forEach((sock) => {
      sock.write(
        socket.remoteAddress + ":" + socket.remotePort + " said " + data + "\n"
      );
    });
  });

  // Add a 'close' event handler to this instance of socket
  socket.on("close", () => {
    let index = sockets.findIndex((o) => {
      return (
        o.remoteAddress === socket.remoteAddress &&
        o.remotePort === socket.remotePort
      );
    });
    if (index !== -1) {
      sockets.splice(index, 1);
      sockets.forEach((sock) => {
        sock.write(`${clientAddress} disconnected\n`);
      });
      console.log(`connection closed: ${clientAddress}`);
    }
  });

  // Add a 'error' event handler to this instance of socket
  socket.on("error", (error) => {
    console.log(`Error occurred in ${clientAddress}: ${error.message}`);
  });
});
