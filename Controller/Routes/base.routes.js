// localhost:3000/<Route>

const Router = require('express').Router(),
	Article = require('../../Model/article.model'),
	User = require('../../Model/user.model');

Router.get('/',(req,res) => {
	if(!req.session.user) {
		res.redirect('/signup');
	}else{
		res.redirect('/dashboard');
	}
})

Router.get('/login',(req,res) => {
	if(!req.session.user) {
		res.render('login',{errors: []})
	}else{
		res.redirect('/dashboard');
	}
})

Router.get('/signup',(req,res) => {
	if(!req.session.user) {
		res.render('signup',{errors:[]})
	}else{
		res.redirect('/dashboard');
	}
})

Router.get('/new_article',(req,res) =>{
	res.render('new_article');
})

Router.get('/search/:tag',(req,res) => {
	Article.find({ tags: req.params.tag }).populate('author','username').then((articles) => {
		res.render('search',{articles,})
	})
})

Router.get('/search',(req,res) =>{
	res.render('search',{articles: []});
})


Router.get('/dashboard',(req,res) => {
	if(req.session.user || req.user){
		let user = req.session.user || req.user;
		let usr_ids = [];
		User.find({ username: { $in: user.people_you_are_following } }).then((usrs) =>{
			usrs.forEach((usr) => usr_ids.push(usr._id) )
		}).then(() => {
			Article.find({ author: { $in : usr_ids }}).populate('author',['username']).then((articles) => {
				res.render('dashboard',{articles, });
			})
		})
		.catch((err) => {
			res.redirect('/');
		});	
	}else{
		res.redirect('/');
	}
})


Router.get('/profile/:username',(req,res) =>{
	if(req.session.user || req.user) {
		let user = req.session.user || req.user
		let alreadyFollowingParamsUser = user.people_you_are_following.includes(req.params.username);

		User.findOne({ username: req.params.username }).then((user) => {
			Article.find({ author: user._id }).then((articles) => {
				res.render('profile',{articles,user, alreadyFollowingParamsUser,});
			})
		}).catch((err) => {
			// if no user is found
			res.redirect('/dashboard');
		})
	}else{
		res.redirect('/');
	}
})

Router.get('/profile/',(req,res) => {
         if(req.session.user || req.user){
             let user = req.session.user || req.user;
             res.redirect('/profile/' + user.username);
         }else{ res.redirect('/') }
})



module.exports = Router;


