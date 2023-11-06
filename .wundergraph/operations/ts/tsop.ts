import { createOperation, z } from '../../generated/wundergraph.factory';

export default createOperation.query({
  input: z.object({
    id: z.string(),
  }),
  handler: async ({ input, operations }) => {
    const result = await operations.query({
      operationName: 'wizGood/Wizards',
      input: {
        FirstName: 'Tom',
        LastName: 'Riddle',
      },
    });

    return {
      wizards: result.data?.wizGood_Wizards ?? [],
    };
  },
});
