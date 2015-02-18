package com.yetu.youtube.models

import play.api.libs.json.{JsValue, Json}

/**
 * Created by elisahilprecht on 04/02/15.
 */
case class Payload(
//                    timeToLive: Long,
//                    timestamp: Long,
                    data: JsValue,
                    event: String)

object Payload {
  implicit val PayloadFormat = Json.format[Payload]
}
