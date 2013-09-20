var Hapi = null; // Initialized during plugin registration

var internals = {};

internals.defaults = {
    handler: function (request, config, next) {
        next(); 
    }
};


exports.register = function (plugin, options, next) {
    internals.setHapi(plugin.hapi);
    
    var settings = plugin.hapi.utils.applyToDefaults(internals.defaults, options);    
    plugin.api('settings', settings);
    
    plugin.ext('onPostAuth', function (request, next) {
        settings.handler(request, request._route.settings.plugins.sarge, next);
    });

    next();
};


internals.setHapi = function (module) {
    Hapi = Hapi || module;
};
