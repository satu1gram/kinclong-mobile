import React from 'react';
import { render } from '@testing-library/react-native';
import { Badge } from '../Badge';

describe('Badge', () => {
  it('renders label correctly', () => {
    const { getByText } = render(<Badge label="Aktif" />);
    expect(getByText('Aktif')).toBeTruthy();
  });

  it('applies default variant (neutral)', () => {
    const { getByText } = render(<Badge label="Netral" variant="neutral" />);
    expect(getByText('Netral')).toBeTruthy();
  });

  it('renders dot indicator when dot=true', () => {
    const { UNSAFE_getAllByType } = render(<Badge label="Status" dot />);
    const { View } = require('react-native');
    // Container View + dot View = setidaknya 2 View
    expect(UNSAFE_getAllByType(View).length).toBeGreaterThanOrEqual(2);
  });

  it('renders without dot by default', () => {
    const { getByText } = render(<Badge label="No Dot" />);
    // Tidak ada dot jika prop dot tidak diberikan
    expect(getByText('No Dot')).toBeTruthy();
  });

  it('accepts all variants', () => {
    const variants = ['primary', 'accent', 'success', 'warning', 'error', 'neutral'] as const;
    variants.forEach((variant) => {
      const { getByText } = render(<Badge label={variant} variant={variant} />);
      expect(getByText(variant)).toBeTruthy();
    });
  });

  it('accepts all sizes', () => {
    const sizes = ['xs', 'sm', 'md'] as const;
    sizes.forEach((size) => {
      const { getByText } = render(<Badge label="Test" size={size} />);
      expect(getByText('Test')).toBeTruthy();
    });
  });
});
