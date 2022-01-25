class FullUserSerializer < ActiveModel::Serializer
  attributes :id, :email, :given_name, :family_name, :phone_number, :job, :roles, :organizations
end
