import { createServerSideHelpers } from '@trpc/react-query/server'
import { appRouter } from './root'
import superjson from 'superjson'
import { createInnerTRPCContext } from './trpc'

export function ssgHelper () {
  return createServerSideHelpers({
    router: appRouter,
    // No user in the server-side, so session equals to null
    ctx: createInnerTRPCContext({ session: null }),
    transformer: superjson
  })
}
