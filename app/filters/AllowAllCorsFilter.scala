package filters

import play.api.mvc._

import scala.concurrent.ExecutionContext.Implicits.global
import scala.concurrent.Future

trait AllowAllCorsFilter extends CorsFilterHelper {

  override def apply(next: (RequestHeader) => Future[Result])(requestHeader: RequestHeader): Future[Result] = {

    next(requestHeader).map(result => result.withHeaders(corsHeaders: _*))
  }
}


object AllowAllCorsFilter extends AllowAllCorsFilter
