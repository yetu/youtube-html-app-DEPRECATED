package com.yetu.youtube.models

import play.api.libs.json.Json

/**
 * Created by elisahilprecht on 03/02/15.
 */
case class InboxMessage(
                         token: String,
                         payload: Payload)

object InboxMessage {
  implicit val InboxMessageFormat = Json.format[InboxMessage]
}


