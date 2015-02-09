package com.yetu.youtube.controllers


import javax.inject.Inject

import com.mohiva.play.silhouette.api.{Environment, Silhouette}
import com.mohiva.play.silhouette.impl.authenticators.SessionAuthenticator
import com.mohiva.play.silhouette.impl.providers.OAuth2Info
import com.yetu.youtube.services.InboxService
import com.yetu.youtube.utils.ConfigLoader
import models.daos.OAuth2InfoDAO
import play.api.libs.ws.WSResponse
import play.api.mvc.Result
import ConfigLoader.Youtube

import models.User

import scala.concurrent.ExecutionContext.Implicits.global
import scala.concurrent.Future

import com.yetu.youtube.views

/**
* The Youtube application controller
*
* @param env The Silhouette environment.  (oauth2Dao: OAuth2InfoDAO)
*/
class YoutubeController @Inject() (implicit val env: Environment[User, SessionAuthenticator], oauth2Dao:OAuth2InfoDAO)
  extends Silhouette[User, SessionAuthenticator] {

  /**
   * Handles the index action.
   *
   */
  def index = SecuredAction.async { implicit request =>
    Future.successful(Ok(views.html.index(Youtube.devToken)))
  }

  def playlist = SecuredAction.async(parse.json) {  implicit request =>

    for { //TODO: refactor
      info: Option[OAuth2Info] <- oauth2Dao.find(request.identity.loginInfo)
      accessToken: String = info.map(_.accessToken).getOrElse("Invalid access token")
      wsResponse <- InboxService.sendToInbox(request.body, accessToken)
      response = wsResponseToPlayResponse(wsResponse)
    } yield response

    Future.successful(Ok(""))

  }

  implicit def wsResponseToPlayResponse(response: WSResponse): Result = {
    logger.info(s"response from inbox: status = ${response.status}, body = ${response.body}")
    new Status(response.status)
  }


}



