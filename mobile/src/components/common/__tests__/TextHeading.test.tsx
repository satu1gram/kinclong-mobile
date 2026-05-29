import React from 'react';
import { render } from '@testing-library/react-native';
import { TextHeading } from '../TextHeading';

describe('TextHeading', () => {
  it('renders children correctly', () => {
    const { getByText } = render(<TextHeading>Hello Kinclong</TextHeading>);
    expect(getByText('Hello Kinclong')).toBeTruthy();
  });

  it('defaults to h2 level', () => {
    const { getByText } = render(<TextHeading>Default Heading</TextHeading>);
    const el = getByText('Default Heading');
    // Level h2 memiliki class text-3xl font-bold
    expect(el.props.className).toContain('text-3xl');
    expect(el.props.className).toContain('font-bold');
  });

  it('applies h1 level styles', () => {
    const { getByText } = render(<TextHeading level="h1">Big Title</TextHeading>);
    const el = getByText('Big Title');
    expect(el.props.className).toContain('text-4xl');
  });

  it('applies h3 level styles', () => {
    const { getByText } = render(<TextHeading level="h3">Section</TextHeading>);
    const el = getByText('Section');
    expect(el.props.className).toContain('text-xl');
    expect(el.props.className).toContain('font-semibold');
  });

  it('applies h4 level styles', () => {
    const { getByText } = render(<TextHeading level="h4">Widget</TextHeading>);
    const el = getByText('Widget');
    expect(el.props.className).toContain('text-lg');
  });

  it('applies primary color', () => {
    const { getByText } = render(
      <TextHeading color="primary">Colored</TextHeading>
    );
    const el = getByText('Colored');
    expect(el.props.className).toContain('text-primary-600');
  });

  it('applies white color on dark backgrounds', () => {
    const { getByText } = render(
      <TextHeading color="white">White Text</TextHeading>
    );
    const el = getByText('White Text');
    expect(el.props.className).toContain('text-white');
  });

  it('accepts all color variants', () => {
    const colors = ['default', 'primary', 'accent', 'muted', 'white'] as const;
    colors.forEach((color) => {
      const { getByText } = render(
        <TextHeading color={color}>{color}</TextHeading>
      );
      expect(getByText(color)).toBeTruthy();
    });
  });
});
