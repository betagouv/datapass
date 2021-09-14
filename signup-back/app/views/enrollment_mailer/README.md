# Personnalisation des emails

Il est possible de personnaliser certains emails en fonction du type de service
impliqué dans la demande Datapass.

Les emails personnalisables envoyés après modification de l'instructeur sont:

1. L'email de refus d'une demande
1. L'email de demande de modification d'une demande
1. L'email de validation d'une demande

Ces 3 emails sont à destination du demandeur, et personnalisable depuis
l'interface d'instruction sur Datapass.

Les emails personnalisables envoyés directement depuis le backend de DataPass:

1. L'email de création d'une demande
1. L'email d'envoi d'une demande

## Comportement par défaut pour tous les services

Par défaut, les emails sont envoyés en fonction du type d'action, la vue
utilisée est:

* [refuse_application.text.erb](refuse_application.text.erb) pour un refus
* [review_application.text.erb](review_application.text.erb) pour une demande de modification
* [validate_application.text.erb](validate_application.text.erb) pour une validaton
* [create_application.text.erb](create_application.text.erb) pour une création
* [send_application.text.erb](send_application.text.erb) pour un envoi
* [validate_application.text.erb](validate_application.text.erb) pour une validaton

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
   `api_entreprise/review_application.text.erb`
3. Mettre **l'intégralité** du contenu de l'email, avec l'introduction et la
   signature : cet email sera renvoyé tel quel

Vous pouvez de même modifier le sujet de l'email au besoin directement dans le
fichier [data_providers.yml](../../config/data_providers.yml) sous la clé correspondant à
votre service.

Par exemple pour API Entreprise, si on modifie seulement le sujet de
`refuse_application`.

```yaml
api_entreprise:
  label: API Entreprise
  support_email: support@entreprise.api.gouv.fr
  mailer:
    send_application: *shared_send_application_mailer
    validate_application: *shared_validate_application_mailer
    review_application: *shared_review_application_mailer
    refuse_application:
      subject: "Votre demande pour API Entreprise a été refusée"
    notify_application_sent: *shared_notify_appication_sent_mailer
    create_application: *shared_create_application_mailer
    notify: *shared_notify_mailer
```

A noter qu'il faut obligatoirement inclure tous les templates si vous voulez
effectuer une modification.

### Liste des variables disponibles dans les templates

La liste des variables interpolables sont les suivantes:

* `@user`, le demandeur. Il est possible d'avoir accès à des attributs tel que
    le prénom, nom, email etc etc..
* `@instructor`, l'instructeur qui effectue la modération de la demande. Il est possible
*   d'avoir accès à des attributs tel que
    le prénom, nom, email etc etc..
* `@enrollment`, la demande d'habilitation
* `@url`, lien vers la demande d'habilitation
* `@target_api_label`, nom du service (exemple: `FranceConnect`)
* `@front_url`, lien vers le site de Datapass

Un exemple d'utilisation des variables:

```erb
Bonjour <%= "#{@user.given_name} #{@user.family_name}" %>,

Votre demande d’habilitation n°<%= @enrollment.id %> a été traitée par notre service juridique, il nous manque cependant certaines informations pour rendre un avis.

Pour compléter votre demande, suivez le lien suivant <%= @url %>
<%= @instructor.given_name %> pour <%= @target_api_label %>
```
