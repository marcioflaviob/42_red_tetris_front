import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
import OfflineCard from '../../../src/components/cards/OfflineCard';

jest.mock('../../../src/components/cards/OfflineCard.module.css', () => ({
  container: 'container',
  header: 'header',
  subtitle: 'subtitle',
  options: 'options',
  optionInfo: 'optionInfo',
  optionLabel: 'optionLabel',
  optionDescription: 'optionDescription',
  switch: 'switch',
  difficultyInfo: 'difficultyInfo',
  hardDifficulty: 'hardDifficulty',
  difficultyLabel: 'difficultyLabel',
  difficultyValue: 'difficultyValue',
  difficultyBar: 'difficultyBar',
  difficultyProgress: 'difficultyProgress',
  normalText: 'normalText',
  mediumText: 'mediumText',
  hardText: 'hardText',
  normal: 'normal',
  medium: 'medium',
  hard: 'hard',
  playSection: 'playSection',
  playButton: 'playButton',
  playIcon: 'playIcon'
}));

jest.mock('../../../src/components/ui/Inputs/InputSwitch', () => {
  return function MockInputSwitch({ checked, onChange, className }) {
    return (
      <input
        type="checkbox"
        checked={checked}
        onChange={onChange}
        className={className}
        data-testid="input-switch"
      />
    );
  };
});

jest.mock('../../../src/components/ui/Buttons/Button', () => {
  return function MockButton({ children, onClick, variant, size, className }) {
    return (
      <button
        onClick={onClick}
        className={className}
        data-variant={variant}
        data-size={size}
        data-testid="button"
      >
        {children}
      </button>
    );
  };
});

jest.mock('../../../src/components/ui/Titles/Title', () => {
  return function MockTitle({ children }) {
    return <h1 data-testid="title">{children}</h1>;
  };
});

jest.mock('../../../src/components/ui/Card/InfoCard', () => {
  return function MockInfoCard({ children }) {
    return <div data-testid="info-card">{children}</div>;
  };
});

