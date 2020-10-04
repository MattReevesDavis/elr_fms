module.exports = {
    notAuthenticated: (req, res, next) => {
        if (req.isAuthenticated()) {
            return res.redirect('/dashboard');
        }

        next();
    }
}