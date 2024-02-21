import '@gouvfr/dsfr/dist/dsfr/dsfr.min.css';
import * as Sentry from '@sentry/react';
import 'moment/locale/fr'; // set moment locale to french globally
import React from 'react';
import ReactDOM from 'react-dom';
import { createRoot } from 'react-dom/client';
import App from './App';

if (process.env.NODE_ENV === 'production') {
  Sentry.init({
    dsn: 'https://734f9d63f50f23785ff2321cf06a37f2@o4506784314490880.ingest.sentry.io/4506784465354752',
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
