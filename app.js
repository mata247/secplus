const express = require('express');
const session = require('express-session');
const flash = require('express-flash');
const bodyParser = require('body-parser');
const expressLayouts = require('express-ejs-layouts');
const cors = require('cors');
const mongoose = require('mongoose');
const path = require('path');
const https = require('https');
const http = require('http');
const fs = require('fs');
const verifyUser = require('./modules/users/controllers/verifyUser')




const errorHandler = require('./handlers/errorHandler');
const whatsappPhoneNumber = process.env.WHATSAPP_PHONE_NUMBER;


require('dotenv').config();

// Create an Express app instance
const app = express();

// Middleware
app.use(cors());
app.use(express.json());
app.use(bodyParser.json());
app.use(express.urlencoded({ extended: true }));
app.use(flash());

// Set up session middleware
app.use(
  session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: true,
  })
);

app.use(express.static(path.join(__dirname, 'public')));
app.use(expressLayouts);

// Set the views directory and view engine
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

// Database connection
mongoose
  .connect(process.env.mongo_connection, {})
  .then(() => {
    console.log('Mongo connection successful!');
  })
  .catch(() => {
    console.log('Mongo connection failed!');
  });

// Models initialization
require('./models/users.model');
require('./models/transactions.model');
require('./models/posts.model');

// Routes
const userRoutes = require('./modules/users/users.routes');
const transactionRoutes = require('./modules/transactions/transactions.routes');
const postRoutes = require('./modules/Posts/post.routes');


app.use('/api/users', userRoutes);
app.use('/api/transactions', transactionRoutes);
app.use('/api/Posts', postRoutes);

// Use the login.js controller for the login route
app.use('/api/users', require('./modules/users/controllers/login'));
// app.use('/api/users', require('./modules/users/controllers/verifyUser'));

app.use((req, res, next) => {
  // Get your WhatsApp phone number from the environment variables
  const whatsappPhoneNumber = process.env.WHATSAPP_PHONE_NUMBER;

  // Create a WhatsApp link with your phone number
  const whatsappLink = `https://api.whatsapp.com/send?phone=${whatsappPhoneNumber}`;

  // Make the WhatsApp link available to all routes
  res.locals.whatsappLink = whatsappLink;

  next(); // Continue to the next middleware or route
});


// Route to render the new post creation page
app.get('/new-post', (req, res) => {
  res.render('new-post');
});

app.get('/', async (req, res) => {
  try {
    const Post = mongoose.model('Post');
    const allPosts = await Post.find();
    res.render('home', { posts: allPosts });
  } catch (error) {
    next(error); // Pass the error to the error handling middleware
  }
});


// Handle GET request for /verify
app.get('/verify', verifyUser);



// Define other routes and middleware...


// Error handling middleware
app.use((err, req, res, next) => {
  if (!err) return next(); // If there's no error, pass it to the next middleware

  // Render the error template with the error message
  res.status(err.status || 500).render('errors', { message: err.message });
});


app.get('/welcome', (req, res) => {
  // Check if the user is authenticated and obtain the user's email address
  // Replace this logic with your authentication and session setup
  if (!req.session || !req.session.accessToken) {
    // Redirect to the login page if the user is not authenticated
    return res.redirect('/login');
  }

  // Assuming you have stored the user's email in the session during login
  const userName = req.session.userName; // Change this based on your session setup

// Error handling middleware
app.use((err, req, res, next) => {
  if (!err) return next(); // If there's no error, pass it to the next middleware

  // Render the error template with the error message
  res.status(err.status || 500).render('errors', { message: err.message });
});

  // Render the welcome.ejs template and pass the userName variable
  res.render('welcome', { userName });
});

app.get('/about', (req, res) => {
  res.render('about');
});
app.get('/tretance', (req, res) => {
  res.render('tretance');
});
app.get('/educfina', (req, res) => {
  res.render('educfina');
});

app.get('/contact', (req, res) => {
  // Get your WhatsApp phone number from the environment variables
  const whatsappPhoneNumber = process.env.WHATSAPP_PHONE_NUMBER;

  // Create a WhatsApp link with your phone number
  const whatsappLink = `https://api.whatsapp.com/send?phone=${whatsappPhoneNumber}`;

  res.render('contact', { whatsappLink });
});


// app.get('/contact', (req, res) => {
//   res.render('contact');
// });

app.get('/down', (req, res) => {
  res.render('down');
});

// Route for new members (registration success)
app.get('/new-members', (req, res) => {
  // Your existing code for handling new members
});

// Route for account activation confirmation
app.get('/account-activated', (req, res) => {
  res.render('account-activated');
});

/// Route for displaying errors using the errors.ejs template
app.get('/errors', (req, res) => {
  // Example usage:
  // To display an error message, you can redirect to '/errors' with a query parameter like '/errors?message=YourErrorMessage'
  const errorMessage = req.query.message || 'An error occurred.';
  res.render('errors', { message: errorMessage });
});



// Create an HTTP server
const httpPort = process.env.HTTP_PORT || 80;
const httpServer = http.createServer(app);

// Start the HTTP server
httpServer.listen(httpPort, () => {
  console.log(`HTTP server is running on port ${httpPort}`);
});

// Start the HTTPS server
const httpsPort = process.env.HTTPS_PORT || 8001;
const privateKey = fs.readFileSync(__dirname + '/key.pem', 'utf8');
const certificate = fs.readFileSync('cert.pem', 'utf8');
const credentials = { key: privateKey, cert: certificate };
const httpsServer = https.createServer(credentials, app);

httpsServer.listen(httpsPort, () => {
  console.log(`HTTPS server is running on port ${httpsPort}`);
});
