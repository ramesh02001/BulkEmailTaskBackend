
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const Authrouter = require('./routes/Auth.js');
const Emailrouter = require('./routes/Email.js');
const { isAuthorized } = require('./midelware/auth.js');

require('dotenv').config();


const app=express();
app.use(cors());
app.use(express.json());

//dbconnection
mongoose.connect(process.env.MONGO_URI, {})
  .then(() => console.log('MongoDB connected'))
  .catch((err) => console.log('MongoDB connection error:', err));

app.use('/api/auth',Authrouter);
app.use('/api/email',isAuthorized, Emailrouter);


//serveport
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));