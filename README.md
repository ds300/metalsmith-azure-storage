# metalsmith-azure-storage

This is a metalsmith plugin for pushing build artefacts to azure storage.

## Usage

```javascript
const azure = require('metalsmith-azure-storage');

metalsmith.use(azure({
  account: ACCOUNT_NAME,
  key: ACCOUNT_KEY,
  container: CONTAINER_NAME,

  /* optional, default: 1 for no concurrency */
  concurrency: 4
}));
```

## License

[MIT](./LICENSE)
