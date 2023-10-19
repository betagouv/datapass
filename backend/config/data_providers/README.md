# Configuration des fournisseurs

Ce dossier référence les configurations des divers fournisseurs sur DataPass.
L'ensemble des emails envoyés pour une demande sont configurés ici. Il est
possible de créer une configuration plus poussée du formulaire directement en
YAML, vous pouvez vous réferer à la configuration
[api\_particulier.yml](api_particulier.yml) pour un exemple.

## Procédure

Pour une api donnée nommée "Ma superbe API":

1. Copier le fichier [00_template.yml.example](00_template.yml.example) vers
   `ma_superbe_api.yml`
1. Remplacer la clé `your_api_path` par `ma_superbe_api`: cette clé sert au
   chemin dans DataPass
1. Remplacer le label par "Ma superbe API"
1. Pour la clé `mailer`, vous pouvez la configurer en vous inspirant de la
   configuration de [api\_entreprise.yml](api_entreprise.yml). La configuration
   par défaut fonctionne aussi.

Si vous voulez modifier une configuration existante: celle-ci se trouve dans
[others.yml](others.yml), déportez là dans un fichier à part comme pour les
autres afin de rendre les modifications plus simples.
