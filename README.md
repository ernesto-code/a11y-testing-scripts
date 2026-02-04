# a11y-testing-shortcuts-extension

`a11y-testing-shortcuts-extension` is an extension designed to enhance accessibility testing on any website. It's built with [React](https://react.dev/) and [Typescript](https://www.typescriptlang.org/), and was initialized with [npm create vite@latest](https://vitejs.dev/).


## Features

**Ease of Use:** An intuitive interface that makes accessibility testing a breeze.\
**Developed with Vite:** Benefit from a faster and more efficient development environment thanks to Vite.\
**Extensible:** Designed to be easily extensible and adaptable to your needs.


## Installation

To install this project, follow these steps:

```bash 
git clone [REPOSITORY_URL]

```  

```bash 
npm install
```  

```bash 
npm run dev
```  

Open [http://localhost:5173](http://localhost:5173) with your browser to see the result.


## Build and Use as an Extension

Once you've made changes and want to test the extension in your browser:

```bash 
npm run build
```  

The build will generate a dist folder containing all the necessary files for the extension.

`Load the extension into your browser:`

In Chrome: Go to `chrome://extensions/`, enable "Developer mode" and click on "Load unpacked". Select the `dist` folder.\
In Firefox: Go to `about:debugging`, click on "Load Temporary Add-on" and select any file inside the `dist` folder.