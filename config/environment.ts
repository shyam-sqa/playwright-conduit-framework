function normalizeBaseUrl(value: string): string {
  return value.endsWith('/') ? value : `${value}/`;
}

export const environment = {
  webBaseUrl: normalizeBaseUrl(process.env.BASE_URL ?? 'https://conduit.bondaracademy.com/'),
  apiBaseUrl: normalizeBaseUrl(
    process.env.API_BASE_URL ?? 'https://conduit-api.bondaracademy.com/',
  ),
} as const;
