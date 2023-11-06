import { afterAll, beforeAll, describe, expect, test } from '@jest/globals';
import type { TsTsopResponseData } from '../.wundergraph/generated/models';
import { createTestAndMockServer } from '../.wundergraph/generated/testing';

const wg = createTestAndMockServer();
beforeAll(async () => wg.start({ mockURLEnvs: ['WIZ'] }), 20000);
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
});
