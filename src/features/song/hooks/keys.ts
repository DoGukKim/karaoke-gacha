export const songKeys = {
  all: ['songs'] as const,
  random: (count: number) => [...songKeys.all, 'random', { count }] as const,
} as const;
