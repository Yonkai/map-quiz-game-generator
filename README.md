## How to create custom map quizes

1. Select game map section
1. Load into inkscape as unique layer
1. Set opacity of that layer to transparent value
1. Trace over path section with path
1. Export to SVG
1. Follow steps [here, 'Adding a Map'](https://github.com/VictorCazanave/svg-maps/blob/master/CONTRIBUTING.md) here to convert to useable json for react-svg-maps
1. Make sure name/id are the same.
1. Put index in custom-maps directory
1. Add code to switch section of switch map function alongside button to take that argument

## Useful Resources
[Inkscape, SVG editor](https://inkscape.org) 

[MDN page on SVG](https://developer.mozilla.org/en-US/docs/Web/SVG)


## How to play

1. Start button begins new game
1. Flashing grey/black = wrong guess
1. Dark green = correct guess
1. A correct guess is 1 point, incorrect is -1, max points is total map paths. 

This project was bootstrapped with [Create React App](https://github.com/facebook/create-react-app).

## Live Site
[osrsmapquiz.com](https://osrsmapquiz.com)

## Available Scripts

In the project directory, you can run:

### `npm start`

Runs the app in the development mode.<br />
Open [http://localhost:3000](http://localhost:3000) to view it in the browser.

The page will reload if you make edits.<br />
You will also see any lint errors in the console.

### `npm test`

Launches the test runner in the interactive watch mode.<br />
See the section about [running tests](https://facebook.github.io/create-react-app/docs/running-tests) for more information.

### `npm run build`

Builds the app for production to the `build` folder.<br />
It correctly bundles React in production mode and optimizes the build for the best performance.

The build is minified and the filenames include the hashes.<br />
Your app is ready to be deployed!

See the section about [deployment](https://facebook.github.io/create-react-app/docs/deployment) for more information.

### `npm run eject`

**Note: this is a one-way operation. Once you `eject`, you can’t go back!**

If you aren’t satisfied with the build tool and configuration choices, you can `eject` at any time. This command will remove the single build dependency from your project.

Instead, it will copy all the configuration files and the transitive dependencies (Webpack, Babel, ESLint, etc) right into your project so you have full control over them. All of the commands except `eject` will still work, but they will point to the copied scripts so you can tweak them. At this point you’re on your own.

You don’t have to ever use `eject`. The curated feature set is suitable for small and middle deployments, and you shouldn’t feel obligated to use this feature. However we understand that this tool wouldn’t be useful if you couldn’t customize it when you are ready for it.

## Learn More

You can learn more in the [Create React App documentation](https://facebook.github.io/create-react-app/docs/getting-started).

To learn React, check out the [React documentation](https://reactjs.org/).

### Code Splitting

This section has moved here: https://facebook.github.io/create-react-app/docs/code-splitting

### Analyzing the Bundle Size

This section has moved here: https://facebook.github.io/create-react-app/docs/analyzing-the-bundle-size

### Making a Progressive Web App

This section has moved here: https://facebook.github.io/create-react-app/docs/making-a-progressive-web-app

### Advanced Configuration

This section has moved here: https://facebook.github.io/create-react-app/docs/advanced-configuration

### Deployment

This section has moved here: https://facebook.github.io/create-react-app/docs/deployment

### `npm run build` fails to minify

This section has moved here: https://facebook.github.io/create-react-app/docs/troubleshooting#npm-run-build-fails-to-minify
