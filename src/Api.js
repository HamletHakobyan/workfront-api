var url = require('url'),
    http = require('http'),
    https = require('https');

/**
 * Creates new Api instance.
 * @param {Object} config   An object with the following keys:<br/>
 *     <code>url</code> {String} - Required. An url to AtTask server (for example: http://localhost:8080)<br/>
 *     <code>version</code> {String} - Optional. Which version of api to use. At the moment of writing can be 1.0, 2.0, 3.0, 4.0. Pass 'internal' to use AtTask internal API (this is the latest version, maybe unstable)
 * @constructor
 */
function Api(config) {
    var parsed = url.parse(config.url);

    // Create the request
    this.httpTransport = parsed.protocol === 'https:' ? https : http;

    this.httpOptions = {
        host: parsed.hostname,
        port: parsed.port || 80,
        withCredentials: false
    };

    // Append version to path if provided
    var path;
    if (config.version === 'internal') {
        path = '/attask/api-internal';
    }
    else {
        path = '/attask/api';
        if (config.version) {
            path = path + '/v' + config.version;
        }
    }
    this.httpOptions.path = path;
}

var plugins = [
    'request',
    'login',
    'logout',
    'search',
    'get',
    'post',
    'put',
    'delete',
    'report',
    'count',
    'copy',
    'upload',
    'execute',
    'namedQuery',
    'metadata'
];
for(var i=0; i<plugins.length; ++i) {
    require('./plugins/' + plugins[i])(Api);
}

module.exports = Api;