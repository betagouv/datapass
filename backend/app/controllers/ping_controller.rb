class PingController < ApplicationController
  def show
    render plain: "pong"
  end
end
