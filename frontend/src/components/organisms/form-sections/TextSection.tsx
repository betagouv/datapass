import React from 'react';
import { ScrollablePanel } from '../Scrollable';

type TextSectionProps = {
  id: string;
  title: string;
  children?: React.ReactNode;
};

const TextSection: React.FC<TextSectionProps> = ({
  id = 'head',
  title,
  children,
}) => (
  <ScrollablePanel scrollableId={id}>
    {title && <h2>{title}</h2>}
    {children}
  </ScrollablePanel>
);

export default TextSection;
