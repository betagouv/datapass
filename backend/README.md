# Backend de DataPass

[![Rails tests](https://github.com/betagouv/signup-back/actions/workflows/ci.yml/badge.svg)](https://github.com/betagouv/signup-back/actions/workflows/ci.yml)
[![Maintainability](https://api.codeclimate.com/v1/badges/713ba5c1e90ee6a35937/maintainability)](https://codeclimate.com/github/betagouv/signup-back/maintainability)
[![Test Coverage](https://api.codeclimate.com/v1/badges/713ba5c1e90ee6a35937/test_coverage)](https://codeclimate.com/github/betagouv/signup-back/test_coverage)

Les instructions d’installation globale (via VMs / vagrant) se trouvent ici : https://github.com/betagouv/datapass

Pour le développement en local, suivez les instructions ci-dessous:

## Dépendances

- ruby 3.2.2
- redis
- postgresql 12.11

## Installation

Run `../bin/install.sh`

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

## Gestion des credentials

Il existe un service `Credentials` permettant de récupérer des infos sensibles
basé sur 2 systèmes:

1. Les [Rails credentials](https://edgeguides.rubyonrails.org/security.html#custom-credentials)
   pour la production (sandbox, staging et production)
2. Un fichier [`config/local.yml`](./config/local.yml) pour le développement
   local, avec des fausses données avec les mêmes clés.

Le fichier de credentials est architecturé de la manière suivante:

```yaml
sandbox:
  key1: value1
  key2: value2
staging:
  key1: value1
  key2: value2
production:
  key1: value1
  key2: value2
```

Le fichier local lui est architecturé de la manière suivante:

```yaml
key1: value1
key2: value2
```

Les clés sont iso.

Le fichier de credentials possède 3 clés correspondant à des
sous-environnements, sous-environnements correspondant aux 3 apps
sur les serveurs. Étant donné que l'environnement rails est `production` pour
les 3, la disjonction se fait à l'aide de cette clé.

Pour éditer ce fichier, il faut récupérer la master key dans le dépôt
[very\_ansible](https://github.com/etalab/very_ansible). Il n'est pas nécessaire
d'avoir cette master key pour faire des itérations fonctionnelles, uniquement
pour ajouter/changer des valeurs.

La commande à lancer:

```sh
rails credentials:edit --environment production
```

## Documentation

- [Implémentation des webhooks](./docs/webhooks.md)
- [Personnalisation des emails associés aux
  habilitations](./app/views/enrollment_mailer/README.md)
