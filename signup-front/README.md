# Frontend de DataPass

## Installation

### Avec un backend distant

Cette installation utilise le backend disponible sur https://back.datapass-test.api.gouv.fr. L'installation est simple et rapide mais ne permet pas de développements sur le backend.

Installer NodeJs version ^12.18.

Cloner le dépot de code puis installer les dépendances npm :

```
git clone git@github.com:betagouv/signup-front.git
cd signup-front
npm i
```

Lancer le serveur :

```
npm run dev-with-remote-backend
```

### Avec un backend local

Cette installation utilise un backend lancé dans virtualbox. L'installation est donc beaucoup plus longue que la première mais permet de faire des développements sur le backend.

Les instructions d'installation se trouvent ici : https://github.com/betagouv/datapass

## Usage statistics

This project uses [Matomo](https://matomo.org/) to report usage statistics.
To use your Matomo credentials to the app, pass them as environment variables

```bash
PIWIK_URL=http://mywebsite.domain
PIWIK_SITE_ID=123456789
```

If you don't use Matomo, pass:

```bash
PIWIK_URL=''
PIWIK_SITE_ID=''
```

The usage of this project can be seen on [http://www.stats.data.gouv.fr](http://stats.data.gouv.fr/index.php?module=CoreHome&action=index&idSite=53&period=range&date=previous30#?module=Dashboard&action=embeddedIndex&idSite=53&period=range&date=previous30&idDashboard=1)

## License

MIT

Powered by: [<img src="http://www.browserstack.com/images/layout/browserstack-logo-600x315.png" height="100"/>](https://www.browserstack.com/)
