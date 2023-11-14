class AuthenticatedUserController < ApplicationController
  before_action :authenticate_user!
end
