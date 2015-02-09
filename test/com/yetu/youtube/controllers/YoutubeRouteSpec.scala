package com.yetu.youtube.controllers

import com.yetu.youtube.utils.BaseSpec
import play.api.libs.json.Json
import play.api.test.Helpers._


class YoutubeRouteSpec extends BaseSpec {

  val indexUrl = "/"
  val publishUrl = com.yetu.youtube.controllers.routes.YoutubeController.playlist.url

  s"GET request on $indexUrl" must {
    "return a valid 200 response" in {

      val response = getRequestAuthenticated(indexUrl)
      status(response) mustEqual (OK)
      contentAsString(response) must include("YouTube")
    }

  }

  s"POST request on $publishUrl" must {
    "return a valid 204 response" in {

      val someJson = Json parse """{ "some": "test json" }"""
      val response = postRequestAuthenticated(publishUrl, someJson)
      status(response) mustEqual (NO_CONTENT)
    }

  }

}