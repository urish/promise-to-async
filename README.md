# async-to-promise

[![Build Status](https://travis-ci.org/urish/async-to-promise.png?branch=master)](https://travis-ci.org/urish/async-to-promise)
[![Coverage Status](https://coveralls.io/repos/github/urish/async-to-promise/badge.svg?branch=master)](https://coveralls.io/github/urish/async-to-promise?branch=master)

Automatically transform promise code to the ES2017 async / await syntax

## Install

    yarn global add async-to-promise

or

    npm install --global async-to-promise

## Example

The following input:

```typescript
function test() {
    return foo().then(value => bar(value));
}
```

Will transform to:

```typescript
async function test() {
    const value = await foo();
    return bar(value);
}
```

## License

Copyright (C) 2017, 2018, Uri Shaked. Licensed under the MIT license.
