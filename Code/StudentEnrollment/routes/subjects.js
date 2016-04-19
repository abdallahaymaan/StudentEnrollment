/**
 * Created by hrajapaksha on 4/8/2016.
 */
var express = require('express'),
    router = express.Router(),
    mongoose = require('mongoose'), //mongo connection
    bodyParser = require('body-parser'), //parses information from POST
    methodOverride = require('method-override'); //used to manipulate POST

//This will make sure that every requests that hits this controller will pass through these functions
router.use(bodyParser.urlencoded({ extended: true }))
router.use(methodOverride(function(req, res){
    if (req.body && typeof req.body === 'object' && '_method' in req.body) {
        // look in urlencoded POST bodies and delete it
        var method = req.body._method
        delete req.body._method
        return method
    }
}))


router.route('/')
    //GET all blobs
    .get(function(req, res, next) {
        //retrieve all blobs from Monogo
        mongoose.model('subject').find({}, function (err, subjects) {
            if (err) {
                return console.error(err);
            } else {
                //respond to both HTML and JSON. JSON responses require 'Accept: application/json;' in the Request Header
                res.format({
                    //HTML response will render the index.jade file in the views/blobs folder. We are also setting "blobs" to be an accessible variable in our jade view
                    html: function(){
                        res.render('subjects/index', {
                            title: 'All subjects',
                            "subjects" : subjects
                        });
                    },
                    //JSON response will show all blobs in JSON format
                    json: function(){
                        res.json(infophotos);
                    }
                });
            }
        });
    })
    //POST a new blob
    .post(function(req, res) {
        // Get values from POST request. These can be done through forms or REST calls. These rely on the "name" attributes for forms
        var moduleCode = req.body.moduleCode;
        var moduleName = req.body.moduleName;
        var department=req.body.department;
        var coordinator = req.body.coordinator;
        var credits = req.body.credits;
        var semester = req.body.semester;
        var day = req.body.day;
        var description = req.body.description;
        var preRequestSubjects = req.body.preRequestSubjects;
        var status=req.body.status;




        //call the create function for our database
        mongoose.model('subject').create({

            moduleCode:moduleCode,
            moduleName:moduleName,
            department:department,
            coordinator:coordinator,
            credits:credits,
            semester:semester,
            day:day,
            description:description,
            preRequestSubjects:preRequestSubjects,
            status:status,

        }, function (err, subject) {
            if (err) {
                res.send("There was a problem adding the information to the database.");
            } else {
                //Blob has been created
                console.log('POST creating new blob: ' + subject);
                res.format({
                    //HTML response will set the location and redirect back to the home page. You could also create a 'success' page if that's your thing
                    html: function(){
                        // If it worked, set the header so the address bar doesn't still say /adduser
                        res.location("subjects");
                        // And forward to success page
                        res.redirect("/subjects");
                    },
                    //JSON response will show the newly created blob
                    json: function(){
                        res.json(subject);
                    }
                });
            }
        })
    });

/* GET New Blob page. */
router.get('/new', function(req, res) {
    res.render('subjects/new', { title: 'Add New subject' });
});


// route middleware to validate :id
router.param('id', function(req, res, next, id) {
    //console.log('validating ' + id + ' exists');
    //find the ID in the Database
    mongoose.model('subject').findById(id, function (err, subject) {
        //if it isn't found, we are going to repond with 404
        if (err) {
            console.log(id + ' was not found');
            res.status(404)
            var err = new Error('Not Found');
            err.status = 404;
            res.format({
                html: function(){
                    next(err);
                },
                json: function(){
                    res.json({message : err.status  + ' ' + err});
                }
            });
            //if it is found we continue on
        } else {
            //uncomment this next line if you want to see every JSON document response for every GET/PUT/DELETE call
            //console.log(blob);
            // once validation is done save the new item in the req
            req.id = id;
            // go to the next thing
            next();
        }
    });
});

router.route('/:id')
    .get(function(req, res) {
        mongoose.model('subject').findById(req.id, function (err, blob) {
            if (err) {
                console.log('GET Error: There was a problem retrieving: ' + err);
            } else {
                console.log('GET Retrieving ID: ' + blob._id);
                var blobdob = blob.userName.toISOString();
                //blobdob = blobdob.substring(0, blobdob.indexOf('T'))
                res.format({
                    html: function(){
                        res.render('blobs/show', {
                            "blobdob" : blobdob,
                            "blob" : blob
                        });
                    },
                    json: function(){
                        res.json(blob);
                    }
                });
            }
        });
    });


//GET the individual blob by Mongo ID
router.get('/:id/edit', function(req, res) {
    //search for the blob within Mongo
    mongoose.model('subject').findById(req.moduleCode, function (err, subject) {
        if (err) {
            console.log('GET Error: There was a problem retrieving: ' + err);
        } else {
            //Return the blob
            console.log('GET Retrieving ID: ' + subject.moduleCode);
            //format the date properly for the value to show correctly in our edit form
            var blobdob = subject.moduleName.toISOString();
            // blobdob = blobdob.substring(0, blobdob.indexOf('T'))
            res.format({
                //HTML response will render the 'edit.jade' template
                html: function(){
                    res.render('blobs/edit', {
                        title: 'Blob' + subject.moduleCode,
                        "blobdob" : blobdob,
                        "blob" : admin
                    });
                },
                //JSON response will return the JSON output
                json: function(){
                    res.json(subject);
                }
            });
        }
    });
});


//PUT to update a blob by ID
router.put('/:id/edit', function(req, res) {
    // Get our REST or form values. These rely on the "name" attributes



    var moduleCode = req.body.moduleCode;
    var moduleName = req.body.moduleName;
    var department = req.body.department;
    var coordinator = req.body.coordinator;
    var credits = req.body.credits;
    var semester = req.body.semester;
    var day = req.body.day;
    var description = req.body.description;
    var preRequestSubjects = req.body.preRequestSubjects;
    var status=req.body.status;

    //find the document by ID
    mongoose.model('subject').findById(req.id, function (err, subject) {
        //update it
        subject.update({
            moduleCode : moduleCode,
            moduleName : moduleName,
            department : department,
            coordinator : coordinator,
            credits : credits,
            semester : semester,
            day : day,
            description : description,
            preRequestSubjects : preRequestSubjects,
            status:status,
        }, function (err, blobID) {
            if (err) {
                res.send("There was a problem updating the information to the database: " + err);
            }
            else {
                //HTML responds by going back to the page or you can be fancy and create a new view that shows a success page.
                res.format({
                    html: function(){
                        res.redirect("/blobs/" + admin.userId);
                    },
                    //JSON responds showing the updated values
                    json: function(){
                        res.json(admin);
                    }
                });
            }
        })
    });
});


//DELETE a Blob by ID
router.delete('/:id/edit', function (req, res){
    //find blob by ID
    mongoose.model('Blob').findById(req.id, function (err, admin) {
        if (err) {
            return console.error(err);
        } else {
            //remove it from Mongo
            blob.remove(function (err, admin) {
                if (err) {
                    return console.error(err);
                } else {
                    //Returning success messages saying it was deleted
                    console.log('DELETE removing ID: ' + admin.userId);
                    res.format({
                        //HTML returns us back to the main page, or you can create a success page
                        html: function(){
                            res.redirect("/admins");
                        },
                        //JSON returns the item with the message that is has been deleted
                        json: function(){
                            res.json({message : 'deleted',
                                item : admin
                            });
                        }
                    });
                }
            });
        }
    });
});


module.exports = router;