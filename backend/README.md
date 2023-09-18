# Backend de DataPass

[![Rails tests](https://github.com/betagouv/signup-back/actions/workflows/ci.yml/badge.svg)](https://github.com/betagouv/signup-back/actions/workflows/ci.yml)
[![Maintainability](https://api.codeclimate.com/v1/badges/713ba5c1e90ee6a35937/maintainability)](https://codeclimate.com/github/betagouv/signup-back/maintainability)
[![Test Coverage](https://api.codeclimate.com/v1/badges/713ba5c1e90ee6a35937/test_coverage)](https://codeclimate.com/github/betagouv/signup-back/test_coverage)

Les instructions d’installation globale (via VMs / vagrant) se trouvent ici : https://github.com/betagouv/datapass

Pour le développement en local, suivez les instructions ci-dessous:

## Dépendances

- ruby 3.2.2
- postgresql 12.11

## Installation

```sh
bundle install
psql -f db/setup.local.sql
rails db:schema:load
```

## Configuration

Modifier le fichier `.env.development` pour y ajouter le client ID de
MonComptePro de test (clé `DATAPASS_OAUTH_CLIENT_ID`), le client id se trouve
dans le fichier [fixture de
MonComptePro](https://github.com/betagouv/moncomptepro/blob/master/scripts/fixtures.sql)
(lien dans le fichier `.env` aussi)

## Tests

```sh
bundle exec rspec
# Avec code coverage
COVERAGE=true bundle exec rspec
```

Vous pouvez utiliser [guard](https://github.com/guard/guard) pour lancer les
tests en continue:

```sh
bundle exec guard
```

## Run

```sh
bundle exec foreman start -f Procfile.dev
```

## Brakeman

[Brakeman](https://github.com/presidentbeef/brakeman) est un outil d'analyse
statique de sécurité. Vous pouvez le faire tourner à l'aide la commande
suivante:

```sh
bundle exec brakeman -Iconfig/brakeman.ignore
```

## Documentation

- [Implémentation des webhooks](./docs/webhooks.md)
- [Personnalisation des emails associés aux
  habilitations](./app/views/enrollment_mailer/README.md)
