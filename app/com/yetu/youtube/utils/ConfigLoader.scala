package com.yetu.youtube.utils

import com.typesafe.config.ConfigFactory

object ConfigLoader {

  private val config = ConfigFactory.load()

  object AuthServer {
    val profileUrl = config.getString("silhouette.yetu.profileURL")
  }

  object Youtube {
    val devToken = config.getString("youtube.devToken")
  }

  val indexUrl = com.yetu.youtube.controllers.routes.YoutubeController.index

  object Inbox {
    val publishUrl = config.getString("inbox.publishUrl")
    val eventName = config.getString("inbox.eventName")
    val timeToLive = config.getLong("inbox.timeToLive")
  }

}