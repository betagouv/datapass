## Implémentation d'un webhook

DataPass possède un système de webhooks permettant de souscrire aux différents
changement d'état d'une habilitation. Par défaut ce système est désactivé (en faveur
d'emails de notifications et d'un appel via un bridge (code spécifique au
fournisseur de service) lors d'une validation d'une habilitation).

Si vous voulez avoir un contrôle plus fin du cycle de vie des habilitations, vous
pouvez utiliser ce système (par exemple pour gérer un CRM, mettre en place des
statistiques..).

Le système de webhooks utilise l'approche du token de vérification et du header
`X-Hub-Signature-256` permettant d'authentifier les appels depuis le endpoint cible.

L'implémentation des webhooks s'effectue en 2 étapes: une partie sur DataPass et
une partie sur votre système.

### Partie 1: DataPass

Afin de pouvoir activer les webhooks sur DataPass, il faut définir 2 variables
d'environnement:

1. Une jeton de vérification qui permettra de signer les appels ;
2. L'URL du endpoint qui acceptera les appels webhooks.

Avec le service identifié dans DataPass comme `super_service`, les variables
seront:

1. `SUPER_SERVICE_VERIFY_TOKEN`
1. `SUPER_SERVICE_WEBHOOK_URL`

Par exemple pour API Entreprise, identifié comme `api_entreprise`, les variables
sont:

1. `API_ENTREPRISE_VERIFY_TOKEN`
1. `API_ENTREPRISE_WEBHOOK_URL`

Dès que ces 2 variables sont définies, l'activation du système de webhook
s'effectue en créant un notifier spécifique au système portant le nom de
`SuperServiceNotifier`, qui hérite de
[`AbstractNotifier`](./app/notifiers/abstract_notifier.rb).

Chacune des méthodes correspond à un événement associé à l’habilitation,
défini dans le modèle `Enrollment` (la description de chacun de ces événements
se trouve plus bas dans ce document)

Le comportement par défaut est défini dans
[`BaseNotifier`](./app/notifiers/base_notifier.rb)

Il est possible de mixer, en fonction de l'événement, l'envoi d'email ou de
webhooks. Un exemple d'implémentation qui utilise des webhooks et des emails
est disponible ici:
[`ApiEntrepriseNotifier`](./app/notifiers/api_entreprise_notifier.rb)

### Partie 2: Système recevant les webhooks

Le système de webhook effectue des requêtes HTTP de type POST, avec comme `body`
un json qui est sous le format ci-dessous :

```json
{
  "event": "refuse",
  "fired_at": 1628253953,
  "model_type": "Pass",
  "data": {
    "pass": pass_data
  }
}
```

Avec:

- `event`, `string`: l'événement associé au changement d'état de l’habilitation.
  Les valeurs possibles sont:
  - `create`: la demande d’habilitation vient d'être créée ;
  - `update`: l’habilitation a été mise à jour par le demandeur ;
  - `submit`: la demande d’habilitation a été envoyée par le demandeur ;
  - `refuse`: l’habilitation a été refusée par un instructeur ;
  - `revoke`: l’habilitation a été refusée par un administrateur ;
  - `request_changes`: la demande d’habilitation a été instruite par un instructeur et
    demande des modifications de la part du demandeur ;
  - `validate`: l’habilitation a été validée par un instructeur ;
  - `notify`: un instructeur a relancé la demande d’habilitation en cours d’édition par le
    demandeur ;
- `fired_at`, `timestamp`: timestamp correspondant au moment où le webhook a été
  déclenché ;
- `model_type`, `string`: correspond au modèle de donnée. Pour le moment il n'y
  a que `Pass` comme valeur
- `data`, `json`: données ayant à minima les informations de l’habilitation dans la
  clé `pass`, d'autres clés peuvent être présentes.
  `pass_data` utilise le serializer
  [`WebhookEnrollmentSerializer`](../app/serializers/webhook_enrollment_serializer.rb), et embarque
  l'ensemble des événements associé à l’habilitation, ce qui permet de retrouver
  l'initiateur de l'événement (théoriquement il s'agit de la première entrée
  `events`) ;

Un exemple de payload pour `pass_data`:

