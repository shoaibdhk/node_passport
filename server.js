// Declare the variable
require('dotenv').config();

const ejsLint = require('ejs-lint'),
  chalk = require('chalk'),
  express = require('express'),
  flash = require('connect-flash'),
  session = require('express-session'),
  expressLayouts = require('express-ejs-layouts'),
  mongoose = require('mongoose'),
  passport = require('passport'),
  app = express();

// Parser and json
app.use(express.urlencoded({ extended: false }));
app.use(express.json());

// Express Session Config
app.use(
  session({
    secret: 'secret',
    resave: true,
    saveUninitialized: true
  })
);

// Passport Middleware
require('./config/passport')(passport);
app.use(passport.initialize());
app.use(passport.session());

// Connect flash
app.use(flash());

// Global Variables

app.use((req, res, next) => {
  res.locals.success_msg = req.flash('success_msg');
  res.locals.error_msg = req.flash('error_msg');
  res.locals.error = req.flash('error');
  next();
});

// DB config
mongoose.connect(
  process.env.DB_PATH,
  { useNewUrlParser: true, useCreateIndex: true }
);
// .then(() => console.log(chalk.green(`MongoDB is connected ...`)))
// .catch(err => console.log(chalk.red(err)));
mongoose.connection.on('connected', () => {
  console.log(chalk.green(`Application connected to mongodb`));
});
mongoose.connection.on('disconnected', () => {
  console.log(chalk.yellow(`Application disconnected from mongodb`));
});
mongoose.connection.on('error', () => {
  console.log(chalk.red(`Something wrong, couldn't connect to mongodb`));
});

// EJS Layout Setup
app.use(expressLayouts);
app.set('view engine', 'ejs');

// Declaring Routes
app.use('/', require('./routes/index'));
app.use('/users', require('./routes/users'));
app.use((req, res, next) => {
  res.status(403).json({
    message: 'Invalid api request'
  });
  next();
});

// Connecting to the database
const PORT = process.env.PORT || 5000;
app.listen(PORT, console.log(chalk.bgGreen.bold(`Server is running on port ${PORT}`)));
