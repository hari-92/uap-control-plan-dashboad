export const NodeState = {
  Online: 'online',
  Offline: 'offline',
} as const
export type NodeState = (typeof NodeState)[keyof typeof NodeState]

export const HealthClass = {
  Healthy: 'healthy',
  Warning: 'warning',
  Critical: 'critical',
} as const
export type HealthClass = (typeof HealthClass)[keyof typeof HealthClass]

