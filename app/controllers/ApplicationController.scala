package controllers

import javax.inject.Inject

import com.mohiva.play.silhouette.api.{Environment, LogoutEvent, Silhouette}
import com.mohiva.play.silhouette.impl.authenticators.SessionAuthenticator
import com.mohiva.play.silhouette.impl.providers.OAuth2Info
import models.daos.{OAuth2InfoDAO, UserDAO}
import models.services.{InboxService, UserService}
import models.{InboxMessage, Payload, User}
import utils.di.YetuProvider

import scala.concurrent.Future
import play.api.libs.json.{Json, JsValue}
import play.api.libs.ws.{WSResponse, WS}
import play.api.Play.current
import play.api.mvc.{Result, Action}
import utils.di.ConfigLoader.Youtube


import scala.concurrent.ExecutionContext.Implicits.global

/**
 * The basic application controller.
 *
 * @param env The Silhouette environment.
 */
class ApplicationController @Inject()(oauth2Dao: OAuth2InfoDAO) (implicit val env: Environment[User, SessionAuthenticator])
  extends Silhouette[User, SessionAuthenticator] {

  /**
   * Handles the index action.
   *
   */
  def index = SecuredAction.async { implicit request =>
    Future.successful(Ok(views.html.youtube_producer(Youtube.devToken)))
  }


  def playlist = SecuredAction.async(parse.json) {  implicit request =>

    for { //TODO: refactor
      info: Option[OAuth2Info] <- oauth2Dao.find(request.identity.loginInfo)
      accessToken: String = info.map(_.accessToken).getOrElse("Invalid access token")
      wsResponse <- InboxService.sendToInbox(request.body, accessToken)
      response = wsResponseToPlayResponse(wsResponse)
    } yield response

  }


  implicit def wsResponseToPlayResponse(response: WSResponse): Result = {
    //TODO: use class-specific logger
    play.Logger.info(s"response from outbox: status = ${response.status}, body = ${response.body}")
    new Status(response.status)
  }

  /**
   * Handles the Sign In action.
   *
   * @return The result to display.
   */
  def signIn = UserAwareAction.async { implicit request =>
    request.identity match {
      case Some(user) => Future.successful(Redirect(routes.ApplicationController.index))
      case None =>   Future.successful(Redirect(routes.SocialAuthController.authenticate(YetuProvider.Yetu)))
    }
  }


  /**
   * Handles the Sign Out action.
   * @return The result to display.
   */
  def signOut = SecuredAction.async { implicit request =>
    val result = Future.successful(Redirect(routes.ApplicationController.index))
    env.eventBus.publish(LogoutEvent(request.identity, request, request2lang))

    request.authenticator.discard(result)
  }
}



