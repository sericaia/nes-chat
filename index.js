var Hapi = require('hapi');
var server = new Hapi.Server();
var Nes = require('nes');

var browserify = require('browserify');
var map = require('through2-map');

server.connection({
  host: 'localhost',
  port: 3000
});

server.route({
  method: 'GET',
  path: '/',
  config: {
    handler: function(request, reply) {
      return reply.file(__dirname + '/index.html');
    }
  }
});

server.register([Nes, require('inert')], function(err) {
  if (err) {
    throw err;
  }

  server.route({
    method: 'GET',
    path: '/h',
    config: {
      id: 'hello',
      handler: function(request, reply) {
        return reply('Welcome to the hapi/nes chat!');
      }
    }
  });

  server.route({
    method: 'POST',
    path: '/message',
    config: {
      id: 'message',
      handler: function(request, reply) {
        server.broadcast(request.payload.message);
        reply('broadcasted!');
      }
    }
  });

  server.route({
    method: 'GET',
    path: '/bundle.js',
    handler: function(request, reply) {
      reply(null, browserify('./nes-client.js')
        .bundle().pipe(map({
          objectMode: false
        }, function(chunk) {
          return chunk;
        })));
    }
  });

  server.start(function(err) {
    if (err) {
      throw err;
    }

    console.log('Server running at:', server.info.uri);
  });
});
