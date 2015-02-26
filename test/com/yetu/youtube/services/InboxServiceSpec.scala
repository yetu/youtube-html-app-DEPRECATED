package com.yetu.youtube.services

import com.yetu.youtube.utils.{FakeGlobal, BaseSpec}
import org.scalatest.time._
import play.api.Logger
import play.api.libs.json.{JsValue, Json}
import play.api.libs.ws.WSResponse

class InboxServiceSpec extends BaseSpec {

  implicit val defaultPatience =
    PatienceConfig(timeout = Span(6, Seconds), interval = Span(15, Millis))

  "InboxService" must {
    "send Message to Inbox and receives OK" in {

      val responseFuture = InboxService.sendToInbox(jsonDummyValue, fakeValidJWTAccessToken, "stream")

      whenReady(responseFuture){
        (x:WSResponse) =>
          Logger.info(s"${x.body}")
          x.status must be < 300
          x.status must be > 200
      }

    }

    "send Message with invalid access token to Inbox and receives 401" in {

      val responseFuture = InboxService.sendToInbox(jsonDummyValue, "invalid_access_token", "stream")

      whenReady(responseFuture){
        (x:WSResponse) =>
          Logger.info(s"${x.body}")
          x.status mustBe 401
      }

    }

  }

}
