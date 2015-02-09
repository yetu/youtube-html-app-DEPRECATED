package com.yetu.youtube.controllers

import play.api.mvc.{Controller, Action}

object Health extends Controller {

  def check = Action {
    Ok("alive!")
  }

}
