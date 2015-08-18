# Cloudant Field Work

The Cloudant Field Work is a demo web application that allows for offline field editing and mapping of geospatial data. It downloads and saves geospatial data locally for offline use using Cloudant Geo query, has a UI that supports editing of points, lines and polygons, and syncs locally edited data back to an [IBM Cloudant](https://cloudant.com/) database.

## Installing

Get the project:

    $ git clone https://github.com/rajrsingh/fieldwork.git
    $ cd fieldwork

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


