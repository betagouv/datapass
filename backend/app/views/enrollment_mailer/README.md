# Personnalisation des emails

Il est possible de personnaliser certains emails en fonction du type de service
impliqué dans l’habilitation

Les emails personnalisables envoyés après modification de l'instructeur sont:

1. L'email de refus d'une habilitation
1. L'email de demande de modification d'une habilitation
1. L'email de validation d'une habilitation

Ces 3 emails sont à destination du demandeur, et personnalisable depuis
l'interface d'instruction sur Datapass.

Les emails personnalisables envoyés directement depuis le backend de DataPass:

1. L'email de création d'une demande d’habilitation
1. L'email d'envoi d'une demande’habilitation

## Comportement par défaut pour tous les services

Par défaut, les emails sont envoyés en fonction du type d'action, la vue
utilisée est:

* [refuse.text.erb](refuse.text.erb) pour un refus
* [request_changes.text.erb](request_changes.text.erb) pour une demande de modification
* [validate.text.erb](validate.text.erb) pour une validaton
* [create.text.erb](create.text.erb) pour une création
* [submit.text.erb](submit.text.erb) pour un envoi
* [revoke.text.erb](revoke.text.erb) pour une révocation

L'ensemble de l'email au format text se trouve au sein des fichiers ci-dessus.

Une modification sur l'un de ces fichiers impacte l'intégralité des services
utilisant Datapass : si vous voulez effectuer une modification sur un service
particulier, utilisez la méthode décrite ci-dessous.

## Procédure de modification d'un email pour un service en particulier

1. Créer un dossier `target_api` (si celui-ci n'existe pas)
   correspondant au nom technique de votre service. Vous pouvez trouver ce nom
   dans le fichier [data_providers.yml](../../config/data_providers.yml).
   Par exemple pour API Entreprise, il faut créer le dossier `api_entreprise`.
2. Créer le fichier correspondant à l'email que vous voulez personnaliser. Par
   exemple, dans le cas d'API Entreprise pour l'email de demande de
   modification, il faut créer le fichier
   `api_entreprise/request_changes.text.erb`
3. Mettre **l'intégralité** du contenu de l'email, avec l'introduction et la
   signature : cet email sera renvoyé tel quel

Vous pouvez de même modifier le sujet de l'email au besoin directement dans le
fichier [data_providers.yml](../../config/data_providers.yml) sous la clé correspondant à
votre service.

Par exemple pour API Entreprise, si on modifie seulement le sujet de
`refuse`.

```yaml
api_entreprise:
  label: API Entreprise
  support_email: support@entreprise.api.gouv.fr
  mailer:
    submit: *shared_submit_mailer
    validate: *shared_validate_mailer
    request_changes: *shared_request_changes_mailer
    refuse:
      subject: "Votre habilitation pour API Entreprise a été refusée"
    notify_submitted: *shared_notify_submitted_mailer
    create: *shared_create_mailer
    notify: *shared_notify_mailer
    revoke: *shared_notify_mailer
```

A noter qu'il faut obligatoirement inclure tous les templates si vous voulez
effectuer une modification.

### Liste des variables disponibles dans les templates

La liste des variables interpolables sont les suivantes:

* `@user`, le demandeur. Il est possible d'avoir accès à des attributs tel que
    le prénom, nom, email etc etc..
* `@instructor`, l'instructeur qui effectue l’instruction de l’habilitation. Il est possible
*   d'avoir accès à des attributs tel que
    le prénom, nom, email etc etc..
* `@enrollment`, l’habilitation
* `@url`, lien vers l’habilitation
* `@target_api_label`, nom du service (exemple: `FranceConnect`)
* `@front_url`, lien vers le site de Datapass

Un exemple d'utilisation des variables:

```erb
Bonjour <%= "#{@user.given_name} #{@user.family_name}" %>,

Votre demande d’habilitation n°<%= @enrollment.id %> a été traitée par notre service juridique, il nous manque cependant certaines informations pour rendre un avis.

Pour compléter votre demande d’habilitation, suivez le lien suivant <%= @url %>
<%= @instructor.given_name %> pour <%= @target_api_label %>
```
