// Licensed under the Apache 2.0 License. See footer for details.

var express = require('express'),
    // cookieParser = require('cookie-parser'),
    http = require('http'),
    path = require('path'),
    cloudant = require('cloudant'),
    program = require('commander'),
    // dotenv = require('dotenv'),
    // httpProxy = require('http-proxy'),
    url = require('url')
   // bodyParser = require('body-parser'),
;
require('dotenv').load();

var app = express();
// app.use(cookieParser());

(function(app) {
  if (process.env.VCAP_SERVICES) {
    var vcapServices = JSON.parse(process.env.VCAP_SERVICES);
    app.set('vcapServices', vcapServices);
    if (vcapServices.cloudantNoSQLDB && vcapServices.cloudantNoSQLDB.length > 0) {
      var service = vcapServices.cloudantNoSQLDB[0];
      if (service.credentials) {
        app.set('cloudant-fieldwork-db', cloudant({
          username: service.credentials.username,
          password: service.credentials.password,
          account: service.credentials.username
        }));
      }
    }
  }
})(app);

// Set the port number based on a command line switch, an environment variable, or a default value
app.set('port', program.port || process.env.PORT || 3000);
// Serve static assets
app.use(express.static(path.join(__dirname, 'public')));
// Create the HTTP server
http.createServer(app).listen(app.get('port'), function(){
  console.log('Express server listening on port ' + app.get('port'));
});

// track deployment
require("cf-deployment-tracker-client").track();

//-------------------------------------------------------------------------------
// Copyright IBM Corp. 2015
//
// Licensed under the Apache License, Version 2.0 (the "License");
// you may not use this file except in compliance with the License.
// You may obtain a copy of the License at
//
// http://www.apache.org/licenses/LICENSE-2.0
//
// Unless required by applicable law or agreed to in writing, software
// distributed under the License is distributed on an "AS IS" BASIS,
// WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
// See the License for the specific language governing permissions and
// limitations under the License.
//-------------------------------------------------------------------------------