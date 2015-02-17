package com.yetu.youtube.utils

import com.mohiva.play.silhouette.impl.authenticators.SessionAuthenticator
import org.scalatest.concurrent.{AsyncAssertions, ScalaFutures}
import org.scalatestplus.play.{OneAppPerSuite, PlaySpec}
import play.api.libs.json.{JsNull, JsValue}
import play.api.mvc.{AnyContentAsEmpty, Result}
import play.api.test.Helpers._
import play.api.test.{FakeApplication, FakeHeaders, FakeRequest}

// used for the withAuthenticator and fake login information as specified in the FakeGlobal

import com.mohiva.play.silhouette.api.Logger
import com.mohiva.play.silhouette.test.FakeRequestWithAuthenticator

import scala.concurrent.Future

class BaseSpec extends PlaySpec with ScalaFutures with AsyncAssertions with OneAppPerSuite with Logger with TestData {

  def log(s: String) = logger.debug(s)


  def getRequestAuthenticated(url: String, headers: FakeHeaders = FakeHeaders()): Future[Result] = {

    route(FakeRequest(GET, url, headers, AnyContentAsEmpty).withAuthenticator[SessionAuthenticator](FakeGlobal.identity.loginInfo)(FakeGlobal.env)
    ) match {
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

  def postRequestAuthenticated(url: String, parameters: JsValue = JsNull, fakeHeaders: FakeHeaders = FakeHeaders()): Future[Result] = {
    route(FakeRequest(POST, url, fakeHeaders, parameters)
      .withAuthenticator[SessionAuthenticator](FakeGlobal.identity.loginInfo)(FakeGlobal.env)) match {
      case Some(response) =>
        log(s"response: ${contentAsString(response)}")
        log(s"response status: ${status(response)}")
        log(s"response location: ${header("Location", response)}")
        log(s"response headers: ${headers(response)}")
        response
      case None => throw new Exception(s"The url '$url' is not valid.")
    }
  }

  //for all tests, use the FakeGlobal with Authentication mocked out.
  implicit override lazy val app: FakeApplication =
    FakeApplication(withGlobal = Some(new FakeGlobal))


}
