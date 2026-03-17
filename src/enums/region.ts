export const RegionStatus = {
  Active: 'active',
  Inactive: 'inactive',
} as const
export type RegionStatus = (typeof RegionStatus)[keyof typeof RegionStatus]

