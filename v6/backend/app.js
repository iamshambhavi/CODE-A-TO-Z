var express       			=require("express"),
    app           			=express(),
    bodyParser  			=require("body-parser"),
    mongoose    			=require("mongoose"),
	flash					=require("connect-flash"),
	bcrypt      			=require("bcrypt"),
 //   Content     			=require("./models/content"),
	methodOverride 			=require("method-override"),
   // seedDB      			=require("./seeds"),
    passport				=require("passport"),
	localStrategy			=require("passport-local"),
	passportLocalMongoose	=require("passport-local-mongoose"),
	User					=require("./models/user"),
	request					=require("request"),
	axios					=require("axios");

mongoose.connect("mongodb://localhost:27017/codeatozv5",{ useNewUrlParser: true,useUnifiedTopology:true});
app.use(bodyParser.json({limit: '10mb', extended: true}));
app.use(bodyParser.urlencoded({limit: '10mb', extended: true}));
app.set("view engine", "ejs");
app.use(express.static(__dirname+"/public"));
app.use(methodOverride("_method"));
app.use(flash());



mongoose.set('useFindAndModify', false);
//var contentRoutes = require("./routes/content"),
//    userRoutes    = require("./routes/user");

app.use(require("express-session")({
	secret: "Rusty is the cutest",
	resave: false,
	saveUninitialized:false
}));
app.use(passport.initialize());
app.use(passport.session());
passport.use(new localStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

app.use(function(req,res,next){
	res.locals.currentUser=req.user;
	res.locals.error=req.flash("error");
	res.locals.success=req.flash("success");
	next();
})

// passport.authenticate('local', { failureFlash: { messages={error:  'Invalid username or password.' }} });

app.get("/",function(req,res){
	//res.send("Helll0");
	res.render("landing");
});
app.get("/login",function(req,res){
	//res.send("Helll0");
	res.render("login");
	
});

// app.get("/profile",function(req,res){
// 	//res.send("Hey");
// 	res.render("profile/index");
// })


app.put("/profile/:id/add",checkOwnership,function(req,res){
	User.findOneAndUpdate({username: req.params.id},req.body,function(err,updatedProfile){
		if(err)
			res.redirect("/");
		else{
			res.redirect("/profile/"+req.params.id);
		}
	});
});

app.get("/profile/:id",function(req,res){
	User.findOne({username: req.params.id} ,function(err,userProfile){
		if(err){
			console.log(err);
		}
		else{
			if(userProfile.codeChef && userProfile.codeChef !=''){
				axios.get("https://competitive-coding-api.herokuapp.com/api/codechef/"+userProfile.codeChef)
					.then(function(response){
						var results=response.data;
						if(results.status==='Success'){
							userProfile.codeChef_rating=results.rating;
							userProfile.codeChef_stars=results.stars;
						}
					})
					.catch(function(error){
						console.log(error);
					})
					.finally(function(){
						if(userProfile.codeForces && userProfile.codeForces !=''){
							axios.get("https://competitive-coding-api.herokuapp.com/api/codeforces/"+userProfile.codeForces)
								.then(function(response){
									var results=response.data;
									if(results.status==='Success'){
										userProfile.codeForces_rating=results.rating;
										userProfile.codeForces_rank=results.rank;
			 							console.log(userProfile);
									}
									console.log(userProfile);
								})
								.catch(function(error){
									console.log(error);
								})
								.finally(function(){
									res.render("profile/index",{user: userProfile});
								});
						}else{
							res.render("profile/index",{user: userProfile});
						}
					});
			}else{
				if(userProfile.codeForces && userProfile.codeForces !=''){
					axios.get("https://competitive-coding-api.herokuapp.com/api/codeforces/"+userProfile.codeForces)
						.then(function(response){
							var results=response.data;
							if(results.status==='Success'){
								userProfile.codeForces_rating=results.rating;
								userProfile.codeForces_rank=results.rank;
			 					console.log(userProfile);
							}
							console.log(userProfile);
						})
						.catch(function(error){
								console.log(error);
						})
						.finally(function(){
							res.render("profile/index",{user: userProfile});
						});
				}else{
					res.render("profile/index",{user: userProfile});
				}
			}
		}
	});
});

app.get("/profile/:id/edit",checkOwnership,function(req,res){
		User.findOne({username: req.params.id},function(err,userProfile){
			res.render("profile/edit",{user:userProfile});
		});
});

app.put("/profile/:id",checkOwnership,function(req,res){
	User.findOneAndUpdate({username: req.params.id},req.body,function(err,updatedProfile){
		if(err)
			res.redirect("/");
		else{
			res.redirect("/profile/"+req.params.id);
		}
	})
})

app.get("/contents",function(req,res){
	res.render("contents/index");
})
app.get("/contents/Arrays",function(req,res){
	res.render("contents/modules/arrays");
})
app.get("/contents/backtracking",function(req,res){
	res.render("contents/modules/backtracking");
})
app.get("/contents/bigonotation",function(req,res){
	res.render("contents/modules/bigonotation");
})
app.get("/contents/bit",function(req,res){
	res.render("contents/modules/bit");
})
app.get("/contents/bm",function(req,res){
	res.render("contents/modules/bm");
})
app.get("/contents/bst",function(req,res){
	res.render("contents/modules/bst");
})
app.get("/contents/bt",function(req,res){
	res.render("contents/modules/bt");
})
app.get("/contents/bwd",function(req,res){
	res.render("contents/modules/bwd");
})
app.get("/contents/cd",function(req,res){
	res.render("contents/modules/cd");
})
app.get("/contents/cg",function(req,res){
	res.render("contents/modules/cg");
})
app.get("/contents/ch",function(req,res){
	res.render("contents/modules/ch");
})
app.get("/contents/dac",function(req,res){
	res.render("contents/modules/dac");
})
app.get("/contents/dsu",function(req,res){
	res.render("contents/modules/dsu");
})
app.get("/contents/fft",function(req,res){
	res.render("contents/modules/fft");
})
app.get("/contents/flows",function(req,res){
	res.render("contents/modules/flows");
})
app.get("/contents/ge",function(req,res){
	res.render("contents/modules/ge");
})
app.get("/contents/graphs",function(req,res){
	res.render("contents/modules/graphs");
})
app.get("/contents/greedy",function(req,res){
	res.render("contents/modules/greedy");
})
app.get("/contents/gt",function(req,res){
	res.render("contents/modules/gt");
})
app.get("/contents/hld",function(req,res){
	res.render("contents/modules/hld");
})
app.get("/contents/hpq",function(req,res){
	res.render("contents/modules/hpq");
})
app.get("/contents/ll",function(req,res){
	res.render("contents/modules/ll");
})
app.get("/contents/ma",function(req,res){
	res.render("contents/modules/ma");
})
app.get("/contents/matrices",function(req,res){
	res.render("contents/modules/matrices");
})
app.get("/contents/me",function(req,res){
	res.render("contents/modules/me");
})
app.get("/contents/mnh",function(req,res){
	res.render("contents/modules/mnh");
})
app.get("/contents/moa",function(req,res){
	res.render("contents/modules/moa");
})
app.get("/contents/nt",function(req,res){
	res.render("contents/modules/nt");
})
app.get("/contents/oops",function(req,res){
	res.render("contents/modules/oops");
})
app.get("/contents/pds",function(req,res){
	res.render("contents/modules/pds");
})
app.get("/contents/queues",function(req,res){
	res.render("contents/modules/queues");
})
app.get("/contents/recursion",function(req,res){
	res.render("contents/modules/recursion");
})
app.get("/contents/searching",function(req,res){
	res.render("contents/modules/searching");
})
app.get("/contents/sorting",function(req,res){
	res.render("contents/modules/sorting");
})
app.get("/contents/st",function(req,res){
	res.render("contents/modules/st");
})
app.get("/contents/stacks",function(req,res){
	res.render("contents/modules/stacks");
})
app.get("/contents/string",function(req,res){
	res.render("contents/modules/string");
})
app.get("/contents/treaps",function(req,res){
	res.render("contents/modules/treaps");
})
app.get("/contents/treees",function(req,res){
	res.render("contents/modules/trees");
})
app.get("/contents/tries",function(req,res){
	res.render("contents/modules/tries");
})
app.get("/events",function(req,res){
	var newDate=new Date();
	var month=newDate.getMonth()+1;
	var date=newDate.getDate();
	var year=newDate.getFullYear();
	var hours=newDate.getHours();
	var minutes=newDate.getMinutes();
	var seconds=newDate.getSeconds();
	var query=year.toString()+"-"+month.toString()+"-"+date.toString()+"T"+hours.toString()+":"+minutes.toString()+":"+seconds.toString();
	var url1="https://clist.by/api/v1/contest/?limit=1000&start__gt="+query+"&order_by=start&username=arjun161&api_key=684f7d6fd3fb85efb8e4f9975fe82c06af3f0fd8";
	var url2="https://clist.by:443/api/v1/contest/?start__lt="+query+"&end__gt="+query+"&order_by=end&username=arjun161&api_key=684f7d6fd3fb85efb8e4f9975fe82c06af3f0fd8";
	var result1;
	var result2;
	axios.get(url1)
		.then(function(response){
			result1=response.data;
			result1["objects"].forEach(function(data){
				data.duration=secondsToTime(data.duration);
			});
		})
		.catch(function(error){
			console.log(error);
		})
		.finally(function(){
			axios.get(url2)
				.then(function(response){
					result2=response.data;
					result2["objects"].forEach(function(data){
						data.duration=secondsToTime(data.duration);
					});
				})
				.catch(function(error){
				
				})
				.finally(function(){
					console.log(result2);
					res.render("events/index",{data1: result1, counter1: 1, data2: result2, counter2: 1});
				});
		});
	// request(url,function(error,response,body){
	// 	if(!error && response.statusCode==200){
	// 		var results=JSON.parse(body);
	// 		console.log(results);
			// results["objects"].forEach(function(data){
			// 	data.duration=secondsToTime(data.duration);
			// });
			// res.render("events/index",{data: results, counter: 1});
	// 	}else{
	// 		console.log(response.statusCode);
	// 	}
	// });
})

function secondsToTime(secs){
	secs = Math.round(secs);
	var hours = Math.floor(secs / (60 * 60));

	var divisor_for_minutes = secs % (60 * 60);
	var minutes = Math.floor(divisor_for_minutes / 60);

	var divisor_for_seconds = divisor_for_minutes % 60;
	var seconds = Math.ceil(divisor_for_seconds);
	var days=Math.floor(hours/24);
	hours=hours-(days*24);
	var obj = {
		"d": days,
		"h": hours,
		"m": minutes,
		"s": seconds
	};
	return obj;
}


// show register form
app.get("/register", function(req, res){
   res.render("register"); 
});

//handle sign up logic
	app.post("/register", async function(req, res){
			var newUser = new User({first: req.body.first, last: req.body.last, email: req.body.email, username: req.body.username, gender: req.body.gender, status: req.body.status, institution: req.body.institution, country: req.body.country});
			User.register(newUser, req.body.password, function(err, user){
			if(err){
				console.log(err);
				return res.redirect("register");
			}
			passport.authenticate("local")(req, res, function(){
				res.redirect("/contents"); 
			});
		});
	});


app.post("/login",passport.authenticate("local", {
    successFlash : "Hey, Welcome back",
    successRedirect : "/",
    failureFlash : true,
    failureRedirect :"/"
    }), function(req, res){
});

app.post("/login1",passport.authenticate("local",{
		successRedirect: "/contents",
		failureRedirect: "/contents",
		failureFlash: true
	}),function(req,res){
	
});

app.get("/logout",function(req,res){
	req.logout();
	res.redirect("/");
});
//app.use("/", authRoutes);
//app.use("/campgrounds", campgroundRoutes);
//app.use("/campgrounds/:id/comments", commentRoutes);

function checkOwnership(req,res,next){
	if(req.isAuthenticated()){
		User.findOne({username: req.params.id},function(err,user){
			if(err){
				res.redirect("back");
			}else{
				if(user.username===req.user.username){
					next();
				}else{
					res.redirect("back");
				}
			}
		});
	}else{
		res.redirect("back");
	}
}

app.listen(process.env.PORT||3000, process.env.IP, function(){
   console.log("The server has started!");
});