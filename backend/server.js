
const express = require('express');
const http = require('http');
const socketIo = require('socket.io');
const cors = require('cors'); 

const app = express();
const server = http.createServer(app);
const io = socketIo(server, {
  cors: {
    origin: "*", // Allow your React app origin
    methods: ["GET", "POST"]
  }
});

app.use(cors()); // Use cors

const PORT = process.env.PORT || 5000;

const keywordResponses = {
  "hi": "Hello! How can I assist you today?",
  "hello": "Hello! How can I assist you today?",
  "help": "Sure, I'm here to help! What do you need assistance with?",
  "price": "The price of our products varies. Could you specify which product you're interested in?",
  "shipping": "We offer various shipping options. Please provide more details about your location.",
  "thanks": "You're welcome! If you have any more questions, feel free to ask.",
  // Add more keyword-response pairs as needed
};

const keywordProductResponses = {
  "tv": "we have neod tv price:20000 color:black,white",
  "glasses": "we have neod vr glasses price:10000 color:black,white",
  "vr": "we have neod vr glasses price:10000 color:black,white"
};

const productList = [
  "neod: tv - 50000",
  "neod: vr glasses - 30000",
  "neod: projector - 20000"
];


io.on('connection', (socket) => {
  console.log('A user connected');

  socket.on('chat message', (message) => {
    console.log('Message received:', message);

    // Check for keywords and respond accordingly
    let response = "I'm sorry, I didn't understand that.";
    for (let keyword in keywordResponses) {
      if (message.toLowerCase().includes(keyword)) {
        response = keywordResponses[keyword];
        break;
      }
    }
    for (let keyword in keywordProductResponses) {
      if (message.toLowerCase().includes(keyword)) {
        response = keywordProductResponses[keyword];
        break;
      }
    }

     // Fallback to product list if no keywords match
     if (response === "I'm sorry, I didn't understand that.") {
      response = "Here are some of our products:\n" + productList.join('\n');
    }

    // Emit bot response to the client
    socket.emit('bot reply', response);
  });

  socket.on('disconnect', () => {
    console.log('A user disconnected');
  });
});

server.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});


// Define a route for the root URL
// app.get('/', (req, res) => {
//   res.json({
//     status: 200,
//     message: "hello"
//   });
// });
