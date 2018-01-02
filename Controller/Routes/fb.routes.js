//http://localhost:3000/auth/facebook/<Route>
const Router = require('express').Router(),
	passport = require('passport');

require('../auth/fb.passport.js');

Router.get('/', passport.authenticate('facebook',{
	scope: ['public_profile','email']
}));
Router.get('/redirect',passport.authenticate('facebook'),(req,res) => {
	res.redirect('/dashboard');
})


module.exports = Router;