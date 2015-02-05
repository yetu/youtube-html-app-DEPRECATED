package controllers

import javax.inject.Inject

import com.mohiva.play.silhouette.api.{Environment, LogoutEvent, Silhouette}
import com.mohiva.play.silhouette.impl.authenticators.SessionAuthenticator
import models.{InboxMessage, Payload, User}
import utils.di.YetuProvider

import scala.concurrent.Future
import play.api.libs.json.{Json, JsValue}
import play.api.libs.ws.{WSResponse, WS}
import play.api.Play.current
import play.api.mvc.Action
import utils.di.ConfigLoader.Youtube

/**
 * The basic application controller.
 *
 * @param env The Silhouette environment.
 */
class ApplicationController @Inject() (implicit val env: Environment[User, SessionAuthenticator])
  extends Silhouette[User, SessionAuthenticator] {

  /**
   * Handles the index action.
   *
   * @return The result to display.
   */
  def index = SecuredAction.async { implicit request =>
    Future.successful(Ok(views.html.youtube(Youtube.devToken)))
  }

  /**
   *
   */
  def playlist = SecuredAction(parse.json){  implicit request =>
    request.body
    NoContent
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

object InboxService {
  def sendToInbox(data:JsValue, accessToken:String): Future[WSResponse] = {
    val url = "http://inbox.yetu.me/publish"
    val timeToLive = 10000L
    val timestamp = 1000L
    val event = "transferPlaylist"
    val payload = Payload(timeToLive, timestamp, data, event)
    val message: InboxMessage = InboxMessage(accessToken, payload)

    val jsonMessage: JsValue = Json.toJson(message)
    WS.url(url).post(jsonMessage)
  }
}

