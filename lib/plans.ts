export const PLAN_LIMITS = {
  FREE: {
    maxFileSize: 10 * 1024 * 1024, // 10MB
    maxJobsPerDay: 10,
    maxStorageGB: 1,
    features: ['pdf-merge', 'pdf-split', 'pdf-compress', 'basic-conversion'],
  },
  PRO: {
    maxFileSize: 100 * 1024 * 1024, // 100MB
    maxJobsPerDay: 100,
    maxStorageGB: 10,
    features: [
      'pdf-merge', 'pdf-split', 'pdf-compress', 'pdf-edit', 'pdf-sign', 'pdf-protect',
      'excel-merge', 'excel-split', 'excel-format', 'excel-clean', 'excel-csv',
      'word-merge', 'word-split', 'word-replace', 'word-format',
      'all-conversions', 'batch-processing',
    ],
  },
  ENTERPRISE: {
    maxFileSize: 1024 * 1024 * 1024, // 1GB
    maxJobsPerDay: 1000,
    maxStorageGB: 100,
    features: [
      'pdf-merge', 'pdf-split', 'pdf-compress', 'pdf-edit', 'pdf-sign', 'pdf-protect',
      'excel-merge', 'excel-split', 'excel-format', 'excel-clean', 'excel-csv',
      'word-merge', 'word-split', 'word-replace', 'word-format',
      'all-conversions', 'batch-processing', 'api-access', 'priority-support',
      'custom-branding', 'dedicated-resources',
    ],
  },
} as const

export type PlanType = keyof typeof PLAN_LIMITS

export function canUseFeature(plan: PlanType, feature: string): boolean {
  return PLAN_LIMITS[plan].features.includes(feature as any)
}

export function getMaxFileSize(plan: PlanType): number {
  return PLAN_LIMITS[plan].maxFileSize
}

export function getMaxJobsPerDay(plan: PlanType): number {
  return PLAN_LIMITS[plan].maxJobsPerDay
}
