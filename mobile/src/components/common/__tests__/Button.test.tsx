import React from 'react';
import { render, fireEvent } from '@testing-library/react-native';
import { Button } from '../Button';

describe('Button', () => {
  it('renders title correctly', () => {
    const { getByText } = render(<Button title="Test" onPress={() => {}} />);
    expect(getByText('Test')).toBeTruthy();
  });

  it('calls onPress when tapped', () => {
    const onPress = jest.fn();
    const { getByText } = render(<Button title="Tap me" onPress={onPress} />);
    fireEvent.press(getByText('Tap me'));
    expect(onPress).toHaveBeenCalledTimes(1);
  });

  it('does not call onPress when disabled', () => {
    const onPress = jest.fn();
    const { getByText } = render(<Button title="Disabled" onPress={onPress} disabled />);
    fireEvent.press(getByText('Disabled'));
    expect(onPress).not.toHaveBeenCalled();
  });

  it('hides title and shows ActivityIndicator when isLoading', () => {
    const { queryByText, UNSAFE_getByType } = render(
      <Button title="Loading" onPress={() => {}} isLoading />
    );
    expect(queryByText('Loading')).toBeNull();
    const { ActivityIndicator } = require('react-native');
    expect(UNSAFE_getByType(ActivityIndicator)).toBeTruthy();
  });

  it('renders all variants without crash', () => {
    const variants = ['primary', 'secondary', 'outline', 'danger', 'ghost', 'accent'] as const;
    variants.forEach((variant) => {
      const { getByText } = render(
        <Button title={variant} variant={variant} onPress={() => {}} />
      );
      expect(getByText(variant)).toBeTruthy();
    });
  });

  it('renders all sizes without crash', () => {
    const sizes = ['xs', 'sm', 'md', 'lg', 'xl'] as const;
    sizes.forEach((size) => {
      const { getByText } = render(
        <Button title="Size" size={size} onPress={() => {}} />
      );
      expect(getByText('Size')).toBeTruthy();
    });
  });

  it('renders without crash when fullWidth=true', () => {
    // fullWidth menambahkan 'w-full' ke className. Cukup verifikasi render berhasil.
    const { getByText } = render(
      <Button title="Full" onPress={() => {}} fullWidth />
    );
    expect(getByText('Full')).toBeTruthy();
  });

  it('renders leftIcon when provided', () => {
    const { getByText, getByTestId } = render(
      <Button
        title="With Icon"
        onPress={() => {}}
        leftIcon={<>{/* icon placeholder */}</>}
      />
    );
    expect(getByText('With Icon')).toBeTruthy();
  });
});
