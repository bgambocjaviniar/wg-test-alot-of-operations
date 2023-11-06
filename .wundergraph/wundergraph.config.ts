import {
  configureWunderGraphApplication,
  cors,
  EnvironmentVariable,
  introspect,
} from '@wundergraph/sdk';
import operations from './wundergraph.operations';
import server from './wundergraph.server';

const wizGood = introspect.openApiV2({
  apiNamespace: 'wizGood',
  source: {
    kind: 'file',
    filePath: './schema/swagger.json',
  },
  baseURL: new EnvironmentVariable('WIZ'),
  // statusCodeUnions: true,
});

const abc = introspect.openApiV2({
  apiNamespace: 'abc',
  source: {
    kind: 'file',
    filePath: './schema/abc.json',
  },
  baseURL: new EnvironmentVariable('ABC'),
  // statusCodeUnions: true,
});

// configureWunderGraph emits the configuration
configureWunderGraphApplication({
  apis: [wizGood, abc],
  server,
  operations,
  generate: {
    codeGenerators: [],
    operationsGenerator: (config) => {
      config.includeNamespaces('wizGood', 'abc');
    },
  },
  experimental: {
    orm: false,
  },
  cors: {
    ...cors.allowAll,
  },
  security: {
    enableGraphQLEndpoint:
      process.env.NODE_ENV !== 'production' ||
      process.env.GITPOD_WORKSPACE_ID !== undefined,
  },
});
