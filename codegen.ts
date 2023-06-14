import type { CodegenConfig } from '@graphql-codegen/cli';

const config: CodegenConfig = {
  overwrite: true,
  schema: 'http://localhost:3010/graphql',
  generates: {
    'client/app-react/src/generated/graphql.ts': {
      plugins: ['typescript', 'typescript-document-nodes'],
    },
    'client/app-vue/src/generated/graphql.ts': {
      plugins: ['typescript', 'typescript-document-nodes'],
    },
  },
};

export default config;
