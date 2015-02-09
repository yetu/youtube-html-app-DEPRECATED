package com.yetu.youtube.services

import com.yetu.youtube.utils.BaseSpec
import org.scalatest.time._
import play.api.Logger
import play.api.libs.json.{JsValue, Json}
import play.api.libs.ws.WSResponse

class InboxServiceSpec extends BaseSpec {

  implicit val defaultPatience =
    PatienceConfig(timeout = Span(6, Seconds), interval = Span(15, Millis))

  "InboxService" must {
    "send Message to Inbox and receives OK" ignore { //TODO: refactor tests
      val jsonValue:JsValue = Json parse """{"source":"453672727272"}"""
      val accessToken = "eyJhbGciOiJSUzUxMiIsInR5cCI6IkpXVCJ9.eyJjbGllbnRJZCI6ImNvbW1hbmRsaW5lIiwidXNlclVVSUQiOiIyZDIxNzUzNi1hYTA0LTQ5OGYtYWM3MC0zYmZkY2I2ZDllMzIiLCJleHAiOjE0MjMxMTM3NzcsImlhdCI6MTQyMzA2Mzc3Nywic3ViIjoiMmQyMTc1MzYtYWEwNC00OThmLWFjNzAtM2JmZGNiNmQ5ZTMyIiwiYXVkIjoiY29tbWFuZGxpbmUiLCJpc3MiOiJodHRwczovL2F1dGgueWV0dWRldi5jb20ifQ.nEG2_4zwndfOYPBBNtf8bAVCP8KdSk-M7qSmG0GaubZ5KKGUq0k4QsJ5v3d3jy9O-70K3wRDEV3B4x3jdzS2P1_0YqXPSZV40-B4FWb_7J9wwJurKuhcrCcjngWVfMUtjHCwdRqv0L1CS5IOoVetZCQ6ge8m_IULo-iYpcDXCPjP9mGLYVDcxzi7kuVeS9202OQEyux-KTxJloPobWSHqnet8AIZp6nIJDHwF1cbB_16LcM_O6kQ4HMz-Sbz8fxlgoJNiv0yNgmSHMKGq1eFNyXeE-dYrgyG1o0579Rd1viIknfX5eld5Y9rw91nMhVJ8Nra1UmUcqt2xLj4d4fTqiVT0UAT-Q5Z65k8s-md38KT9DYQU-Ka4sUSVwe1YPDWawwpmYn8LUtSPtQqwPk1NLnJDFz3CkEfyyckXgKurQtEZloxSAmyZTjs0KIM73-AdIfYlUz_GfSBr_awbzH3IFwKggYlFUKGqizXp9WwNk051gmewlvyDnoBwsjsmUGY_SAtXM3mV0E0pBuECjJ7BD2udeRZHUTgk52MliUaLJXu-e-LJjc7E6Z4mYuXoioYh8v9aHJCnyOP5BrPyiFkUS2Fi-KbXPeG9415t1FEqbYu3rEUhQst1KAFzmkvFo6Er7Jv-yOJWShO0AfnWRHHtqkth-SKQrDjtZSN4vHkv8s"

      val responseFuture = InboxService.sendToInbox(jsonValue, accessToken)

      //TODO: 200 or 202
      whenReady(responseFuture){
        (x:WSResponse) =>
          Logger.info(s"${x.body}")
          x.status mustBe (202)
      }

    }
  }

}
