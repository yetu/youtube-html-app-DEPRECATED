package com.yetu.youtube.services

import com.mohiva.play.silhouette.api.Logger
import com.yetu.youtube.models.{InboxMessage, Payload}
import com.yetu.youtube.utils.ConfigLoader.Inbox._
import play.api.Play.current
import play.api.libs.json.{JsValue, Json}
import play.api.libs.ws.{WS, WSResponse}

import scala.concurrent.Future

object InboxService extends Logger {

  def sendToInbox(data: JsValue, accessToken: String, eventName: String): Future[WSResponse] = {

    // create message to send
    val payload = Payload(data, eventName)
    val message = InboxMessage(accessToken, payload)
    val jsonMessage: JsValue = Json.toJson(message)

    logger.debug(s"posting the following message to $publishUrl: $jsonMessage")
    
    WS.url(publishUrl).post(jsonMessage)
  }


}
