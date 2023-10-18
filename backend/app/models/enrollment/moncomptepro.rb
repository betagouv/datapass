class Enrollment::Moncomptepro < Enrollment
  include EnrollmentValidators::ValidateAtLeastOneScopePresence
end
