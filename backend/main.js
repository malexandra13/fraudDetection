const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const { Sequelize } = require('sequelize');

const userRoutes = require('./routes/userRoutes');
const clientProfileRoutes = require('./routes/clientprofileRoutes');
const bankAccountRoutes = require('./routes/bankaccountRoutes');
const transactionRoutes = require('./routes/transactionRoutes');
const loginRoutes = require('./routes/loginRoutes');
const http = require('http');
const { Server } = require('socket.io'); 

const app = express();
const server = http.createServer(app); // server HTTP

const io = new Server(server, {
  cors: {
    origin: '*', // sau http://localhost:5173 pentru Vite
    methods: ["GET", "POST"]
  }
});

const PORT = process.env.PORT || 8080;

const sequelize = new Sequelize({
    dialect: 'sqlite',
    storage: 'banking_app.db'
});

sequelize.authenticate()
    .then(() => console.log('Database connection successful.'))
    .catch(err => console.error('Database connection failed:', err));

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json({ limit: '200000mb' }));
app.use(cors({
    origin: 'http://localhost:5173', // frontend URL
    credentials: true               // allow cookies/auth headers
}));
app.set('io', io);
app.get('/', (req, res) => {
    res.send('Backend pentru aplicația bancară.');
});

app.use('/users', userRoutes);
app.use('/clients', clientProfileRoutes);
app.use('/accounts', bankAccountRoutes);
app.use('/transactions', transactionRoutes);
app.use('/auth', loginRoutes);

server.listen(PORT, () => {
    console.log(`Serverul rulează pe portul ${PORT}`);
});
