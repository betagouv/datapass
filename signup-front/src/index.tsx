import ReactDOM from 'react-dom';
import 'template.data.gouv.fr/dist/main.css';
import '@gouvfr/dsfr/dist/css/dsfr.css';
import App from './App';
import { unregister as unregisterServiceWorker } from './registerServiceWorker';
import 'moment/locale/fr'; // set moment locale to french globally

import Raven from 'raven-js';

// Setup sentry
if (process.env.NODE_ENV === 'production') {
  Raven.config(
    'https://7ccf44097ef645f8835408b9d73e7781@sentry.data.gouv.fr/8'
  ).install();
}

ReactDOM.render(<App />, document.getElementById('root'));
unregisterServiceWorker();
