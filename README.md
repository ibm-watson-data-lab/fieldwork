# Overview

Field Work is a web application that supports offline editing and mapping of geospatial data. It downloads and saves geospatial data locally for offline use using Cloudant Geo or Lucene Geo query, has a UI that supports editing of points, lines and polygons, and syncs locally edited data back to an [IBM Cloudant](https://cloudant.com/) database.

Many field-based industries whose personnel are disconnected from communications networks -- often in remote areas or even underground -- can benefit from this kind of offline-first mobile application.  This demonstration is designed for utilities repair personnel who need to capture events in work orders. 

[![Deploy to Bluemix](https://bluemix.net/deploy/button.png)](https://bluemix.net/deploy)


## How it Works

1. This demo has data from the City of Boston. Pan to an area of interest (the initial area you see is fine) and click on the "Load Data" button to start syncing with the Cloudant database. 
1. A "Layers" menu will appear in the top right corner of the map. Click on check boxes next to the data layers to toggle their visibility. 
1. Pushpins will also appear on top of the map. These are the items that can be edited. If you've clicked the "Load Data" button, the "Edit Pins" button will be enabled. Click that to begin editing. 3 new editing tools will appear below the "+" and "-" map controls
1. Hover over those editing controls for prompts on adding, deleting and modifying  pushpins.

## Architecture

![field work architecture](./fieldwork-app-graphics.png)

This an architectural overview of the components that make this app run.


## Running the app on Bluemix

1. Create a Bluemix Account

    [Sign up][bluemix_signup_url] for Bluemix, or use an existing account.

2. Download and install the [Cloud-foundry CLI][cloud_foundry_url] tool

3. Clone the app to your local environment from your terminal using the following command

  ```
  git clone https://github.com/IBM-Bluemix/box-watson.git
  ```

4. cd into this newly created directory

5. Edit the `manifest.yml` file and change the `<application-name>` and `<application-host>` to something unique.

  ```
  applications:
    name: fieldwork-me
    host: fieldwork-me
    runtime: php_buildpack
    memory: 128M
    instances: 1
  ```
  The host you use will determinate your application url initially, e.g. `<application-host>.mybluemix.net`.

6. Connect to Bluemix in the command line tool and follow the prompts to log in.

  ```
  $ cf api https://api.ng.bluemix.net
  $ cf login
  ```

7. Create the Cloudant service in Bluemix.

  ```
  $ cf create-service cloudant
  ```
  
1. Create a Cloudant database indexed for geospatial query

  ```
  curl to create design doc
  ```

8. Push it to Bluemix.

  ```
  $ cf push
  ```


## Privacy notice
The 'Field Work' sample web application includes code to track deployments to Bluemix and other Cloud Foundry platforms. The following information is sent to a [Deployment Tracker](https://github.com/cloudant-labs/deployment-tracker) service on each deployment:

* Application Name (application_name)
* Space ID (space_id)
* Application Version (application_version)
* Application URIs (application_uris)

This data is collected from the VCAP_APPLICATION environment variable in IBM Bluemix and other Cloud Foundry platforms. This data is used by IBM to track metrics around deployments of sample applications to IBM Bluemix. Only deployments of sample applications that include code to ping the Deployment Tracker service will be tracked.

## Disabling Deployment Tracking

Deployment tracking can be disabled by removing `require("cf-deployment-tracker-client").track();` from the beginning of the `app.js` main server file.

## License

Licensed under the [Apache License, Version 2.0](LICENSE.txt).


Field Work is a sample application created for the purpose of demonstrating an offline geographic data sync and editing application. The program is provided as-is with no warranties of any kind, express or implied. 