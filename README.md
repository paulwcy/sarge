# Sarge (aka Drill Sergeant)

## Install
```js
npm install sarge
```

## Usage

This example shows adding basic role checking to the hapi [basic auth example](https://github.com/spumko/hapi/blob/master/docs/Reference.md#basic-authentication). 


```js
var Hapi = require('hapi');
var Bcrypt = require('bcrypt');

var server = new Hapi.Server('localhost', 3000);

var users = {
    john: {
        username: 'john',
        password: '$2a$10$iqJSHD.BGr0E2IxQwYgJmeP3NvhPrXAeLSaGCj6IR/XU5QtjVu5Tm',   // 'secret'
        name: 'John Doe',
        id: '2133d32a',
        role: 'admin'
    },
    jane: {
        username: 'jane',
        password: '$2a$10$iqJSHD.BGr0E2IxQwYgJmeP3NvhPrXAeLSaGCj6IR/XU5QtjVu5Tm',   // 'secret'
        name: 'Jane Doe',
        id: '2132bbb',
        role: 'user'
    },
};


var sarge_config = {
    // request is the full request object
    // config is the plugin.sarge config attached to the route
    handler: function (request, config, next) {
        var user = users[request.auth.credentials.username];
        if (user.role !== config.role) {
            next(Hapi.error.unauthorized("Not authorized"));
        }
        next();
    }
}


var validate = function (username, password, callback) {

    var user = users[username];
    if (!user) {
        return callback(null, false);
    }

    Bcrypt.compare(password, user.password, function (err, isValid) {
        callback(err, isValid, { id: user.id, name: user.name, username: user.username });
    });
};

server.auth('simple', {
    scheme: 'basic',
    validateFunc: validate
});

var handler = function () {
    this.reply('hapi hapi hapi hapi hapi');
};

server.route({
    method: 'GET',
    path: '/',
    handler: handler,
    config: {
        auth: 'simple',
        plugins: {
            sarge: {
                role: 'admin'
            }
        }
    }
});

server.pack.require('sarge', sarge_config, function () {});

server.start(function () {
    console.log("Server Started " + server.info.uri);
});
```

The first point to notice is that you need to add your authorization criteria to the route via 

```js
config: {
    plugins: {
        sarge: {
            // Whatever data you want to put here
        }
    }
}
```

The entire config.plugins.sarge object is passed into the authorization handler as the second argument; ```config```.


The second point is that you need to create a handler to do your authorization logic and pass that into the plugin when it's required. This handler takes in 3 arguments. ```request```, ```config```, ```next```.
