# Youtube App
This sole purpose of this application is to show how :

* yetu oauth2 client can be implemented in a play framework
* how communication between different screens are accomplished (e.g. message from a pc to tv)

Most of the scala code that is used in this project are from Activator template which shows how [Silhouette](https://github.com/mohiva/play-silhouette)  can be implemented in a Play Framework

## Warning:

**This is work in progress and not yet production ready, please check back in a few days until this notice is gone before using this project as a starting point for your own yetu-compatible app.**

## Set up:

### sbt (TODO)
- npm (TODO)
- bower (TODO)
- gulp build

## Local configuration:

In order to get the application to function, you need to provide:

- an OAuth2 `clientId` and `clientSecret`. Please see `conf/silhouette.conf` for the configuration keys.
- a youtube developer token. Please see `conf/reference.conf` for the configuration keys.

These configuration values are best overridden in a new file under `conf/application.conf`

### If you are an internal yetu employee:

You can get these configuration values from this [private repository](https://bitbucket.org/yetu/apphome-youtube-html-app-deployment):

```
git clone git@bitbucket.org:yetu/apphome-youtube-html-app-deployment.git
cp apphome-youtube-html-app-deployment/application-local.conf conf/application.conf
```

### If you are not internal yetu employee:

TODO: information how to obtain a clientId/clientSecret
TODO: information how to obtain a youtube developer token.