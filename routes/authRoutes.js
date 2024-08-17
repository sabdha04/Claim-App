const express = require('express');
const router = express.Router();
const User = require('../models/User');
const bcrypt = require('bcrypt');

router.post('/register', async (req, res) => {
    const { username, password, role } = req.body;
    try {
        const hashedPassword = await bcrypt.hash(password, 10);
        const newUser = await User.create({ username, password: hashedPassword, role });
        res.redirect('/login');
    } catch (error) {
        console.error(error);
        res.status(500).send('Internal Server Error');
    }
});

router.post('/login', async (req, res) => {
    const { username, password } = req.body;
    try {
        const user = await User.findOne({ where: { username } });
        if (user && await bcrypt.compare(password, user.password)) {
            req.session.user = user;
            res.redirect('/home');
        } else {
            res.status(401).send('Invalid credentials');
        }
    } catch (error) {
        console.error(error);
        res.status(500).send('Internal Server Error');
    }
});

router.get('/users/:id/edit', async (req, res) => {
    const userId = req.params.id;
    try {
        const user = await User.findByPk(userId);
        if (user) {
            res.render('editUser', { user });
        } else {
            res.status(404).send('User not found');
        }
    } catch (error) {
        console.error(error);
        res.status(500).send('Internal Server Error');
    }
});

router.post('/users/:id/edit', async (req, res) => {
    const userId = req.params.id;
    const { username, role } = req.body;
    try {
        await User.update({ username, role }, { where: { id: userId } });
        res.redirect('/admin/users');
    } catch (error) {
        console.error(error);
        res.status(500).send('Internal Server Error');
    }
});

router.get('/users/:id/delete', async (req, res) => { 
    const userId = req.params.id; 
    try { 
        console.log(`Attempting to delete user with ID: ${userId}`);

        const result = await User.destroy({ where: { id: userId } });

        console.log(`Number of users deleted: ${result}`);

        if (result === 0) { 
            return res.status(404).send('User not found');
        } 
        
        res.redirect('/admin/users'); 
    } catch (error) { 
        console.error('Error deleting user:', error); 
        res.status(500).send('Internal Server Error'); 
    } 
});

module.exports = router;