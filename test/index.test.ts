import { afterAll, beforeAll, describe, expect, test } from '@jest/globals';
import fetch from 'node-fetch';
import type { TsTsopResponseData } from '../.wundergraph/generated/models';
import { createTestAndMockServer } from '../.wundergraph/generated/testing';

const wg = createTestAndMockServer({ fetch: fetch as any });
beforeAll(() => wg.start({ mockURLEnvs: ['WIZ'] }));
afterAll(() => wg.stop());

const mockResponse: TsTsopResponseData = {
  wizards: [
    {
      firstName: 'Mocked Tom',
      lastName: 'Mocked Riddle',
      elixirs: [],
      id: 'foo',
    },
  ],
};

describe('smart', () => {
  test.only('should work', async () => {
    const scope = wg.mockServer.mock({
      match: ({ url, method }) =>
        method === 'GET' &&
        url.path === '/Wizards?FirstName=Tom&LastName=Riddle',
      handler: async ({}) => {
        console.log('mocking w/', mockResponse);
        return {
          status: 200,
          body: {
            data: mockResponse,
          },
        };
      },
    });

    const result = await wg.testServer.client().query({
      operationName: 'ts/tsop',
      input: {
        id: 'whatever',
      },
    });

    scope.done();

    expect(result.data).toEqual(mockResponse);
  });
});