```json
{
  // ID technique de l’habilitation
  "id": 9001,
  // Correspond au nom du projet dans l'UI
  "intitule": "Marché public",
  // Correspond à la description du projet dans l'UI
  "description": "Permettre de répondre aux marché public de la ville de Cambrai",
  // Il s'agit de l'identifiant technique d'un potentiel template
  "demarche": "marche_public",
  // Numéro de siret de l'organisation à laquelle le demandeur est associé
  "siret": "13002526500013",
  // Status de l’habilitation. Les valeurs peuvent être:
  // * draft : en attente d'envoi
  // * submitted : demande d’habilitation envoyée
  // * changes_requested : la demande d’habilitation a été revue par un instructeur et demande des modifications
  // * validated : habilitation validée
  // * refused : habilitation refusée
  // * revoked : habilitation révoquée
  "status": "draft",
  // ID de la habilitation qui a été copiée (peut être vide si il s'agit d'une nouvelle habilitation)
  "copied_from_enrollment_id": 5432,
  // ID de la précédente habilitation
  "previous_enrollment_id": 2345,
  // Liste des données associé au service. Cette liste est dynamique en fonction du service cible.
  "scopes": {
    "entreprises": true,
    "exercices": false
  },
  // Liste des personnes associées à cette habilitation.
  // Cette liste contient systématiquement le demandeur (type 'demandeur')
  "team_members": [
    {
      // ID technique interne du contact
      "id": 678,
      // Email de la personne
      "email": "technique@cambrai.fr",
      // Nom de famille de la personne
      "family_name": "Tech",
      // Prénom de la personne
      "given_name": "Nicolas",
      // Poste de la personne
      "job": "Directeur technique",
      // Numéro de téléphone de la personne
      "phone_number": "0636656565",
      // Type de contact. Une liste non-exhautive: responsable_technique, responsable_traitement, contact_metier, delegue_protection_donnees, demandeur
      "type": "responsable_technique",
      // ID interne issue du Compte DataPass. Contrairement à "id", cet identifiant est attaché à la personne et reste le même à travers différentes habilitations.
      "uid": 23455
    },
    {
      "id": 679,
      "email": "demandeur@cambrai.fr",
      "family_name": "Demandeur",
      "given_name": "Julien",
      "job": "Responsable des achats",
      "phone_number": "0636666666",
      "type": "demandeur",
      "uid": 26455
    }
  ],
  // Liste de l'intégralité des événements associés à cette habilitation
  "events": [
    {
      // ID technique interne
      "id": 6789,
      // Nom de l'événement (cf. liste ci-dessus)
      "name": "create",
      // Commentaire associé à cet événement. Il s'agit généralement d'un commentaire d'instructeur lors de la modération de la demande d’habilitation
      "comment": null,
      // Date de l'événement
      "created_at": "2021-09-20 14:41:09 UTC",
      // Utilisateur ayant initié l'action
      "user": {
        // ID technique interne
        "id": 34987,
        // ID interne issue de MonComptePro (fournisseur d’identité sur DataPass)
        "uid": 23347,
        // Email de la personne
        "email": "technique@cambrai.fr",
        // Nom de famille de la personne
        "family_name": "Tech",
        // Prénom de la personne
        "given_name": "Nicolas",
        // Poste de la personne
        "job": "Directeur technique",
        // Numéro de téléphone de la personne
        "phone_number": "0636656565"
      }
    }
  ]
}
```

La requête HTTP possède comme `Application-Type` la valeur
`application/json`

Votre serveur doit obligatoirement répondre avec un status de succès. Les codes
HTTP considérés comme étant un succès sont `200`, `201` et `204`.

Niveau sécurité, afin de garantir que la payload envoyée est bien émise par
DataPass, 2 headers sont ajoutés à la requête :

- `X-Hub-Signature-256`, `string` : [HMAC en SHA256 ( Hash-based Message Authentication Code
  )](https://fr.wikipedia.org/wiki/HMAC) ayant pour clé la valeur de jeton de
  vérification et comme données le contenu du body de la requête.

Ce header permet d'authentifier chaque payload reçu par votre
système : en effet, vu que le token de vérification est seulement connu de
DataPass et de votre système, il est impossible pour un attaquant de forger une
requête et de taper sur votre système sans connaître la valeur du token de
vérification.

⚠️ Il est **impératif de vérifier la valeur `X-Hub-Signature-256` dans votre système**, le cas contraire n'importe
quel personne connaissant l'url de votre service pourra exploiter cette faille
et donc générer des accès à vos données.

Ci dessous un exemple (en ruby/rails) qui vérifie la valeur du `X-Hub-Signature-256`:

```ruby
hub_signature = request.headers['X-Hub-Signature-256']
payload_body = request.body
verify_token = ENV['DATAPASS_WEBHOOK_VERIFY_TOKEN']

compute_hub_signature = 'sha256=' + OpenSSL::HMAC.hexdigest(OpenSSL::Digest.new('sha256'), verify_token, payload_body)

# La valeur ci-dessous est true si la signature est valide
Rack::Utils.secure_compare(hub_signature, compute_hub_signature)
```

Lors de l'événement `validate`, si votre système répond avec un ID de jeton
celui-ci sera affecté à l’habilitation.

Le format attendu est au format json:

```json
{
  "token_id": "1234567890asdfghjkl"
}
```
