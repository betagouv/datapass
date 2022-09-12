import '@gouvfr/dsfr/dist/dsfr/dsfr.min.css';
import * as Sentry from '@sentry/react';
import 'moment/locale/fr'; // set moment locale to french globally
import React from 'react';
import ReactDOM from 'react-dom';
import { createRoot } from 'react-dom/client';
import App from './App';

if (process.env.NODE_ENV === 'production') {
  Sentry.init({
    dsn: 'https://7ccf44097ef645f8835408b9d73e7781@sentry.data.gouv.fr/8',
    ignoreErrors: ['Error: Request failed with status code 401'],
  });
}

if (process.env.NODE_ENV !== 'production') {
  try {
    const axe = require('@axe-core/react');
    axe(React, ReactDOM, 1000);
  } catch {
    // ignoring silently
  }
}

const container = document.getElementById('root')!;
const root = createRoot(container);
root.render(<App />);
