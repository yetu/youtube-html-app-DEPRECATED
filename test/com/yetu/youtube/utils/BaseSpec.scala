package com.yetu.youtube.utils

import org.scalatest.concurrent.{AsyncAssertions, ScalaFutures}
import org.scalatestplus.play.{OneAppPerSuite, PlaySpec}
import play.api.Logger
import play.api.mvc.{AnyContentAsEmpty, Result}
import play.api.test.{FakeRequest, FakeHeaders}
import play.api.test.Helpers._

import scala.concurrent.Future

class BaseSpec extends PlaySpec with ScalaFutures with AsyncAssertions with OneAppPerSuite {

  lazy val logger = Logger("TEST")
  def log(s: String) = logger.debug(s)

  def getRequest(url: String, headers: FakeHeaders = FakeHeaders()): Future[Result] = {
    route(FakeRequest(GET, url, headers, AnyContentAsEmpty)) match {
      case Some(response) =>
        log(s"content $url: ${contentAsString(response)}")
        log(s"status $url: ${status(response)}")
        redirectLocation(response).map {
          location => log(s"redirectLocation of $url: $location")
        }

        response
      case None => throw new Exception(s"The url '$url' is not valid.")
    }
  }

  def postRequest(url: String, parameters: Map[String, Seq[String]] = Map(), fakeHeaders: FakeHeaders = FakeHeaders()): Future[Result] = {
    route(FakeRequest(POST, url, fakeHeaders, parameters)) match {
      case Some(response) =>
        log(s"response: ${contentAsString(response)}")
        log(s"response status: ${status(response)}")
        log(s"response location: ${header("Location", response)}")
        log(s"response headers: ${headers(response)}")
        response
      case None => throw new Exception(s"The url '$url' is not valid.")
    }
  }

}
