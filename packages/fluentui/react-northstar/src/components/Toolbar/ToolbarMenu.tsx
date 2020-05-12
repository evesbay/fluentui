import {
  Accessibility,
  toolbarMenuBehavior,
  toolbarMenuItemCheckboxBehavior,
  ToolbarMenuBehaviorProps,
} from '@fluentui/accessibility';
import {
  getElementType,
  useUnhandledProps,
  useAccessibility,
  useStyles,
  useTelemetry,
  ComponentWithAs,
} from '@fluentui/react-bindings';
import { compose } from '@fluentui/react-compose';
import { Ref } from '@fluentui/react-component-ref';
import * as customPropTypes from '@fluentui/react-proptypes';
import { mergeComponentVariables } from '@fluentui/styles';
import * as _ from 'lodash';
import * as PropTypes from 'prop-types';
import * as React from 'react';
// @ts-ignore
import { ThemeContext } from 'react-fela';

import {
  createShorthandFactory,
  createShorthand,
  commonPropTypes,
  childrenExist,
  UIComponentProps,
  ChildrenComponentProps,
  ContentComponentProps,
  ShorthandFactory,
  ShorthandConfig,
} from '../../utils';

import { ComponentEventHandler, ShorthandCollection, ShorthandValue, ProviderContextPrepared } from '../../types';

import ToolbarMenuRadioGroup, { ToolbarMenuRadioGroupProps } from './ToolbarMenuRadioGroup';
import ToolbarMenuDivider from './ToolbarMenuDivider';
import ToolbarMenuItem, { ToolbarMenuItemProps } from './ToolbarMenuItem';
import { BoxProps } from '../Box/Box';
import { ToolbarVariablesContext, ToolbarVariablesProvider } from './toolbarVariablesContext';

export type ToolbarMenuItemShorthandKinds = 'divider' | 'item' | 'toggle';

export interface ToolbarMenuProps extends UIComponentProps, ChildrenComponentProps, ContentComponentProps {
  /**
   * Accessibility behavior if overridden by the user.
   */
  accessibility?: Accessibility<ToolbarMenuBehaviorProps>;

  /** Shorthand array of props for ToolbarMenu. */
  items?: ShorthandCollection<ToolbarMenuItemProps, ToolbarMenuItemShorthandKinds>;

  /**
   * Called on item click.
   *
   * @param event - React's original SyntheticEvent.
   * @param data - All item props.
   */
  onItemClick?: ComponentEventHandler<ToolbarMenuItemProps>;

  /** Indicates whether the menu is submenu. */
  submenu?: boolean;

  /** Shorthand for the submenu indicator. */
  submenuIndicator?: ShorthandValue<BoxProps>;
}

export type ToolbarMenuStylesProps = never;
export const toolbarMenuClassName = 'ui-toolbar__menu';

/**
 * A ToolbarMenu creates a pop-up menu attached to a ToolbarItem.
 *
 * @accessibility
 * Implements pop-up menu (submenu) behavior of [ARIA Menu](https://www.w3.org/TR/wai-aria-practices-1.1/#menu) design pattern.
 */
