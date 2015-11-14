var db = require('./lib/db');
var bPromise = require('bluebird');
var bcrypt = bPromise.promisifyAll(require('bcrypt-nodejs'));

var User = {};

// returns all users
User.all = function () {
  return db('users').select('*');
};

// finds a user by username 
User.findByUsername = function(username) {
  return db('users').select('*').where({name: username}).limit(1)
    .then(function(rows) {
      if (!rows.length) return;
      return rows[0];
    })
    .catch(function(err) {
      throw err;
    });
};

// creates a new user with name, and hashed password
User.signUp = function (attrs) {
  return db('users').insert(attrs).returning('id')
    .then(function(rows) {
      var newUser = {
        id: rows[0],
        email: attrs.email,
        password: attrs.password,
        first: attrs.first,
        last: attrs.last
      };
      return newUser;
    });
};

// generates hash async
User.generateHash = function(password) {
  return bcrypt.genSaltAsync(8)
    .then(function(salt) {
      return bcrypt.hashAsync(password, salt, null);
    });
};

// checks password async with stored password
User.validPassword = function(password) {
  return bcrypt.compareAsync(password, this.passHash);
};

module.exports = User;
