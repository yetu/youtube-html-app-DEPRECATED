package com.yetu.youtube.models

import play.api.libs.json.Json

case class FrontendConfig(youtubeDeveloperToken: String,
                          authServer: String,
                          sessionPollingInterval: Int,
                          userUUID: String)

object FrontendConfig {
  implicit val PayloadFormat = Json.format[FrontendConfig]
}


case class SimpleFrontendConfig(youtubeDeveloperToken: String)

object SimpleFrontendConfig {
  implicit val PayloadFormat = Json.format[SimpleFrontendConfig]
}