import React from 'react';
import LinkifyReact from 'linkify-react';
import 'linkify-plugin-ticket';

const linkifyOptions = {
  formatHref: {
    ticket: (href) => '/authorization-request/' + href.substring(1),
  },
};

export const Linkify = ({ message }) => (
  <LinkifyReact options={linkifyOptions}>{message}</LinkifyReact>
);
