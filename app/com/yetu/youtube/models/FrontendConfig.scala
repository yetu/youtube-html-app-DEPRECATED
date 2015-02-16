package com.yetu.youtube.models

import play.api.libs.json.Json

case class FrontendConfig(youtubeDeveloperToken: String,
                          authServer: String,
                          sessionPollingInterval: Int,
                          userUUID: String)

object FrontendConfig {
  implicit val PayloadFormat = Json.format[FrontendConfig]
}
