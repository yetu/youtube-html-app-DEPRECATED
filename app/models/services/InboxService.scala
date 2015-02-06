package models.services

import models.{User, InboxMessage, Payload}
import play.api.libs.json.{JsValue, Json}
import play.api.libs.ws.{WS, WSResponse}

import scala.concurrent.Future
import scala.concurrent.ExecutionContext.Implicits.global
import play.api.Play.current

//TODO: convert to class + trait to ease testing
//TODO: extract configuration values
object InboxService {


  val publishUrl = "http://inbox.yetu.me/publish"
  

  def sendToInbox(data:JsValue, accessToken:String): Future[WSResponse] = {

    val jsonMessage: JsValue = Json.toJson(prepareMessage(data, accessToken))

    //TODO: use class-specific logger
    play.Logger.info(s"posting the following message to $publishUrl: $jsonMessage")
    WS.url(publishUrl).post(jsonMessage)
  }

  //TODO: extract configuration values
  def prepareMessage(data:JsValue, accessToken:String): InboxMessage = {
    val timeToLive = 10000L
    val timestamp = 1000L
    val event = "transferPlaylist" //TODO: agree on naming of events.
    val payload = Payload(timeToLive, timestamp, data, event)
    val message: InboxMessage = InboxMessage(accessToken, payload)
    message
  }
  

  

  
  
}
