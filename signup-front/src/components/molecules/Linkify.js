import React from 'react';
import LinkifyReact from 'linkify-react';
import 'linkify-plugin-ticket';
import Link from './hyperTexts/Link';

const linkifyOptions = {
  formatHref: {
    ticket: (href) => '/authorization-request/' + href.substring(1),
  },
  attributes: { inline: true },
  tagName: () => Link,
};

export const Linkify = ({ message }) => (
  <LinkifyReact options={linkifyOptions}>{message}</LinkifyReact>
);
