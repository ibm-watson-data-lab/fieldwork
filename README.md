# Field Work

## Motivation

Field Work is a web application that supports offline editing and mapping of geospatial data. It downloads and saves geospatial data locally for offline use using Cloudant Geo or Lucene Geo query, has a UI that supports editing of points, lines and polygons, and syncs locally edited data back to an [IBM Cloudant](https://cloudant.com/) database.

Many field-based industries whose personnel are disconnected from communications networks -- often in remote areas or even underground -- can benefit from this kind of offline-first mobile application.  This demonstration is designed for utilities repair personnel who need to capture events in work orders. 

## Usage

1. This demo has data from the City of Boston. Pan to an area of interest (the initial area you see is fine) and click on the "Load Data" button to start syncing with the Cloudant database. 
1. A "Layers" menu will appear in the top right corner of the map. Click on check boxes next to the data layers to toggle their visibility. 
1. Pushpins will also appear on top of the map. These are the items that can be edited. If you've clicked the "Load Data" button, the "Edit Pins" button will be enabled. Click that to begin editing. 3 new editing tools will appear below the "+" and "-" map controls
1. 

## Deploying

Complete these steps first if you have not already:

1. [Install couchapp](https://github.com/couchapp/couchapp)
1. Copy the app to your Cloudant account

        $ couchapp push . http://$username.cloudant.com/fieldwork


1. Or (if you have security turned on)

        $ couchapp push . http://$username:$password@$username.cloudant.com/fieldwork

## Running

Run the app on the web at https://$username.cloudant.com/fieldwork/_design/fieldwork/index.html

## License

Licensed under the [Apache License, Version 2.0](LICENSE.txt).


