var Hoek = require('hoek');

var Hapi = null; // Initialized during plugin registration

var internals = {};

internals.defaults = {
    handler: function (request, config, next) {
        next();
    }
};


exports.register = function (plugin, options, next) {
    internals.setHapi(plugin.hapi);

    var settings = Hoek.applyToDefaults(internals.defaults, options);
    plugin.api('settings', settings);

    plugin.ext('onPostAuth', function (request, next) {
        if (!request._route.settings.plugins.sarge) return next();
        settings.handler(request, request._route.settings.plugins.sarge, next);
    });

    next();
};


internals.setHapi = function (module) {
    Hapi = Hapi || module;
};