const ToolbarMenu = compose<'ul', ToolbarMenuProps, ToolbarMenuStylesProps, {}, {}>(
  (props, ref, composeOptions) => {
    const context: ProviderContextPrepared = React.useContext(ThemeContext);
    const { setStart, setEnd } = useTelemetry(composeOptions.displayName, context.telemetry);
    setStart();

    const { accessibility, className, children, design, items, submenu, submenuIndicator, styles, variables } = props;

    const slotProps = composeOptions.resolveSlotProps<ToolbarMenuProps>(props);
    const parentVariables = React.useContext(ToolbarVariablesContext);
    const mergedVariables = mergeComponentVariables(parentVariables, variables);

    const getA11yProps = useAccessibility(accessibility, {
      debugName: composeOptions.displayName,
      actionHandlers: {
        performClick: e => {
          _.invoke(props, 'onClick', e, props);
        },
      },
      rtl: context.rtl,
    });
    const { classes } = useStyles<ToolbarMenuStylesProps>(composeOptions.displayName, {
      className: composeOptions.className,
      composeOptions,
      mapPropsToInlineStyles: () => ({
        className,
        design,
        styles,
        variables: mergedVariables,
      }),
      rtl: context.rtl,
      unstable_props: props,
    });

    const handleItemOverrides = predefinedProps => ({
      onClick: (e, itemProps) => {
        _.invoke(predefinedProps, 'onClick', e, itemProps);
        _.invoke(props, 'onItemClick', e, {
          ...itemProps,
          menuOpen: !!itemProps.menu,
        });
      },
    });

    const handleRadioGroupOverrides = (predefinedProps: ToolbarMenuRadioGroupProps) => ({
      onItemClick: (e, itemProps) => {
        _.invoke(predefinedProps, 'onItemClick', e, itemProps);
        _.invoke(props, 'onItemClick', e, itemProps);
      },
    });

    const renderItems = () => {
      return _.map(items, item => {
        const kind = _.get(item, 'kind', 'item');

        switch (kind) {
          case 'divider':
            return createShorthand(composeOptions.slots.divider, item, {
              defaultProps: () => slotProps.divider,
            });

          case 'group':
            return ToolbarMenuRadioGroup.create(item, { overrideProps: handleRadioGroupOverrides });

          case 'toggle':
            return createShorthand(composeOptions.slots.item || ToolbarMenuItem, item, {
              defaultProps: () => ({ accessibility: toolbarMenuItemCheckboxBehavior }),
              overrideProps: handleItemOverrides,
            });

          default:
            return createShorthand(composeOptions.slots.item || ToolbarMenuItem, item, {
              defaultProps: () => ({
                submenuIndicator,
                inSubmenu: submenu,
              }),
              overrideProps: handleItemOverrides,
            });
        }
      });
    };

    const ElementType = getElementType(props);
    const unhandledProps = useUnhandledProps(composeOptions.handledProps, props);

    const element = getA11yProps.unstable_wrapWithFocusZone(
      <ElementType {...getA11yProps('root', { ...unhandledProps, className: classes.root })}>
        <ToolbarVariablesProvider value={mergedVariables}>
          {childrenExist(children) ? children : renderItems()}
        </ToolbarVariablesProvider>
      </ElementType>,
    );
    setEnd();

    // TODO: As ElementType is wrapped with FocusZone which doesn't ref forwarding we have to use Ref
    return ref ? <Ref innerRef={(ref as unknown) as React.Ref<HTMLElement>}>{element}</Ref> : element;
  },
  {
    displayName: 'ToolbarMenu',
    className: toolbarMenuClassName,
    handledProps: [
      'accessibility',
      'as',
      'children',
      'className',
      'content',
      'design',
      'items',
      'onItemClick',
      'styles',
      'submenu',
      'submenuIndicator',
      'variables',
    ],
    slots: {
      divider: ToolbarMenuDivider,
      // item: ToolbarMenuItem,
    },
  },
) as ComponentWithAs<'ul', ToolbarMenuProps> & {
  create: ShorthandFactory<ToolbarMenuProps>;
  shorthandConfig: ShorthandConfig<ToolbarMenuProps>;
};

ToolbarMenu.propTypes = {
  ...commonPropTypes.createCommon(),
  items: customPropTypes.collectionShorthandWithKindProp(['divider', 'item']),
  onItemClick: PropTypes.func,
  submenu: PropTypes.bool,
  submenuIndicator: customPropTypes.shorthandAllowingChildren,
};
ToolbarMenu.defaultProps = {
  accessibility: toolbarMenuBehavior,
  as: 'ul',
};

ToolbarMenu.create = createShorthandFactory({ Component: ToolbarMenu, mappedArrayProp: 'items' });
ToolbarMenu.shorthandConfig = {
  mappedArrayProp: 'items',
};

export default ToolbarMenu;
