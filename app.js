var express =require("express")
var   bodyparser=require("body-parser")
var mongoose =require("mongoose")
var app =express();
var methodOverride = require("method-override");

mongoose.set('useFindAndModify', false);


mongoose.connect("mongodb://localhost/blog_app",{
	 useNewUrlParser: true,
  useUnifiedTopology: true
});
app.use(express.static("public")); 	
app.use(bodyparser.urlencoded({extended:true}));
app.use(methodOverride("_method"));




var BlogSchema=mongoose.Schema({
	title:String,
	image:String,
	body:String,
	created:{type:Date,default: Date.now}
});

var blog=mongoose.model("Blog",BlogSchema);



app.get("/",function(req,res){
	res.redirect("/blogs");
})


app.get("/blogs",function(req,res){
	blog.find({},function(err,blogs){
		if(err){
			console.log(err);
		}
		else{
				res.render("index.ejs",{blogs:blogs});
		}
	})

})



app.get("/blogs/new",function(req,res){
	res.render("new.ejs");
})


app.post("/blogs",function(req,res){
	blog.create(req.body.blog,function(err,newBlog){
		if(err){
			res.render("/blogs/new");
		}
		else{
			res.redirect("/blogs")
			
		}
	})
})

app.get("/blogs/:id",function(req,res){
	blog.findById(req.params.id,function(err,foundBlog){
		if(err){
			res.redirect("/blogs")
		}
		else{
			res.render("show.ejs",{blog:foundBlog})
		}
	})
})

app.get("/blogs/:id/edit",function(req,res){
	blog.findById(req.params.id,function(err,foundBlog){
		if(err){
			res.redirect("/blogs");
		}else{
				res.render("edit.ejs",{blog:foundBlog});
		}
	})

})
app.put("/blogs/:id",function(req,res){
	blog.findByIdAndUpdate(req.params.id,req.body.blog,function(err,UpdatedBlog){
		if(err){
			res.redirect("/blogs")
		}
		else{
			res.redirect("/blogs/"+req.params.id);
		}
	})

})

app.delete("/blogs/:id",function(req,res){
		   blog.findByIdAndRemove(req.params.id,function(err){
			   if(err){
				   res.redirect("/blogs");
			   }
			   else{
				   res.redirect("/blogs");
			   }
		   })
		   })



app.listen(3000,function(){
	console.log("Server is running");
})