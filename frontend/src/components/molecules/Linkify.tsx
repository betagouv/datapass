import LinkifyReact from 'linkify-react';
import 'linkify-plugin-ticket';
import Link from '../atoms/hyperTexts/Link';

type Props = {
  message: string;
};

const linkifyOptions = {
  formatHref: {
    ticket: (href: string) => '/authorization-request/' + href.substring(1),
  },
  attributes: { inline: true },
  tagName: () => Link,
};

export const Linkify: React.FC<Props> = ({ message }) => (
  <LinkifyReact options={linkifyOptions}>{message}</LinkifyReact>
);
