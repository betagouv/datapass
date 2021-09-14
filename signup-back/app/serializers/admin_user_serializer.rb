class AdminUserSerializer < ActiveModel::Serializer
  attributes :id, :email, :roles
end
