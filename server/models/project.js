var db = require('./lib/db');
var User = require('./user.js');

var Project = {};

// finds a project by id
// NOTES: this needs to be expanded once collabs and 
//        public projects become a thing
Project.findById = function(projectId, username) {
  return db('projects').select('*').where({id: projectId}).limit(1)
    .then(function(rows) {
      var project = rows[0]
      if (!project) throw 404;

      //checks that user owns that project
      return User.findByUsername(username)
      .then(function(user){
        if (!user) throw 404;
        if (project.owner_id !== user.id) throw 401;
        //projects exists and belongs to the expected user
        return project;
      })
      .catch(function(err){
        throw err;
      })

    })
    .catch(function(err) {
      throw err;
    });
};

// returns all projects for a user 
// NOTE: this needs to be expanded once collabs and 
//      public projects become a thing
Project.findByUser = function (owner_id) {
  return db('projects').select('*').where({owner_id: owner_id})
    .then(function(rows){
      if (!rows.length) return;
      return rows;
    })
    .catch(function(err)){
      throw err;
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
        name: attrs.name,
        description: attrs.description
      };
      return newProject;
    });
};

Project.update = function (projectId, attrs) {
  return db('projects').where('id', '=', projectId).update(attrs)
  .catch(function(err){
    throw err;
  })
}

Project.del = function(projectId){
  return db('projects').where('id', '=', projectId).del()
  .catch(function(err){
    throw err; 
  })
}

module.exports = Project;
