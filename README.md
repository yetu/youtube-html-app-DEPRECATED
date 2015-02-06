# Youtube App
This sole purpose of this application is to show how :

* yetu oauth2 client can be implemented in a play framework
* how communication between different screens are accomplished (e.g. message from a pc to tv)

Most of the scala code that is used in this project are from Activator template which shows how [Silhouette](https://github.com/mohiva/play-silhouette)  can be implemented in a Play Framework

## Try out the application locally:

In order to get the application to function, you need to provide:

- an OAuth2 `clientId` and `clientSecret`. Please see `conf/silhouette.conf` for the configuration keys.
- a youtube developer token. Please see `conf/reference.conf` for the configuration keys.

These configuration values are best overridden in a new file under `conf/application.conf`

### If you are an internal yetu employee:

You can get these configuration values from this [private repository](https://bitbucket.org/yetu/apphome-youtube-html-app-deployment)

### If you are not internal yetu employee:

TODO: information how to obtain a clientId/clientSecret
TODO: information how to obtain a youtube developer token.