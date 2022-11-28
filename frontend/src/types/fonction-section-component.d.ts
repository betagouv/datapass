import { FunctionComponent } from 'react';

export type FunctionSectionComponent<p = {}> = FunctionComponent<p> & {
  sectionLabel: string;
};