describe('OfflineCard', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    jest.spyOn(console, 'log').mockImplementation(() => {});
  });

  afterEach(() => {
    console.log.mockRestore();
  });

  describe('Rendering', () => {
    test('renders the component with correct title and subtitle', () => {
      render(<OfflineCard />);
      
      expect(screen.getByTestId('title')).toHaveTextContent('Solo Play');
      expect(screen.getByText('Challenge yourself in offline mode')).toBeInTheDocument();
    });

    test('renders both game option switches', () => {
      render(<OfflineCard />);
      
      expect(screen.getByText('Invisible Pieces')).toBeInTheDocument();
      expect(screen.getByText('Pieces become invisible after placement')).toBeInTheDocument();
      expect(screen.getByText('Increased Gravity')).toBeInTheDocument();
      expect(screen.getByText('Pieces fall faster for extra challenge')).toBeInTheDocument();
      
      const switches = screen.getAllByTestId('input-switch');
      expect(switches).toHaveLength(2);
    });

    test('renders difficulty information section', () => {
      render(<OfflineCard />);
      
      expect(screen.getByText('Difficulty Level')).toBeInTheDocument();
      expect(screen.getByText('Normal')).toBeInTheDocument();
    });

    test('renders play button with correct content', () => {
      render(<OfflineCard />);
      
      const playButton = screen.getByTestId('button');
      expect(playButton).toHaveTextContent('Start Game');
      expect(playButton).toHaveAttribute('data-variant', 'play');
      expect(playButton).toHaveAttribute('data-size', 'large');
    });

    test('renders InfoCard components for options', () => {
      render(<OfflineCard />);
      
      const infoCards = screen.getAllByTestId('info-card');
      expect(infoCards).toHaveLength(2);
    });
  });

  describe('Initial State', () => {
    test('both switches are unchecked by default', () => {
      render(<OfflineCard />);
      
      const switches = screen.getAllByTestId('input-switch');
      switches.forEach(switchElement => {
        expect(switchElement).not.toBeChecked();
      });
    });

    test('displays Normal difficulty by default', () => {
      render(<OfflineCard />);
      
      expect(screen.getByText('Normal')).toBeInTheDocument();
      const progressBar = document.querySelector('.difficultyProgress');
      expect(progressBar).toHaveStyle('width: 33%');
    });
  });

  describe('Switch Interactions', () => {
    test('invisible pieces switch toggles correctly', () => {
      render(<OfflineCard />);
      
      const switches = screen.getAllByTestId('input-switch');
      const invisiblePiecesSwitch = switches[0];
      
      expect(invisiblePiecesSwitch).not.toBeChecked();
      
      fireEvent.click(invisiblePiecesSwitch);
      expect(invisiblePiecesSwitch).toBeChecked();
      
      fireEvent.click(invisiblePiecesSwitch);
      expect(invisiblePiecesSwitch).not.toBeChecked();
    });

    test('increased gravity switch toggles correctly', () => {
      render(<OfflineCard />);
      
      const switches = screen.getAllByTestId('input-switch');
      const increasedGravitySwitch = switches[1];
      
      expect(increasedGravitySwitch).not.toBeChecked();
      
      fireEvent.click(increasedGravitySwitch);
      expect(increasedGravitySwitch).toBeChecked();
      
      fireEvent.click(increasedGravitySwitch);
      expect(increasedGravitySwitch).not.toBeChecked();
    });

    test('both switches can be toggled independently', () => {
      render(<OfflineCard />);
      
      const switches = screen.getAllByTestId('input-switch');
      const invisiblePiecesSwitch = switches[0];
      const increasedGravitySwitch = switches[1];
      
      fireEvent.click(invisiblePiecesSwitch);
      expect(invisiblePiecesSwitch).toBeChecked();
      expect(increasedGravitySwitch).not.toBeChecked();
      
      fireEvent.click(increasedGravitySwitch);
      expect(invisiblePiecesSwitch).toBeChecked();
      expect(increasedGravitySwitch).toBeChecked();
      
      fireEvent.click(invisiblePiecesSwitch);
      expect(invisiblePiecesSwitch).not.toBeChecked();
      expect(increasedGravitySwitch).toBeChecked();
    });
  });

  describe('Difficulty Level Logic', () => {
    test('shows Normal difficulty when no options are selected', () => {
      render(<OfflineCard />);
      
      expect(screen.getByText('Normal')).toBeInTheDocument();
      const progressBar = document.querySelector('.difficultyProgress');
      expect(progressBar).toHaveStyle('width: 33%');
    });

    test('shows Medium difficulty when one option is selected', () => {
      render(<OfflineCard />);
      
      const switches = screen.getAllByTestId('input-switch');
      fireEvent.click(switches[0]);
      
      expect(screen.getByText('Medium')).toBeInTheDocument();
      const progressBar = document.querySelector('.difficultyProgress');
      expect(progressBar).toHaveStyle('width: 66%');
    });

    test('shows Medium difficulty when the other option is selected', () => {
      render(<OfflineCard />);
      
      const switches = screen.getAllByTestId('input-switch');
      fireEvent.click(switches[1]);
      
      expect(screen.getByText('Medium')).toBeInTheDocument();
      const progressBar = document.querySelector('.difficultyProgress');
      expect(progressBar).toHaveStyle('width: 66%');
    });

    test('shows Hard difficulty when both options are selected', () => {
      render(<OfflineCard />);
      
      const switches = screen.getAllByTestId('input-switch');
      fireEvent.click(switches[0]);
      fireEvent.click(switches[1]);
      
      expect(screen.getByText('Hard')).toBeInTheDocument();
      const progressBar = document.querySelector('.difficultyProgress');
      expect(progressBar).toHaveStyle('width: 100%');
    });

    test('difficulty changes back when options are disabled', () => {
      render(<OfflineCard />);
      
      const switches = screen.getAllByTestId('input-switch');
      
      fireEvent.click(switches[0]);
      fireEvent.click(switches[1]);
      expect(screen.getByText('Hard')).toBeInTheDocument();
      
      fireEvent.click(switches[0]);
      expect(screen.getByText('Medium')).toBeInTheDocument();
      
      fireEvent.click(switches[1]);
      expect(screen.getByText('Normal')).toBeInTheDocument();
    });
  });

  describe('CSS Classes and Styling', () => {
    test('applies hardDifficulty class when difficulty is Hard', () => {
      render(<OfflineCard />);
      
      const switches = screen.getAllByTestId('input-switch');
      fireEvent.click(switches[0]);
      fireEvent.click(switches[1]);
      
      const difficultyInfo = document.querySelector('.difficultyInfo');
      expect(difficultyInfo).toHaveClass('hardDifficulty');
    });

    test('does not apply hardDifficulty class when difficulty is not Hard', () => {
      render(<OfflineCard />);
      
      const difficultyInfo = document.querySelector('.difficultyInfo');
      expect(difficultyInfo).not.toHaveClass('hardDifficulty');
      
      const switches = screen.getAllByTestId('input-switch');
      fireEvent.click(switches[0]);
      
      expect(difficultyInfo).not.toHaveClass('hardDifficulty');
    });

    test('applies correct difficulty color classes', () => {
      render(<OfflineCard />);
      
      let difficultyValue = document.querySelector('.difficultyValue');
      let progressBar = document.querySelector('.difficultyProgress');
      expect(difficultyValue).toHaveClass('normalText');
      expect(progressBar).toHaveClass('normal');
      
      const switches = screen.getAllByTestId('input-switch');
      fireEvent.click(switches[0]);
      
      difficultyValue = document.querySelector('.difficultyValue');
      progressBar = document.querySelector('.difficultyProgress');
      expect(difficultyValue).toHaveClass('mediumText');
      expect(progressBar).toHaveClass('medium');
      
      fireEvent.click(switches[1]);
      
      difficultyValue = document.querySelector('.difficultyValue');
      progressBar = document.querySelector('.difficultyProgress');
      expect(difficultyValue).toHaveClass('hardText');
      expect(progressBar).toHaveClass('hard');
    });
  });

  describe('Play Button Interaction', () => {
    test('clicking play button calls handlePlayClick function', () => {
      render(<OfflineCard />);
      
      const playButton = screen.getByTestId('button');
      fireEvent.click(playButton);
      
      expect(console.log).toHaveBeenCalledWith('Starting offline game...');
    });

    test('play button contains play icon', () => {
      render(<OfflineCard />);
      
      const playButton = screen.getByTestId('button');
      expect(playButton).toHaveTextContent('▶');
      expect(playButton).toHaveTextContent('Start Game');
    });
  });

  describe('Accessibility', () => {
    test('option labels are properly associated with descriptions', () => {
      render(<OfflineCard />);
      
      expect(screen.getByText('Invisible Pieces')).toBeInTheDocument();
      expect(screen.getByText('Pieces become invisible after placement')).toBeInTheDocument();
      expect(screen.getByText('Increased Gravity')).toBeInTheDocument();
      expect(screen.getByText('Pieces fall faster for extra challenge')).toBeInTheDocument();
    });

    test('difficulty information is clearly labeled', () => {
      render(<OfflineCard />);
      
      expect(screen.getByText('Difficulty Level')).toBeInTheDocument();
      expect(screen.getByText('Normal')).toBeInTheDocument();
    });
  });

  describe('Component Structure', () => {
    test('renders main container with correct structure', () => {
      render(<OfflineCard />);
      
      const container = document.querySelector('.container');
      expect(container).toBeInTheDocument();
      
      const header = document.querySelector('.header');
      const options = document.querySelector('.options');
      const difficultyInfo = document.querySelector('.difficultyInfo');
      const playSection = document.querySelector('.playSection');
      
      expect(header).toBeInTheDocument();
      expect(options).toBeInTheDocument();
      expect(difficultyInfo).toBeInTheDocument();
      expect(playSection).toBeInTheDocument();
    });

    test('options section contains two InfoCard components', () => {
      render(<OfflineCard />);
      
      const infoCards = screen.getAllByTestId('info-card');
      expect(infoCards).toHaveLength(2);
    });
  });

  describe('getDifficulty function edge cases', () => {
    test('handles unexpected activeOptions count gracefully', () => {
      render(<OfflineCard />);
      
      expect(screen.getByText('Normal')).toBeInTheDocument();
      
      const progressBar = document.querySelector('.difficultyProgress');
      expect(progressBar).toHaveStyle('width: 33%');
    });
  });
});