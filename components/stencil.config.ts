import { Config } from '@stencil/core';

export const config: Config = {
  namespace: 'banana-components',
  outputTargets:[
    {
      type: 'dist'
    },
    {
      type: 'www',
      serviceWorker: null
    }
  ]
};
