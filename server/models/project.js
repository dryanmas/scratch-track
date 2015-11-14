var db = require('./lib/db');

var Project = {};

// finds a project by id and then calls the callback
Project.findById = function(id, cb) {
  return db('projects').select('*').where({id: id}).limit(1)
    .then(function(rows) {
      if (!rows.length) return;
      if (!cb) return rows[0];
      return cb(null, rows[0]);
    })
    .catch(function(err) {
      throw err;
    });
};

// returns all projects for a user and calls a callback
//NOTE: this needs to be expanded once collabs and 
//      public projects become a thing
Project.findByUser = function (owner_id, cb) {
  return db('projects').select('*').where({owner_id: owner_id})
    .then(function(rows){
      if (!rows.length) return;
      if (!cb) return rows;
      return cb(null, rows);
    })
    .catch(function(err)){
      throw err;
    })
};

// creates a new project
Project.create = function (attrs) {
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

module.exports = Project;
