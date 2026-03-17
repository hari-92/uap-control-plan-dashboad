export const UserStatus = {
  Active: 'active',
  Inactive: 'inactive',
} as const
export type UserStatus = (typeof UserStatus)[keyof typeof UserStatus]

export const MembershipLevel = {
  Free: 'free',
  Premium: 'premium',
} as const
export type MembershipLevel =
  (typeof MembershipLevel)[keyof typeof MembershipLevel]

export const WeightClass = {
  Standard: 'standard',
  Gold: 'gold',
} as const
export type WeightClass = (typeof WeightClass)[keyof typeof WeightClass]

