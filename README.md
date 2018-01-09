# promise-to-async

[![Build Status](https://travis-ci.org/urish/promise-to-async.png?branch=master)](https://travis-ci.org/urish/promise-to-async)
[![Coverage Status](https://coveralls.io/repos/github/urish/promise-to-async/badge.svg?branch=master)](https://coveralls.io/github/urish/promise-to-async?branch=master)

Automatically transform promise code to the ES2017 async / await syntax

## Install

    yarn global add promise-to-async

or

    npm install --global promise-to-async

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
