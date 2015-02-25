# Introduction to the yetu-tv-message-client JavaScript library

At the yetu tv homescreen your application will be opened in an iFrame. You can use this library to get events of the
remote control. It should be as well used for sending messages to the homescreen. Furthermore you **have** to
send in your application at some point a quit event to the main application. This would close your
application at the homescreen.

**Table of content**

<!-- toc -->

* [Steps needed to include the yetu-tv-message-client JavaScript library in your project:](#steps-needed-to-include-the-yetu-tv-message-client-javascript-library-in-your-project)
* [How to test your application after integration of the yetu-tv-message-client:](#how-to-test-your-application-after-integration-of-the-yetu-tv-message-client)
  * [First opportunity](#first-opportunity)
  * [Second opportunity](#second-opportunity)
* [Namespace](#namespace)
  * [Callbacks](#callbacks)
  * [Operations](#operations)
    * [sendMessage](#sendmessage)
    * [sendQuit](#sendquit)

<!-- toc stop -->

## Steps needed to include the yetu-tv-message-client JavaScript library in your project:

* Include our library in your markup, for example via:
```
    <script src="dist/yetu-tv-message-client-min.js"></script>
```

* Check if the library has been initialized:
```
    if(yetu){
        // do stuff with our library
    }
```

* Register for any number of callbacks, for example:
```
    yetu.onActionUp = function(data, topic, channel){
        console.log("yetu TV 'UP' message received!");
    }
```

* You can also use the two methods to send messages to the yetu homescreen. If you send a plain message, inform the developers of the yetu homescreen to handle the messages.

In the example folder you can find an example, how the communication between the iFrame with your application and the
yetu homescreen works. Here you also see a lib folder, which includes flyer.js.

[Flyer.js](https://github.com/benzap/flyer.js)
is a library, which we use to realize the communication between the iFrame and the application. It is already
included in the yetu-tv-message-client-min.js. For the example, it is needed to realize the main application
endpoint for the message channel.

##How to test your application after integration of the yetu-tv-message-client:

###First opportunity

Use the index.html included in the example folder and point the src attribute of the iFrame to your application. Now you can click the buttons on the left of the screen to send messages.

###Second opportunity

Modify the the following call and execute it directly in the JS context or browser console of your application:

```
    flyer.wrapper.broadcast({
      channel: 'yetu',
      topic: 'control.left',//change this to your needs, i.e. 'control.right' or 'control.menu' etc.
      data: {}
    });
```

##Namespace

yetu

###Callbacks


####Action Callbacks
These callbacks are supported by the yetu-tv-message-client.

* onAnyActionDetected
* onActionUp
* onActionDown
* onActionLeft
* onActionRight
* onActionEnter
* onActionBack
* onActionMenu
* onActionPlay
* onActionRewind
* onActionForward

These are all actions the yetu remote control currently can produce except:

* The home button, which is supposed to reload the whole homescreen.

![RemoteControl](https://github.com/yetu/yetu-tv-message-client/blob/master/yetu_remote.png)

####Message Callback

Furthermore there is one callback which allows you to handle messages from the tv experience.

onReceiveMessage(data)

*Arguments*

field: first
type: object
description: data is an object, which contains the message as a field.

For now there are two messages defined:

* message = "notification arrived"
* message = "notification closed"

When the first message is sent, the tv experience displays an overlay for a incoming notification. Your app is
in background then. If you play some content, you should stop playing it, when you receive this message.

###Operations

On the namespace you can execute the following functions.

```
    yetu.sendMessage(message)
    yetu.sendQuit(message)
    yetu.sendFeedItemIndex(index)
```

####sendMessage

sends a message text to the yetu TV experience

*Arguments*

field: first
type: string
description: text message

*Response*

type: object
description: returns an object with an boolean field sent, which is true, if it was successful and otherwise it
is false. Furthermore there is a message field.

####sendFeedItemIndex

sends the index of the feed item (used from the feed apps to send the current index of the feed list items)

*Arguments*

field: first
type: number
description: feed item index

*Response*

type: object
description: returns an object with an boolean field sent, which is true, if it was successful and otherwise it
is false. Furthermore there is a message field.

####sendQuit

sends a quit signal with optional message text to the yetu TV experience

*Arguments*

field: first
type: string
description: text message

*Response*

type: object
description: returns an object with an boolean field sent, which is true, if it was successful and otherwise it
is false. Furthermore there is a message field.
