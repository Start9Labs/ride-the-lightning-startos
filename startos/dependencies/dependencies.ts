import { sdk } from '../sdk'

export const setDependencies = sdk.setupDependencies(
  async ({ effects, input }) => {
    if (!input) return {}
    let currentDeps: {
      lnd?: any
      cln?: any
    } = {}
    if (input.internalLnd) currentDeps["lnd"] = sdk.Dependency.of({
      type: 'running',
      versionSpec: sdk.Checker.parse('>=0.16.4 <0.19.0'),
      healthChecks: ['grpc'], // TODO Add ID of LND RPC health check
    })
    if (input.internalCln) currentDeps["c-lightning"] = sdk.Dependency.of({
      type: 'running',
      versionSpec: sdk.Checker.parse('>=24.02.2 <25.0.0'),
      healthChecks: ['clnrest'], // TODO Add ID of CLN RPC health check
    })
    return currentDeps
  },
)
