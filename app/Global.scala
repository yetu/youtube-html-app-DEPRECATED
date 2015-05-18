package app

import com.google.inject.Guice
import com.mohiva.play.silhouette.api.{Logger, SecuredSettings}
import controllers.routes
import com.yetu.play.authenticator.filters.AllowAllCorsFilter
import play.api.GlobalSettings
import play.api.i18n.{Lang, Messages}
import play.api.mvc.Results._
import play.api.mvc.{EssentialAction, RequestHeader, Result}
import com.yetu.play.authenticator.utils.di.{SilhouetteModule}

import scala.concurrent.Future
import com.yetu.play.authenticator.AuthenticatorGlobal
import com.yetu.play.authenticator.utils.di.YetuProvider

/**
 * The global object.
 */
object Global extends Global

/**
 * The global configuration.
 */
trait Global extends GlobalSettings with AuthenticatorGlobal with Logger {}
