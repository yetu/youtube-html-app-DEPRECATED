package com.yetu.youtube.utils

import com.typesafe.config.ConfigFactory

object ConfigLoader {

  private val config = ConfigFactory.load()

  object AuthServer {
    val profileUrl = config.getString("silhouette.yetu.profileURL")
  }


  object FrontendConfiguration {
    val devToken = config.getString("frontendConfig.devToken")
    val authServerUrl = config.getString("frontendConfig.authServerUrl")
    val sessionPollingInterval = config.getInt("frontendConfig.sessionPollingInterval")
  }

  val indexUrl = com.yetu.youtube.controllers.routes.YoutubeController.index

  object Inbox {
    val publishUrl = config.getString("inbox.publishUrl")
    val eventName = config.getString("inbox.eventName")
    val timeToLive = config.getLong("inbox.timeToLive")
  }

  val manifestUrl = config.getString("manifestUrl")

}