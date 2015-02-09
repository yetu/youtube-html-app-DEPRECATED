package utils.di

import com.mohiva.play.silhouette.api.LoginInfo
import com.mohiva.play.silhouette.api.util.HTTPLayer

import com.mohiva.play.silhouette.impl.exceptions.ProfileRetrievalException
import com.mohiva.play.silhouette.impl.providers._
import com.yetu.youtube.utils.ConfigLoader
import utils.di.YetuProvider.API
import utils.di.YetuProvider.SpecifiedProfileError
import utils.di.YetuProvider._

import scala.concurrent.Future
import play.api.libs.json.{ JsValue, JsObject }
import play.api.libs.concurrent.Execution.Implicits._

import YetuProvider._
import ConfigLoader._



/**
 * A copy of a Google OAuth2 Provider for yetu provider
 *
 * @param httpLayer The HTTP layer implementation.
 * @param stateProvider The state provider implementation.
 * @param settings The provider settings.
 *
 * @see https://developers.google.com/+/api/auth-migration#timetable
 * @see https://developers.google.com/+/api/auth-migration#oauth2login
 * @see https://developers.google.com/accounts/docs/OAuth2Login
 * @see https://developers.google.com/+/api/latest/people
 */
abstract class YetuProvider(httpLayer: HTTPLayer, stateProvider: OAuth2StateProvider, settings: OAuth2Settings)
  extends OAuth2Provider(httpLayer, stateProvider, settings) {


  /**
   * The content type to parse a profile from.
   */
  type Content = JsValue

  /**
   * Gets the provider ID.
   *
   * @return The provider ID.
   */
  def id = Yetu


  /**
   * Defines the URLs that are needed to retrieve the profile data.
   */
  protected val urls = Map("api" -> API)


  /**
   * Builds the social profile.
   *
   * @param authInfo The auth info received from the provider.
   * @return On success the build social profile, otherwise a failure.
   */
  protected def buildProfile(authInfo: OAuth2Info): Future[Profile] = {
    httpLayer.url(urls("api").format(authInfo.accessToken)).get().flatMap { response =>
      val json = response.json
      (json \ "error").asOpt[JsObject] match {
        case Some(error) =>
          val errorCode = (error \ "code").as[Int]
          val errorMsg = (error \ "message").as[String]

          throw new ProfileRetrievalException(SpecifiedProfileError.format(id, errorCode, errorMsg))
        case _ => profileParser.parse(json)
      }
    }
  }


}


/**
 * The profile parser for the common social profile.
 */
class YetuProfileParser extends SocialProfileParser[JsValue, CommonSocialProfile] {

  /**
   * Parses the social profile.
   *
   * @param json The content returned from the provider.
   * @return The social profile from given result.
   */
  def parse(json: JsValue) = Future.successful {
    val userID = (json \ "userId").as[String]
    val firstName = (json \ "firstName").asOpt[String]
    val lastName = (json \ "lastName").asOpt[String]
    val email = (json \ "email").asOpt[String]
    val fullName = (json \ "displayName").asOpt[String]
    val avatarURL = (json \ "image" \ "url").asOpt[String]


    CommonSocialProfile(
      loginInfo = LoginInfo(Yetu, userID),
      firstName = firstName,
      lastName = lastName,
      fullName = fullName,
      avatarURL = avatarURL,
      email = email)
  }
}

/**
 * The profile builder for the common social profile.
 */
trait YetuProfileBuilder extends CommonSocialProfileBuilder {
  self: YetuProvider =>

  /**
   * The profile parser implementation.
   */
  val profileParser = new YetuProfileParser
}

/**
 * The companion object.
 */
object YetuProvider {

  /**
   * The error messages.
   */
  val SpecifiedProfileError = "[Silhouette][%s] Error retrieving profile information. Error code: %s, message: %s"

  /**
   * The Yetu constants.
   */
  val Yetu = "yetu"

  val API = AuthServer.profileUrl + "?access_token=%s"


  /**
   * Creates an instance of the provider.
   *
   * @param httpLayer The HTTP layer implementation.
   * @param stateProvider The state provider implementation.
   * @param settings The provider settings.
   * @return An instance of this provider.
   */
  def apply(httpLayer: HTTPLayer, stateProvider: OAuth2StateProvider, settings: OAuth2Settings) = {
    new YetuProvider(httpLayer, stateProvider, settings) with YetuProfileBuilder
  }

}