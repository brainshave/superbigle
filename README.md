# WebGL SuperBigle

This project contains examples from book OpenGL SuperBigle ed. V that were in C++/OpenGL, translated to TypeScript/WebGL. Because TypeScript is mostly JavaScript it should be readable to anyone knowing that language.

Live demo is available at <http://szywon.github.com/superbigle>. If you're not sure if you're able to run it with your browser, try here: <http://get.webgl.org>.

Precompiled JavaScript code is available on `gh-pages` branch in `all.js` file.

## Compiling JS from TS

Includes Visual Studio project. The final JavaScript code can be compiled by installing [NodeJS](http://nodejs.org) and then installing TypeScript compiler:

    npm install -g typescript

And compiling like that:

    tsc -out all.js App.ts
