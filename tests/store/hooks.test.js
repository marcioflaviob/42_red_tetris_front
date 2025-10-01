import { useAppDispatch, useAppSelector } from '../../src/store/hooks';
import { useDispatch, useSelector } from 'react-redux';

// Mock react-redux hooks
jest.mock('react-redux', () => ({
  useDispatch: jest.fn(),
  useSelector: jest.fn(),
}));

const mockUseDispatch = useDispatch;
const mockUseSelector = useSelector;

describe('Redux Hooks', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  test('useAppDispatch should return useDispatch result', () => {
    const mockDispatch = jest.fn();
    mockUseDispatch.mockReturnValue(mockDispatch);

    const result = useAppDispatch();

    expect(mockUseDispatch).toHaveBeenCalledTimes(1);
    expect(result).toBe(mockDispatch);
  });

  test('useAppSelector should be equal to useSelector', () => {
    expect(useAppSelector).toBe(useSelector);
  });

  test('useAppSelector should call useSelector when invoked', () => {
    const mockSelector = jest.fn();
    const mockSelectorResult = 'test-result';
    mockUseSelector.mockReturnValue(mockSelectorResult);

    const result = useAppSelector(mockSelector);

    expect(mockUseSelector).toHaveBeenCalledTimes(1);
    expect(mockUseSelector).toHaveBeenCalledWith(mockSelector);
    expect(result).toBe(mockSelectorResult);
  });

  test('useAppDispatch should work with multiple calls', () => {
    const mockDispatch1 = jest.fn();
    const mockDispatch2 = jest.fn();
    
    mockUseDispatch
      .mockReturnValueOnce(mockDispatch1)
      .mockReturnValueOnce(mockDispatch2);

    const result1 = useAppDispatch();
    const result2 = useAppDispatch();

    expect(mockUseDispatch).toHaveBeenCalledTimes(2);
    expect(result1).toBe(mockDispatch1);
    expect(result2).toBe(mockDispatch2);
  });

  test('useAppSelector should work with different selectors', () => {
    const mockSelector1 = jest.fn();
    const mockSelector2 = jest.fn();
    const mockResult1 = 'result1';
    const mockResult2 = 'result2';

    mockUseSelector
      .mockReturnValueOnce(mockResult1)
      .mockReturnValueOnce(mockResult2);

    const result1 = useAppSelector(mockSelector1);
    const result2 = useAppSelector(mockSelector2);

    expect(mockUseSelector).toHaveBeenCalledTimes(2);
    expect(mockUseSelector).toHaveBeenNthCalledWith(1, mockSelector1);
    expect(mockUseSelector).toHaveBeenNthCalledWith(2, mockSelector2);
    expect(result1).toBe(mockResult1);
    expect(result2).toBe(mockResult2);
  });

  test('hooks should be functions', () => {
    expect(typeof useAppDispatch).toBe('function');
    expect(typeof useAppSelector).toBe('function');
  });

  test('hooks should be exported correctly', () => {
    expect(useAppDispatch).toBeDefined();
    expect(useAppSelector).toBeDefined();
  });

  test('useAppDispatch should preserve dispatch function behavior', () => {
    const mockAction = { type: 'TEST_ACTION', payload: 'test' };
    const mockDispatch = jest.fn();
    mockUseDispatch.mockReturnValue(mockDispatch);

    const dispatch = useAppDispatch();
    dispatch(mockAction);

    expect(mockDispatch).toHaveBeenCalledWith(mockAction);
  });

  test('useAppSelector should preserve selector function behavior', () => {
    const mockState = { user: { username: 'test' } };
    const mockSelector = jest.fn((state) => state.user.username);
    mockUseSelector.mockImplementation((selector) => selector(mockState));

    const result = useAppSelector(mockSelector);

    expect(mockUseSelector).toHaveBeenCalledWith(mockSelector);
    expect(result).toBe('test');
  });
});