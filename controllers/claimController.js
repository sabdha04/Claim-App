const Claim = require('../models/Claim');

exports.createClaim = async (req, res) => {
    try {
        const { title, description, status } = req.body;
        const userId = req.session.user.id; // Ensure user ID is obtained correctly

        const newClaim = await Claim.create({
            title,
            description,
            status: status || 'pending',
            userId
        });

        res.redirect('/claims');
    } catch (error) {
        console.error(error);
        res.status(500).send('Internal Server Error');
    }
};

exports.getClaims = async (req, res) => {
    try {
        const claims = await Claim.findAll({ where: { userId: req.session.user.id } });
        res.render('claimHistory', { claims });
    } catch (error) {
        console.error(error);
        res.status(500).send('Internal Server Error');
    }
};
