import * as React from 'react';
import * as ReactTestUtils from 'react-dom/test-utils';
import { mount, ReactWrapper } from 'enzyme';
import { Customizations, ISettings } from './Customizations';
import { useCustomizationSettings } from './useCustomizationSettings';

describe('useCustomizatioSettings', () => {
  let wrapper: ReactWrapper | undefined;

  afterEach(() => {
    if (wrapper) {
      wrapper.unmount();
    }

    Customizations.reset();
  });

  it('get settings from Customizations', () => {
    Customizations.applySettings({ a: 'a' });
    const settingsStates: ISettings[] = [];

    const TestComponent: React.FunctionComponent = () => {
      const settings = useCustomizationSettings(['a']);

      settingsStates.push(settings);
      return null;
    };

    wrapper = mount(<TestComponent />);
    expect(settingsStates.length).toBe(1);
    expect(settingsStates[0]).toEqual({ a: 'a' });
  });

  it('get settings from Customizations when settings have changed', () => {
    Customizations.applySettings({ a: 'a' });
    const settingsStates: ISettings[] = [];

    const TestComponent: React.FunctionComponent = () => {
      const settings = useCustomizationSettings(['a']);

      settingsStates.push(settings);
      return null;
    };

    wrapper = mount(<TestComponent />);
    ReactTestUtils.act(() => {
      Customizations.applySettings({ a: 'aa' });
    });
    expect(settingsStates.length).toBe(2);
    expect(settingsStates[0]).toEqual({ a: 'a' });
    expect(settingsStates[1]).toEqual({ a: 'aa' });
  });

  it('get settings from Customizations that are not applied', () => {
    const settingsStates: ISettings[] = [];

    const TestComponent: React.FunctionComponent = () => {
      const settings = useCustomizationSettings(['a']);

      settingsStates.push(settings);
      return null;
    };

    wrapper = mount(<TestComponent />);
    expect(settingsStates.length).toBe(1);
    expect(settingsStates[0]).toEqual({ a: undefined });
  });
});
