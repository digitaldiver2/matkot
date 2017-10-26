'use strict';

// Development specific configuration
// ==================================
module.exports = {

  // MongoDB connection options
  mongo: {
    // uri: 'mongodb://192.168.0.171/matkot-dev'
    uri: 'mongodb://localhost/matkot-dev'
  },

  // Seed database on startup
  seedDB: false,

  host: 'http://localhost:9000',
  adminEmail: 'stijn.haers@gmail.com'

};
