const express = require('express');
const session = require('express-session');
const path = require('path');
const sequelize = require('./config/db');
const authRoutes = require('./routes/authRoutes');
const claimRoutes = require('./routes/claimRoutes');
const User = require('./models/User');
const Claim = require('./models/Claim');

const ensureAuthenticated = require('./middlewares/ensureAuthenticated'); 
const ensureAdmin = require('./middlewares/ensureAdmin'); 

const app = express();

app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

app.use(express.static('public'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));


app.use(session({
    secret: '',
    resave: false,
    saveUninitialized: true
}));

app.use('/api/auth', authRoutes);
app.use('/api/claims', claimRoutes);
app.use('/api', claimRoutes);


app.get('/login', (req, res) => {
    res.render('login');
});

app.get('/home', (req, res) => {
    if (req.session.user) {
        res.render('home', { user: req.session.user });
    } else {
        res.redirect('/login');
    }
});

app.get('/register', (req, res) => {
    res.render('register');
});

app.get('/claim-form', (req, res) => {
    const message = req.session.message;
    req.session.message = null; 
    res.render('claimForm', { message });
});

app.get('/claims', async (req, res) => {
    const claims = await Claim.findAll();
    res.render('claimHistory', { claims });
});

app.get('/admin/all-claims', ensureAuthenticated, ensureAdmin, async (req, res) => {
    try {
        const claims = await Claim.findAll({
            include: [{ model: User }] 
        });
        res.render('allClaims', { claims });
    } catch (error) {
        console.error(error);
        res.status(500).send('Internal Server Error');
    }
});

app.get('/admin/users', ensureAuthenticated, ensureAdmin, async (req, res) => {
    try {
        const users = await User.findAll();
        res.render('userManagement', { users });
    } catch (error) {
        console.error(error);
        res.status(500).send('Internal Server Error');
    }
});

sequelize.sync().then(() => {
    app.listen(3000, () => {
        console.log('Server is running on port 3000');
    });
});
