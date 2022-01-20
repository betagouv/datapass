import ReactDOM from 'react-dom';
import '@gouvfr/dsfr/dist/dsfr/dsfr.css';
import App from './App';
import 'moment/locale/fr'; // set moment locale to french globally
import * as Sentry from '@sentry/react';

if (process.env.NODE_ENV === 'production') {
  Sentry.init({
    dsn: 'https://7ccf44097ef645f8835408b9d73e7781@sentry.data.gouv.fr/8',
  });
}

ReactDOM.render(<App />, document.getElementById('root'));
