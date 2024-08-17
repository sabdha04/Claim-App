module.exports = function ensureAdmin(req, res, next) {
    if (req.session.user && req.session.user.role === 'admin') {
        return next();
    }
    req.session.message = 'Access Denied: You do not have the correct role to access this resource.';
    res.redirect('/claim-form');
};
