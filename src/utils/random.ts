/**
 * Returns a random item from a non-empty list.
 *
 * @typeParam T - Item type in the source array.
 * @param items - Source list of items.
 * @returns One randomly selected item.
 */
export const pickRandom = <T>(items: readonly T[]): T => {
  if (items.length === 0) {
    throw new Error("Cannot pick a random item from an empty array.");
  }

  const index = (Math.random() * items.length) | 0;
  const item = items[index];
  if (item === undefined) {
    throw new Error(`Index ${index} out of bounds for array of length ${items.length}.`);
  }
  return item;
};
