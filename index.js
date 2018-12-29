var express = require('express');
var bodyParser = require('body-parser');
var mongojs = require('mongojs');

var app = express();
var db = mongojs('todo', ['tasks']);

app.use(bodyParser.urlencoded({ extended: false }))
 
app.use(bodyParser.json())

app.get('/tasks', function(req, res){
	db.tasks.find(function(err, data){
		res.json(data);
	});
});

app.get('/tasks/:id', function(req, res){
	var id = req.params.id;
	db.tasks.find({ 
		"_id" : mongojs.ObjectId(id) 
	}, function(err, data){
		res.json(data);
	});
});

// curl -X POST localhost:3000/tasks -d "subject=Bread"
app.post('/tasks', function(req, res){
	var subject = req.body.subject;
	db.tasks.insert({
		'subject': subject,
		'status' : 0
	}, function(err, data){
		res.json(data);
	});
});
// curl -X DELETE localhost:3000/tasks/5c1f523f47791612b5d66490 -d
app.delete('/tasks/:id', function(req, res){
	var id = req.params.id;
	db.tasks.remove({
		"_id" : mongojs.ObjectId(id)
	}, function(err, data){
		res.json(data);
	})
});

app.put('/tasks/:id', function(req, res){
	var id = req.params.id;
	var status = req.body.status;
	var subject = req.body.subject;

	db.tasks.save({
		"_id" : mongojs.ObjectId(id),
		"subject" : subject,
		"status" : status
	}, function(err, data){
		res.json(data);
	});
	
});

app.patch('/tasks/:id', function(req, res){
	var id = req.params.id;
	var status = req.body.status;
	db.tasks.update(
		{"_id" : mongojs.ObjectId(id)},
		{$set : {"status" : status}},
		{"multi": true}, function(err, data){
			res.json(data);
		}
	);
})

app.listen('3000', function(){
	console.log('Express server running at port 3000');
});