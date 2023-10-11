import { afterAll, beforeAll, describe, expect, test } from '@jest/globals';
import fetch from 'node-fetch';
import type { TsTsopResponseData } from '../.wundergraph/generated/models';
import { createTestAndMockServer } from '../.wundergraph/generated/testing';

const wg = createTestAndMockServer({ fetch: fetch as any });
beforeAll(() => wg.start({ mockURLEnvs: ['WIZ'] }));
afterAll(() => wg.stop());

describe('smart', () => {
  test('should work', async () => {
    const mockResponse: TsTsopResponseData['wizards'] = [
      {
        firstName: 'Mocked Tom',
        lastName: 'Mocked Riddle',
        elixirs: [],
        id: 'foo',
      },
    ];

    const scope = wg.mockServer.mock({
      match: ({ url, method }) =>
        method === 'GET' &&
        url.path === '/Wizards?FirstName=Tom&LastName=Riddle',
      handler: ({}) => ({
        status: 200,
        body: mockResponse,
      }),
    });

    const result = await wg.testServer.client().query({
      operationName: 'ts/tsop',
      input: {
        id: 'whatever',
      },
    });

    scope.done();

    expect(result.data?.wizards).toEqual(mockResponse);
  });

  test('should test error', async () => {
    const mockError = {
      myError: 'invalid params',
    };

    const scope = wg.mockServer.mock({
      match: ({ url, method }) =>
        method === 'GET' &&
        url.path === '/Wizards?FirstName=Tom&LastName=Riddle',
      handler: ({}) => ({
        status: 400,
        body: mockError,
      }),
    });

    const result = await wg.testServer.client().query({
      operationName: 'ts/tsop',
      input: {
        id: 'whatever',
      },
    });

    scope.done();

    expect(result.data?.wizards).toEqual({
      foo: 'error',
    });
  });
});
