# Ajout d'un nouveau fournisseur

Pour un fournisseur `mon_fournisseur`:

1. Inspirez-vous de la configuration pour `mon_compte_pro` ou/et
   `api_particulier` dans le fichier
   [data\_providers.yml](../config/data_providers.yml), avec la clé
   `mon_fournisseur`
2. Créer le modèle `Enrollment::MonFournisseur` dans `app/models/enrollment` ayant pour
   structure minimale:

   ```ruby
   class Enrollment::MonFournisseur < Enrollment
   end
   ```
3. Créer la policy `Enrollment::MonFournisseurPolicy` dans
   `app/policies/enrollment/` ayant pour structure minimale:

   ```ruby
   class Enrollment::MonFournisseurPolicy < EnrollmentPolicy
     include PolicyConfigurationFromFile
   end
   ```

Si vous avez des scopes et que au moins l'un d'eux doit être présent: incluez le fichier `EnrollmentValidators::ValidateAtLeastOneScopePresence` dans le modèle de la manière suivante:

```ruby
class Enrollment::MonFournisseur < Enrollment
  include EnrollmentValidators::ValidateAtLeastOneScopePresence
end
```

Vous pouvez vous inspirer des autres modèles/policies présent dans les dossiers
pour les configurations.
