## Implémentation d'un webhook

DataPass possède un système de webhooks permettant de souscrire aux différents
changement d'état d'une demande. Par défaut ce système est désactivé (en faveur
d'emails de notifications et d'un appel via un bridge (code spécifique au
fournisseur de service) lors d'une validation d'une demande).

Si vous voulez avoir un contrôle plus fin du cycle de vie des demandes, vous
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

Chacune des méthodes correspond à un événement associé à la demande datapass,
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
  "event": "refused",
  "fired_at": 1628253953,
  "model_type": "Pass",
  "data": {
    "pass": pass_data
  }
}
```

Avec:

- `event`, `string`: l'événement associé au changement d'état de la demande.
  Les valeurs possibles sont:
  - `created`: la demande datapass vient d'être créée ;
  - `updated`: la demande datapass a été mise à jour par le demandeur ;
  - `send_application`: la demande datapass a été envoyée par le demandeur ;
  - `refuse_application`: la demande datapass a été refusée par un instructeur ;
  - `review_application`: la demande datapass a été instruite par un instructeur et
    demande des modifications de la part du demandeur ;
  - `validate_application`: la demande datapass a été validée par un instructeur ;
  - `notify`: un instructeur a relancé la demande en cours d'édition par le
    demandeur ;
  - `owner_updated`: le demandeur de la demande datapass a été mise à jour
    par le demandeur ou un instructeur ;
  - `rgpd_contact_updated`: le DPO ou le responsable de traitement a été mis à
    jour par le demandeur ou un instructeur ;
- `fired_at`, `timestamp`: timestamp correspondant au moment où le webhook a été
  déclenché ;
- `model_type`, `string`: correspond au modèle de donnée. Pour le moment il n'y
  a que `Pass` comme valeur
- `data`, `json`: données ayant à minima les informations de la demande dans la
  clé `pass`, d'autres clés peuvent être présentes.
  `pass_data` utilise le serializer `WebhookEnrollmentSerializer`, et embarque
  l'ensemble des événements associé à la demande, ce qui permet de retrouver
  l'initiateur de l'événement (théoriquement il s'agit de la première entrée
  `events`) ;

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

Lors de l'événement `validate_application`, si votre système répond avec un ID de jeton
celui-ci sera affecté à la demande.

Le format attendu est au format json:

```json
{
  "token_id": "1234567890asdfghjkl"
}
```
