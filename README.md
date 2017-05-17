# Simple Typewriter written in ES6 and prepared with webpack
> Simple library to create a typewriter animation


[![travis build](https://img.shields.io/travis/awlui/animate-typewriter.svg?style=flat-square)](https://travis-ci.org/awlui/animate-typewriter)
[![codecov coverage](https://img.shields.io/codecov/c/github/awlui/animate-typewriter.svg?style=flat-square)](https://codecov.io/gh/awlui/animate-typewriter)
[![npm](https://img.shields.io/npm/dw/webpacktypewriter.svg?style=flat-square)](https://www.npmjs.com/package/webpacktypewriter)

## Documentation
### Usage
You have to instantiate the top level Typewriter Object and pass it parameters, which include the id for the root element that you want to inject the typewriter into. The second parameter, optional, will be custom settings that will be merged with the default settings.
	var obj = new Typewriter('rootID', {typingSpeed: 'fast'});

	obj
	  .typeCharacters('Hello')
	  .pauseFor(1000)
	  .deleteCharacters(3)
	  .typeCharacters('y')
	  .start();
