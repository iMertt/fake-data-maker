/**
 * Locale data store for first/last name pools. {@link FIRST_NAMES} and {@link LAST_NAMES}
 * merge all locales for backward-compatible flat exports used by `person` and `internet`.
 */
export const NAME_POOLS = {
  tr: {
    first: ["Ahmet", "Mehmet", "Ayse", "Fatma", "Can", "Elif"],
    last: ["Yilmaz", "Kaya", "Demir", "Sahin", "Cetin", "Aydin"],
  },
  en: {
    first: ["John", "Emma", "Noah", "Sophia"],
    last: ["Smith", "Johnson", "Brown", "Davis"],
  },
} as const satisfies Record<string, { first: readonly string[]; last: readonly string[] }>;

/** All first names from every locale (backward compatible). */
export const FIRST_NAMES = [...NAME_POOLS.tr.first, ...NAME_POOLS.en.first] as const;

/** All last names from every locale (backward compatible). */
export const LAST_NAMES = [...NAME_POOLS.tr.last, ...NAME_POOLS.en.last] as const;
