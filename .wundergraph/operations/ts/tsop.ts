import { createOperation, z } from '../../generated/wundergraph.factory';

export default createOperation.query({
  input: z.object({
    id: z.string(),
  }),
  handler: async ({ input, operations }) => {
    console.log('input', { input });

    const result = await operations.query({
      operationName: 'wizGood/GetWizards',
      input: {
        FirstName: 'Tom',
        LastName: 'Riddle',
      },
    });

    console.log('TS op result: ', result.data?.wizGood_getWizards);

    return {
      wizards: result.data?.wizGood_getWizards ?? [],
    };
  },
});
