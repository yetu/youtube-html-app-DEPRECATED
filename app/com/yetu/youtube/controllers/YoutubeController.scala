package com.yetu.youtube.controllers


import javax.inject.Inject

import com.mohiva.play.silhouette.api.{Environment, Silhouette}
import com.mohiva.play.silhouette.impl.authenticators.SessionAuthenticator
import com.mohiva.play.silhouette.impl.providers.OAuth2Info
import com.yetu.play.authenticator.models.User
import com.yetu.play.authenticator.models.daos.OAuth2InfoDAO
import com.yetu.youtube.models.{SimpleFrontendConfig, FrontendConfig}
import com.yetu.youtube.services.InboxService
import com.yetu.youtube.utils.ConfigLoader
import com.yetu.youtube.utils.ConfigLoader.FrontendConfiguration
import com.yetu.youtube.utils.ConfigLoader.Inbox._
import com.yetu.youtube.views
import play.api.libs.json.{JsValue, Json}
import play.api.libs.ws.WSResponse
import play.api.mvc.{Action, Result}

import scala.concurrent.ExecutionContext.Implicits.global

/**
 * The Youtube application controller
 *
 * @param env The Silhouette environment.
 */
class YoutubeController @Inject()(implicit val env: Environment[User, SessionAuthenticator], oauth2Dao: OAuth2InfoDAO)
  extends Silhouette[User, SessionAuthenticator] {

  /**
   * Handles the index / first page action.
   *
   */
  def index = SecuredAction { implicit request =>

    val config = FrontendConfig(userUUID = request.identity.loginInfo.providerKey,
      youtubeDeveloperToken = FrontendConfiguration.devToken,
      authServer = FrontendConfiguration.authServerUrl,
      sessionPollingInterval = FrontendConfiguration.sessionPollingInterval)
    Ok(views.html.index(Json.toJson(config)))
  }
  
  def level2tv = Action { implicit request =>
    val config = SimpleFrontendConfig(youtubeDeveloperToken = FrontendConfiguration.devToken)
    Ok(views.html.youtubeViewerLevel2TV(Json.toJson(config)))
  }
  
  def sendNotification(request: SecuredRequest[JsValue], eventName:String) = {
    for {
      info: Option[OAuth2Info] <- oauth2Dao.find(request.identity.loginInfo)
      accessToken: String = info.map(_.accessToken).getOrElse("Invalid access token")
      wsResponse <- InboxService.sendToInbox(request.body, accessToken, eventName)
      response = wsResponseToPlayResponse(wsResponse)
    } yield response
    
  }

  /**
   * Handles the "send to TV" request
   */
  def playlist = SecuredAction.async(parse.json) { implicit request =>
    sendNotification(request,youtubeEventName)
  }

	/**
   * Handles the "general notification" request, this will be moved to a separate application one day
   */
  def notification = SecuredAction.async(parse.json) { implicit request =>
    sendNotification(request,notificationEventName)
  }

  private def wsResponseToPlayResponse(response: WSResponse): Result = {
    logger.info(s"response from inbox: status = ${response.status}, body = ${response.body}")
    new Status(response.status)
  }

  //FIXME: this is not the optimal path to go 
  // -> discussion needed how we handle our stages synchronized to the apps ones
  def manifest = Action { implicit request =>
    Redirect(controllers.routes.Assets.at(ConfigLoader.manifestUrl))
  }

}



