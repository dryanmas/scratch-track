var db = require('../lib/db');
var User = require('./user');
var Resource = require('./resource');

var Project = {};

Project.countLikesWhere = function(condition){
  return db.raw('SELECT projects.* , ' +
    'COUNT(likes.project_id) AS "likes" FROM projects ' +
    'LEFT JOIN likes ON likes.project_id = projects.id ' +
    'WHERE '+ condition +
    ' GROUP BY projects.id')
  .then(function(query){
    return query.rows;
  })
}

// finds a project by id
Project.findById = function(projectId, userId) {
    //this cluster fuck adds on a like count 
    //to the project with a particular ID
  return Project.countLikesWhere('projects.id = '+projectId)
  .then(function(rows) {
    var project = rows[0];

    if (!project) { throw 404; }
    //checks that user owns that project
    //if project is private 
    if (project.private && project.owner_id !== userId) { throw 401; }
    //projects exists and belongs to the expected user
    return project;
  });
};

// returns all projects for a user 
Project.findByUser = function (userId) {
   return Project.countLikesWhere('owner_id = '+userId);
};

Project.findByPublic = function () {
  return Project.countLikesWhere('private = '+0);
};

Project.isPrivate = function(projectId){
  return db('projects').where('id', '=', projectId)
  .then(function(rows){
    return rows[0].private;
  })
};

// creates a new project
Project.create = function (attrs, username) {
  return db('projects').insert(attrs).returning('id')
    .then(function(rows) {
      var newProject = {
        id: rows[0],
        owner_id: attrs.owner_id,
        created_at: attrs.created_at,
        updated_at: attrs.updated_at,
        // private: 1, // Default projects to be private
      };
      return newProject;
    });
};

//updated a project based on id
Project.update = function (projectId, attrs) {
  return db('projects').where('id', '=', projectId).update(attrs)
  .then(function(){
    return db('projects').select('*').where({id: projectId})
    .then(function(rows){
      return rows[0];
    });
  });
};

//changes created_at when a resource is updated 
Project.updateResource = function(projectId) {
  var updated = {
    updated_at: Math.round(Date.now()/1000)
  };
  return db('projects').where('id', '=', projectId).update(updated);
};

//deletes an entire project
Project.del = function(projectId){
  //deleting all associated resources & likes
  return Resource.deleteAll(projectId)
  .then(function(){
    return db('likes').where('project_id', '=', projectId).del();
  })
  .then(function(){
    //deleting project
    return db('projects').where('id', '=', projectId).del();  
  });
};

module.exports = Project;
