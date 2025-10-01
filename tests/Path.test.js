import React from 'react';
import { PATHS } from '../src/Path';

jest.mock('../src/base/HomePage', () => {
  return function MockHomePage() {
    return <div>HomePage</div>;
  };
});

jest.mock('../src/pages/ErrorPage', () => {
  return function MockErrorPage() {
    return <div>ErrorPage</div>;
  };
});

describe('PATHS Configuration', () => {
  test('exports PATHS array', () => {
    expect(PATHS).toBeDefined();
    expect(Array.isArray(PATHS)).toBe(true);
  });

  test('contains correct number of paths', () => {
    expect(PATHS).toHaveLength(2);
  });

  test('contains home path configuration', () => {
    const homePath = PATHS.find(path => path.path === '');
    expect(homePath).toBeDefined();
    expect(homePath.component).toBeDefined();
    expect(homePath.path).toBe('');
  });

  test('contains error path configuration', () => {
    const errorPath = PATHS.find(path => path.path === '*');
    expect(errorPath).toBeDefined();
    expect(errorPath.component).toBeDefined();
    expect(errorPath.path).toBe('*');
  });

  test('all paths have required properties', () => {
    PATHS.forEach((path) => {
      expect(path).toHaveProperty('path');
      expect(path).toHaveProperty('component');
      expect(typeof path.path).toBe('string');
      expect(React.isValidElement(path.component)).toBe(true);
    });
  });
});