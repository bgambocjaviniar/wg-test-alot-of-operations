# WunderGraph Testing TS operations issue

## Description

This repo demonstrates an issue where the testing TypeScript operations w/ WG appears not to be working as expected.

The repo was created by running `npx create-wundergraph-app@latest wg-testing-wizards --example simple` and by modifying some configuration files.

[Mocking section](https://docs.wundergraph.com/docs/guides/mocking) in Wundergraph docs was used as the source for writing the test.

The test fails because the mocked response is not being returned from the typescript operation.

## Installation

1. git clone the repo
2. `npm ci` - install dependencies
3. `npm run build` - cleans and generates wundergraph files
4. `npm run test` - runs the tests (it also builds to make sure the generated files are up to date)
