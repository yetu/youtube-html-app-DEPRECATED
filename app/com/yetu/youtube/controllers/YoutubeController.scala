package com.yetu.youtube.controllers


import javax.inject.Inject

import com.mohiva.play.silhouette.api.{Environment, Silhouette}
import com.mohiva.play.silhouette.impl.authenticators.SessionAuthenticator
import com.mohiva.play.silhouette.impl.providers.OAuth2Info
import com.yetu.youtube.models.FrontendConfig
import com.yetu.youtube.services.InboxService
import com.yetu.youtube.utils.ConfigLoader
import play.api.libs.json.{JsValue, Json}
import play.api.libs.ws.WSResponse
import play.api.mvc.{Action, Result}
import com.yetu.youtube.utils.ConfigLoader.{FrontendConfiguration}

import com.yetu.play.authenticator.models.User
import com.yetu.play.authenticator.models.daos.OAuth2InfoDAO

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
  def index = SecuredAction { implicit request =>


    val config = FrontendConfig(userUUID = request.identity.loginInfo.providerKey,
    youtubeDeveloperToken = FrontendConfiguration.devToken,
    authServer = FrontendConfiguration.authServerUrl,
    sessionPollingInterval = FrontendConfiguration.sessionPollingInterval)

    val configJson = Json.toJson(config)


    Ok(views.html.index(configJson))
  }

  /**
   * Handles the "send to TV" request
   */
  def playlist = SecuredAction.async(parse.json) {  implicit request =>

    for {
      info: Option[OAuth2Info] <- oauth2Dao.find(request.identity.loginInfo)
      accessToken: String = info.map(_.accessToken).getOrElse("Invalid access token")
      wsResponse <- InboxService.sendToInbox(request.body, accessToken)
      response = wsResponseToPlayResponse(wsResponse)
    } yield response

  }

  private def wsResponseToPlayResponse(response: WSResponse): Result = {
    logger.info(s"response from inbox: status = ${response.status}, body = ${response.body}")
    new Status(response.status)
  }
  
  //FIXME: this is not the optimal path to go 
  // -> discussion needed how we handle our stages synchronized to the apps ones
  def manifest = Action { implicit request =>
    Redirect(controllers.routes.Assets.at( ConfigLoader.manifestUrl))
  };

}



