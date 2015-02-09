package com.yetu.youtube.controllers

import com.yetu.youtube.utils.BaseSpec
import play.api.test.Helpers._


class HealthRouteSpec extends BaseSpec {

  val healthUrl = "/health"

  s"GET request on $healthUrl" must {
    "return a valid 200 response" in {

      val response = getRequestAuthenticated(healthUrl)
      status(response) mustEqual (OK)
      contentAsString(response) must include("alive")
    }

  }

}