import * as React from 'react';
import { IDocPageProps } from '../../common/DocPage.types';
import { ListBasicExample } from './examples/List.Basic.Example';
import { ListGridExample } from './examples/List.Grid.Example';
import { ListScrollingExample } from './examples/List.Scrolling.Example';
import { ListGhostingExample } from './examples/List.Ghosting.Example';

const ListBasicExampleCode = require('!raw-loader!office-ui-fabric-react/src/components/List/examples/List.Basic.Example.tsx') as string;
const ListGridExampleCode = require('!raw-loader!office-ui-fabric-react/src/components/List/examples/List.Grid.Example.tsx') as string;
const ListScrollingExampleCode = require('!raw-loader!office-ui-fabric-react/src/components/List/examples/List.Scrolling.Example.tsx') as string;
const ListGhostingExampleCode = require('!raw-loader!office-ui-fabric-react/src/components/List/examples/List.Ghosting.Example.tsx') as string;

export const ListPageProps: IDocPageProps = {
  title: 'List',
  componentName: 'ListExample',
  componentUrl: 'https://github.com/microsoft/fluentui/tree/master/packages/office-ui-fabric-react/src/components/List',
  examples: [
    {
      title: 'List of 5000 grid items',
      code: ListGridExampleCode,
      view: <ListGridExample />,
    },
    {
      title: 'List of 5000 variable height items',
      code: ListBasicExampleCode,
      view: <ListBasicExample />,
    },
    {
      title: 'Scrolling items into view',
      code: ListScrollingExampleCode,
      view: <ListScrollingExample />,
    },
    {
      title: 'Rendering ghost items while the list is scrolling',
      code: ListGhostingExampleCode,
      view: <ListGhostingExample />,
    },
  ],

  allowNativeProps: true,
  overview: require<string>('!raw-loader!office-ui-fabric-react/src/components/List/docs/ListOverview.md'),
  isHeaderVisible: true,
  isFeedbackVisible: true,
};
