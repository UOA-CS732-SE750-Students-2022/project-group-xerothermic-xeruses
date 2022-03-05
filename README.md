# softeng-750-project

[![lerna](https://img.shields.io/badge/maintained%20with-lerna-cc00ff.svg)](https://lerna.js.org/)

This project uses lerna for monorepo management. With this, you are able to run the front and backend
in parallel with one command, or in isolation.

# Setup

1. Install packages
   `npm install`

# How to run

1. Run
   `npm start`

2. Test
   `npm test`

To run or test the front and backend in isolation, consult the relevant README.

# Troubleshooting

## Pre-commit hook fails

Do the following command:
`chmod +x .husky/pre-commit`
