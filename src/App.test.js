import React from 'react';
import ReactDOM from 'react-dom'
import { render } from '@testing-library/react';
import '@testing-library/jest-dom/extend-expect';
import App from './App';

// TODO, read through docs throughly..
// test('Make sure the main game map is visible', () => {
//   const {queryByTestId} = render(<App/>);
//   expect(
//     queryByTestId(document.documentElement, 'game-header'),
//   ).toBeInTheDocument()
// });

//TODO test: Make sure that when you click on a region before clicking start, nothing happens to the state

//TODO test: Make sure that hitting reset sets the state back to all of its original values

//TODO test: Make sure that the SVG renders

//TODO test: Make sure that the timer displays

//TODO test: Make sure that the timer counts up after hitting start

//TODO test: Make sure that the timer resets after hitting reset button

//TODO test: make sure that the score changes throughout the game