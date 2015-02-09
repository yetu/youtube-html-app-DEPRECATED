package com.yetu.youtube.controllers

import com.yetu.youtube.utils.BaseSpec
import play.api.libs.json.Json
import play.api.test.{FakeHeaders, FakeRequest}
import play.api.test.Helpers._


class YoutubeRouteSpec extends BaseSpec {

  val indexUrl = "/"
  val publishUrl = com.yetu.youtube.controllers.routes.YoutubeController.playlist.url



  s"non-authenticated GET request on $indexUrl" must {
    "return a 303 response" in {

      val Some(response) = route(FakeRequest(GET, indexUrl))
      status(response) mustEqual (SEE_OTHER)
    }

  }

  s"non-authenticated POST request on $publishUrl" must {
    "return a 303 response" in {

      val Some(response) = route(FakeRequest(POST, publishUrl, FakeHeaders(), jsonDummyValue))
      log(contentAsString(response))
      status(response) mustEqual (SEE_OTHER)
    }

  }

  s"authenticated GET request on $indexUrl" must {
    "return a valid 200 response" in {

      val response = getRequestAuthenticated(indexUrl)
      status(response) mustEqual (OK)
      contentAsString(response) must include("YouTube")
    }

  }

  s"authenticated POST request on $publishUrl" must {
    "make a real request to inbox and get a 401 invalid access_token response" in {

      val response = postRequestAuthenticated(publishUrl, jsonDummyValue)
      status(response) mustEqual (UNAUTHORIZED)
    }

  }

}