var express = require('express')
var engine = require('express-handlebars')
var bodyParser = require('body-parser')
var mongoClient = require('mongodb').MongoClient
var ObjectID = require('mongodb').ObjectID

var app = express()

app.use('/public', express.static(__dirname + '/public'));
app.use(bodyParser.urlencoded({extended: true}))
app.engine('handlebars', engine({defaultLayout:'main'}))
app.set('view engine', 'handlebars')
app.set('views', __dirname + '/views')

mongoClient.connect('mongodb://localhost:27017/quotes', function(err, db){
	/// root
	app.get('/', function(req, res){
		res.render('quotes/index')
		
	})
	/// index
	app.get('/quotes', function(req, res){
		db.collection('quotes').find().toArray(function(err, quotes){
			res.render('quotes/index', {quotes: quotes})
		})
	})
	/// new
	app.get('/quotes/new', function(req, res){
		res.render('quotes/new')
	})

	/// create
	app.post('/quotes', function(req, res){
		db.collection('quotes').insertOne({
			quote: req.body.quote,
			author: req.body.author,
			source: req.body.source
		}, function(err, result){
			if(err){ throw err }
			res.redirect('/quotes')
		})
	})
	/// show 
	app.get('/quotes/:id', function(req, res){
		db.collection('quotes').findOne(ObjectID(req.params.id), function(err, quote){
			if(err){throw err}
			res.render('quotes/show', {quote:quote})	
		})
	})

	/// edit
	app.get('/quotes/:id/edit', function(req, res){
		db.collection('quotes').findOne(ObjectID(req.params.id), function(err, quote){
			if(err){ throw err }
			res.render('quotes/edit', {quote:quote})
		})
	})
	/// update
	app.post('/quotes/:id/update', function(req, res){
		db.collection('quotes').updateOne({_id:ObjectID(req.params.id)},{quote:req.body.quote, author:req.body.author, source:req.body.source}, function(err, result){
			if(err){ throw err }
			res.redirect('/quotes')
		})
	})
	/// delete 
    app.get('/quotes/:id/destroy', function(req, res){
		db.collection('quotes').deleteOne({_id:ObjectID(req.params.id)}, {}, function(err, result){
			if(err){ throw err }
			res.redirect('/quotes')
		})
	})

	app.listen(5000)
	console.log('server listening on 5000 port')
})

