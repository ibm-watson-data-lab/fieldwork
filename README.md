# Field Work

**Field Work** is a web application that supports offline editing and mapping of geospatial data. This app:

- downloads and saves geospatial data locally for offline use by Cloudant Geo or Lucene Geo query 
- has a UI that supports editing of points, lines, and polygons 
- syncs locally-edited data back to an [IBM Cloudant](https://cloudant.com/) database

Many field-based industries whose personnel are disconnected from communications networks&#8212;often in remote areas or even underground&#8212;can benefit from this kind of offline-first mobile application.  This demonstration is designed for utilities repair personnel who need to capture events in work orders.

## Related Resources
- [Blog post: Better infrastructure maintenance with offline mobile maps](https://developer.ibm.com/clouddataservices/2016/03/07/better-infrastructure-maintenance-with-offline-mobile-maps/)

- [Presentation: Field Work: Map-centric mobile apps with Cloudant Geo and LeafletJS ](http://www.slideshare.net/rajrsingh/field-work-mapcentric-mobile-apps-with-cloudant-geo-and-leafletjs)



## Try it

[Play with the live demo version of this app](http://fieldwork.mybluemix.net/). To get started:


1. Drag the map to an area you want to see.
2. Click the **Load Data** button.
3. On the upper right of the map, choose the data types you want to see. 
4. In the left pane, click the **Edit Pins** button.
Pushpins appear on the map. 
5. On the left side of the map, use the controls that appear to edit and add pins. (Hover over a control for guidance.)

![fieldwork demo](http://developer.ibm.com/clouddataservices/wp-content/uploads/sites/47/2016/03/fieldwork.png)


## Architecture

![field work architecture](./fieldwork-app-graphics.png)

This an architectural overview of the components that make this app run.


## Deploy to IBM Bluemix

The fastest way to deploy this application to Bluemix is to click this **Deploy to Bluemix** button. If you prefer instead to deploy manually to Bluemix then skip ahead to the **Manual Development** section.

[![Deploy to Bluemix](https://deployment-tracker.mybluemix.net/stats/5995ba4616bcc1cfbc56ab72f0c152ea/button.svg)](https://bluemix.net/deploy?repository=https://github.com/ibm-cds-labs/fieldwork.git)

**Don't have a Bluemix account?** If you haven't already, you'll be prompted to [sign up](http://www.ibm.com/cloud-computing/bluemix/) for a Bluemix account when you click the button.  Sign up, verify your email address, then return here and click the the **Deploy to Bluemix** button again. Your new credentials let you deploy to the platform and also to code online with Bluemix and Git. If you have questions about working in Bluemix, find answers in the [Bluemix Docs](https://www.ng.bluemix.net/docs/).

### (Optional) Customize the app URL

Bluemix creates a random, unique URL for your app, each time you deploy. If you want to customize and set a static URL, you can do so in the [IBM Bluemix DevOps Services](https://hub.jazz.net/) project created for you when you deployed.

  1. On the Bluemix Deployment Successful screen, click the **Edit Code** button.
  2. Find and open the `manifest.yml` file.
  2. Change the line `random-route: true` to `host: my-unique-app-name`
   
   On the next deployment, the URL for your app will be `my-unique-app-name.mybluemix.net`

If you plan to modify the code for this app, and want to use GitHub's code repository ([instead of IBM Bluemix DevOps Services](https://hub.jazz.net/)), follow the instructions in the next section. 

### Manual Development

1. Fork the repo
  Click the **Fork** button in the top right corner of this repository
  
1. Create a Bluemix Account

    ![Sign up](http://www.ibm.com/cloud-computing/bluemix/) for Bluemix, or use an existing account.

2. Download and install the ![Cloud-foundry CLI](https://www.ng.bluemix.net/docs/#starters/install_cli.html) tool.

3. Clone the app to your local environment from your terminal using the following command

  ```
  git clone https://github.com/ibm-cds-labs/fieldwork
  ```

4. cd into your newly created directory.

5. Edit the `manifest.yml` file and change the `<application-host>` to something unique.

  ```
  ---
  declared-services: 
    cloudant-fieldwork-db:
      label: cloudantNoSQLDB
      plan: Shared
  applications:
    - name: fieldwork
      host: fieldwork-gr8one
      memory: 128M
      disk_quota: 512M
      path: .
      domain: mybluemix.net
      instances: 1
      services:
      - cloudant-fieldwork-db
  ```
  The host you use determines your application url initially, e.g. `<application-host>.mybluemix.net`.

1. Connect to Bluemix in your command-line tool and follow the prompts to log in.

  ```
  $ cf api https://api.ng.bluemix.net
  $ cf login
  ```

1. Create the Cloudant service in Bluemix.
  ```
  $ cf create-service cloudantNoSQLDB Shared cloudant-fieldwork-db
  ```
  
### Manual deployment

To deploy to Bluemix, simply:

  ```
  $ cf push
  ```

## Privacy notice
The **Field Work** sample web application includes code to track deployments to Bluemix and other Cloud Foundry platforms. The following information is sent to a [Deployment Tracker](https://github.com/cloudant-labs/deployment-tracker) service on each deployment:

* Application Name (application_name)
* Space ID (space_id)
* Application Version (application_version)
* Application URIs (application_uris)

This data is collected from the VCAP_APPLICATION environment variable in IBM Bluemix and other Cloud Foundry platforms. This data is used by IBM to track metrics around deployments of sample applications to IBM Bluemix. Only deployments of sample applications that include code to ping the Deployment Tracker service will be tracked.

## Disabling Deployment Tracking

You can disable deployment tracking by removing `./admin.js track && ` from the `install` line of the `scripts` sections within `package.json`.

## License

Licensed under the [Apache License, Version 2.0](LICENSE.txt).


Field Work is a sample application created for the purpose of demonstrating an offline geographic data sync and editing application. The program is provided as-is with no warranties of any kind, express or implied. 
