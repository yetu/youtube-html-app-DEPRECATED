# Youtube App
This sole purpose of this application is to show how :

* yetu oauth2 client can be implemented in a play framework
* how communication between different screens are accomplished (e.g. message from a pc to tv)
* (what an app for current yetu homescreen across devices have to have)

Most of the scala code that is used in this project are from Activator template which shows how [Silhouette](https://github.com/mohiva/play-silhouette)  can be implemented in a Play Framework

## Warning:

**This is work in progress and not yet production ready, please check back in a few days until this notice is gone before using this project as a starting point for your own yetu-compatible app.**

## Project structure
This project is divided into the following two parts

* client-applications, where the sources are placed in the folder `clients`
    * `youtube_producer`:
        * App, which produces videoplaylists as notifications for yetu tv and mobile homescreen
        * Technologies: AngularJS, styl
        * Build-Process: gulp
* server-application which host the clients, provides authentication and configuration to communicate with other services
    * Technology: Scala
    * Build-Process: sbt
    * after building the clients the destination folders are the following:
        * main pages of clients are placed in `app/clients/[scala-page-name]`
        * sources of the main pages are in `public/[clientName]`
* appMetaData, which contains static data, which is used by the yetu platform
    * this data is placed in `public/appMetaData`
    * the `store` folder holds information for the yetu appstore
    * the `assets` and the `manifest.json` define the tile which you can see in the yetu homescreen (accross devices)
    * furthermore in the `manifest.json` the urls to the different levels apps will be defined
    
## Set up

Please open two different consoles for working with the app. In one you see the server build process
and in the other one client build process. Go to the root folder of this project in both consoles.

### server setup

sbt (TODO)

### client setup

For working with the clients you need to install nodeJS, npm and bower globally on your machine.

Check if you have them all with:
```
which bower
which node
which npm
```
It should show you the path, where there are installed on your machine.

The bower components are committed. So if you want to add a bower dependency for one client, you have to 
add it in the bower.json on the public folder and then run `bower install`. Please commit this bower component.

To build the clients and watch it during development, there is a script defined, which you can run like this.

```
./buildClients_local.sh
```

In this script there is one line, which runs `npm install`. You can remove this line, if you do not want to have it
in the this flow every time.

You have to reload every time you make changes currently (TODO: include browser sync in gulp process).

### Local configuration

In order to get the application to function, you need to provide:

- an OAuth2 `clientId` and `clientSecret`. Please see `conf/silhouette.conf` for the configuration keys.
- a youtube developer token. Please see `conf/reference.conf` for the configuration keys.

These configuration values are best overridden in a new file under `conf/application.conf`

#### If you are an internal yetu employee:

You can get these configuration values from this [private repository](https://bitbucket.org/yetu/apphome-youtube-html-app-deployment):

```
git clone git@bitbucket.org:yetu/apphome-youtube-html-app-deployment.git
cp apphome-youtube-html-app-deployment/application-local.conf conf/application.conf
```

#### If you are not internal yetu employee:

TODO: information how to obtain a clientId/clientSecret
TODO: information how to obtain a youtube developer token.