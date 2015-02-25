# yetu-tv-message-client 
[![bitHound Score](https://www.bithound.io/yetu/yetu-tv-message-client/badges/score.svg)](https://www.bithound.io/yetu/yetu-tv-message-client)

This project contains the yetu-tv-message-client. The code is written as native JavaScript. It is currently in __beta-state__ (version 1.0.2). This means it is stable for third-party-developer to work with. Nevertheless we welcome every third-party-developer, who uses this app, to extend or improve the API.

**Table of content**

<!-- toc -->

* [use the library as a third-party-application developer](#use-the-library-as-a-third-party-application-developer)
* [be a developer of our library](#be-a-developer-of-our-library)
  * [prerequisites](#prerequisites)
  * [initialise your project](#initialise-your-project)
    * [install dependencies](#install-dependencies)
    * [run project](#run-project)
    * [build project in dist](#build-project-in-dist)
    * [update table of contents in .md](#update-table-of-contents-in-md)
* [next steps](#next-steps)

<!-- toc stop -->


## use the library as a third-party-application developer

[Here](https://github.com/yetu/yetu-tv-message-client/blob/master/3rd-Party-Documentation.md) you can find the guide how you can use the library.

## be a developer of our library

At the yetu-tv-homescreen applications will open in an iFrame. This library is used in the third-party-application to get 
events of the remote control. It should be as well used for sending messages to the homescreen. Furthermore the 
third-party developer has to send in his application at some point a quit event to the main application. This would close 
the application at the homescreen.

If you want to make changes to this project, best is to install prerequisites and initialise the needed dependencies below:

### prerequisites

you need to have the following installed on your system:

* npm
	* check you have it by entering `npm` into a terminal
	* if you don't have it, install from [here](http://nodejs.org/)
* bower
	* check you have it by entering `bower` into a terminal
	* if you don't have it, enter `sudo npm install -g  bower` into your terminal
* gulp
	* check you have it by entering `which gulp` into a terminal
	* if you don't have it, enter `sudo npm install -g  gulp` into your terminal
	
More information about bower you can find [here](http://bower.io/).  
More information about gulp you can find [here](http://gulpjs.com/).

### initialise your project

####install dependencies
You need the project dependencies from bower. Open a terminal, change directory to this project, then:

```
bower install
```

**gulp** is used to combine and compress JS and to serve the example page. The gulpfile.js defines this tasks. 
First of all you have to install the node modules which are used in the gulpfile.js.
 
 ```
 npm install
 ```
 
####run project

To serve your page on a server, run `gulp run` and you can access the [TestPage](http://localhost:8080/example/index.html) in your browser on localhost.

####build project in dist
To build the project for the dist folder, so that other developers can use it as library, run `gulp build`

####update table of contents in .md
When you change the md files, please update as well the table of contents. For that install marked-toc with the following command.

```
npm install -g  marked-toc
```

After that you have to run:

```
toc Filename.md
```
If you want to create a new toc, add the following line on the place in the file, where you want to have it.

```
<!-- toc -->
```

##next steps
* version as well the minified
* send out the current version to yetu partners (first release)
* build a new release version of yetu-tv-message-client and adapt clients using this project (youtube-app,yetu partners)
