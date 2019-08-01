// loads .env variables and feeds coverage reports to Codacy
// works cross-platform

const { readFileSync } = require('fs');
const dotenv = require('dotenv');
const codacy = require('codacy-coverage');

dotenv.config();
codacy.handleInput(readFileSync('./coverage/lcov.info', 'utf8'), {});
