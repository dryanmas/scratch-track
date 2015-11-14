var express = require('express');
var router = express.Router();
var User = require('../models/user.js');
var Project = require('../models/project.js') 

// Get all projects that can be accessed
router.get('/', function (req, res) {
  //grab username from session
  //and finds user in db
   User.findByUsername(req.session.passport.user)
   .then(function(user){

    //this needs to change once public projects and
    //collabs become a thing 
      Project.findByUser(user.id)
      .then(function(projects){
        //sends all projects
        res.status(200).send(projects);
      })
      .catch(function(err){
        console.log("Could not find projects for this user");
        res.status(404).send();
      })
   })
   .catch(function(err){
    console.log("Could not find user");
    res.status(404).send();
   })
});

// Create new project
router.post('/', function (req, res) {
  res.json({'success':true});
});

// Get a project by id
router.get('/:projectId', function (req, res) {
  var projectId = req.params.projectId;
  res.json({'success':true,projectId:projectId});
});

// Update a project using its id
router.put('/:projectId', function (req, res) {
  var projectId = req.params.projectId;
  res.json({'success':true,projectId:projectId});
});

// Delete a project using its id
router.delete('/:projectId', function (req, res) {
  var projectId = req.params.projectId;
  res.json({'success':true,projectId:projectId});
});

// Get all recordings associated with a specific project
router.get('/:projectId/recordings', function (req, res) {
  var projectId = req.params.projectId;
  res.json({'success':true,projectId:projectId});
});

// Get all lyrics associated with a specific project
router.get('/:projectId/lyrics', function (req, res) {
  var projectId = req.params.projectId;
  res.json({'success':true,projectId:projectId});
});

// Get all stablatures associated with a specific project
router.get('/:projectId/stablature', function (req, res) {
  var projectId = req.params.projectId;
  res.json({'success':true,projectId:projectId});
});

// Get all notes associated with a specific project
router.get('/:projectId/notes', function (req, res) {
  var projectId = req.params.projectId;
  res.json({'success':true,projectId:projectId});
});

module.exports = router;
