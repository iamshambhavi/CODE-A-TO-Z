var express		=require("express"),
	app         =express(),
	bodyParser	=require("body-parser"),
	axios		=require('axios'),
	cheerio		=require('cheerio');



app.get("/codechef/:id",function(req,res){
	var url='https://www.codechef.com/users/'+req.params.id;
	var codechef={};
	axios.get(url)
  		.then(function (response) {
    		const html=response.data;
			var $=cheerio.load(html);
				codechef.username=req.params.id;
				$('div.rating-number').each(function(i,element){
					codechef.rating=element.children[0].data;
					$('span.rating').each(function(i,element){
						codechef.stars=element.children[0].data;
						$('div.plr10 header h2').each(function(i,element){
							codechef.name=element.children[0].data;
						});
				});
			});
		res.send(codechef);
  		})
  		.catch(function (error) {
    	// handle error
    	console.log(error);
  		})
  		.finally(function () {
    	// always executed
  		});
});

app.get("/leetcode/:id",function(req,res){
	var url="https://leetcode.com/"+req.params.id;
	var leetcode={};
	axios.get(url)
		.then(function(response){
			const html=response.data;
			var $=cheerio.load(html);
			$('.fa-question').each(function(i,element){
				var children=$(this).prev();
				console.log(children);
			});
		})
		.catch(function (error) {
    	// handle error
    	console.log(error);
  		})
  		.finally(function () {
    	// always executed
  		});
});


app.get("/",function(req,res){
	var url="https://restcountries.eu/rest/v2/all";
	var countryflags=[];
	axios.get(url)
  		.then(function (response) {
    		const html=response.data;
			html.forEach(function(small){
				var country={};
				country.name=small.name;
				country.flag=small.flag;
				countryflags.push(country);
			});
			res.send(html);
		})
  		.catch(function (error) {
    	// handle error
    	console.log(error);
  		})
  		.finally(function () {

  		});
});
app.listen(process.env.PORT || 3000,process.env.IP, function(){
	console.log("Server connected");
});