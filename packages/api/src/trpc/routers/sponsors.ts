import { eq, insertSponsorSchema, sponsors } from "@knighthacks/db";

import { router } from "../init";
import { adminProcedure } from "../procedures";

export const sponsorRouter = router({
  add: adminProcedure
    .input(insertSponsorSchema)
    .mutation(async ({ ctx, input }) => {
      await ctx.db.insert(sponsors).values({ ...input });
    }),
  getAll: adminProcedure.query(async ({ ctx }) => {
    return ctx.db.query.sponsors.findMany();
  }),
  update: adminProcedure
    .input(insertSponsorSchema)
    .mutation(async ({ ctx, input }) => {
      await ctx.db
        .update(sponsors)
        .set(input)
        .where(eq(sponsors.id, Number(input.id)));
    }),
  delete: adminProcedure
    .input(insertSponsorSchema)
    .mutation(async ({ ctx, input }) => {
      await ctx.db.delete(sponsors).where(eq(sponsors.id, Number(input.id)));
    }),
});
