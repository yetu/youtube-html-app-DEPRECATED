package filters

import play.api.mvc._

trait CorsFilterHelper extends Filter {

  val corsHeaders = Seq("Access-Control-Allow-Origin" -> "*",
    "Access-Control-Allow-Methods" -> "POST, GET, OPTIONS, PUT, DELETE",
    "Access-Control-Allow-Headers" -> "x-requested-with,content-type,Cache-Control,Pragma,Date")

}
