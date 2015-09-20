var Nes = require('nes');

var nesClient = new Nes.Client('ws://localhost:3000');

global.nesClient = nesClient;
