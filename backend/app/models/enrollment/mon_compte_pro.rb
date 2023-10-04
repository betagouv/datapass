class Enrollment::MonComptePro < Enrollment
  include EnrollmentValidators::ValidateAtLeastOneScopePresence
end
