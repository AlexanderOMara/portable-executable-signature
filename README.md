# portable-executable-signature

Package for reading and writing PE code signatures

[![npm](https://img.shields.io/npm/v/portable-executable-signature.svg)](https://npmjs.com/package/portable-executable-signature)
[![node](https://img.shields.io/node/v/portable-executable-signature.svg)](https://nodejs.org)

[![dependencies](https://img.shields.io/david/AlexanderOMara/portable-executable-signature.svg)](https://david-dm.org/AlexanderOMara/portable-executable-signature)
[![size](https://packagephobia.now.sh/badge?p=portable-executable-signature)](https://packagephobia.now.sh/result?p=portable-executable-signature)
[![downloads](https://img.shields.io/npm/dm/portable-executable-signature.svg)](https://npmcharts.com/compare/portable-executable-signature?minimal=true)

[![Build Status](https://github.com/AlexanderOMara/portable-executable-signature/workflows/main/badge.svg?branch=master)](https://github.com/AlexanderOMara/portable-executable-signature/actions?query=workflow%3Amain+branch%3Amaster)


# Overview

A broken code signature is worse than no signature, so it can be desirable to remove a signature.

This package can remove code signatures from PE binaries.


# Usage

Just pass an `ArrayBuffer` or an object that is a view of an `ArrayBuffer` to the `signatureGet` and `signatureSet` functions.

```js
import fs from 'fs';
import {
	signatureGet,
	signatureSet
} from 'portable-executable-signature';

const data = fs.readFileSync('pe-binary.exe');
const signature = signatureGet(data);
console.log('signature:', signature);
const unsigned = signatureSet(data, null);
console.log('unsigned:', unsigned);
fs.writeFileSync('pe-binary-unsigned.exe', Buffer.from(unsigned));
```


# Bugs

If you find a bug or have compatibility issues, please open a ticket under issues section for this repository.


# License

Copyright (c) 2019-2022 Alexander O'Mara

Licensed under the Mozilla Public License, v. 2.0.

If this license does not work for you, feel free to contact me.
