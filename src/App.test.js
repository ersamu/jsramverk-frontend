import { render, screen } from '@testing-library/react';
import App from './App';

test('renders a button to create new document', () => {
  render(<App />);
  const createBtn = screen.getByText("Skapa nytt");
  expect(createBtn).toBeInTheDocument();
});

test('renders a specific text', () => {
  render(<App />);
  const selectText = screen.getByText("Välj ett dokument");
  expect(selectText).toBeInTheDocument();
});

test('renders a specific label text', () => {
  render(<App />);
  const labelText = screen.getByLabelText("Skriv in namn på filen:");
  expect(labelText).toBeInTheDocument();
});

