const passport 	     = require('passport'),
	FacebookStrategy = require('passport-facebook'),
	key			     = require('../../key'),
	User 		     = require('../../Model/user.model');

passport.serializeUser((user,done)=>{
	done(null,user.id);
})
passport.deserializeUser((id,done) => {		
	User.findById(id).then((user)=>{
		done(null,user);
	})
})

passport.use(new FacebookStrategy({
   clientID: key.facebook.client_ID,
   clientSecret: key.facebook.client_secret,
   callbackURL: "/auth/facebook/redirect",
   profileFields: ['id', 'emails', 'name','picture.type(large)']
 },
 function(accessToken, refreshToken, profile, done) {
	User.findOne({ facebookid: profile.id }).then((currentuser) => {
		if(currentuser) { 
			done(null,currentuser);
		}else{
			let newuser = new User;
			newuser.facebookid = profile._json.id;
			newuser.email 	   = profile._json.email;
			newuser.username   = profile._json.first_name + ' ' + profile._json.last_name;
			newuser.profile_pic = profile._json.picture.data.url;
			newuser.people_you_are_following.push(newuser.username);
			newuser.followers.push(newuser.username);
			newuser.save().then((usr) =>{ done(null,usr);})
		}
	}).catch((err) =>{  done(null,err)  })
 } //end of callback function
));
