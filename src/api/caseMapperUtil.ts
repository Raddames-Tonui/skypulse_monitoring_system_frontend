type AnyObject = Record<string, unknown>;

const isPlainObject = (value: unknown): value is AnyObject =>
  value !== null &&
  typeof value === "object" &&
  !Array.isArray(value) &&
  !(value instanceof Date);

// ---------- key guards ----------
const isSnakeCase = (key: string): boolean =>
  key.includes("_");

const isCamelCase = (key: string): boolean =>
  /[a-z][A-Z]/.test(key);

// ---------- key converters ----------
const snakeToCamelCase = (key: string): string =>
  isSnakeCase(key)
    ? key.replace(/_([a-z])/g, (_, letter) => letter.toUpperCase())
    : key;

const camelToSnakeCase = (key: string): string =>
  isCamelCase(key)
    ? key
        .replace(/([a-z0-9])([A-Z])/g, "$1_$2")
        .replace(/([A-Z]+)([A-Z][a-z])/g, "$1_$2")
        .toLowerCase()
    : key;

// ---------- mappers ----------
export function mapKeysSnakeToCamel<T>(input: unknown): T {
  if (Array.isArray(input)) {
    return input.map(mapKeysSnakeToCamel) as T;
  }

  if (isPlainObject(input)) {
    const result: AnyObject = {};
    for (const [key, value] of Object.entries(input)) {
      result[snakeToCamelCase(key)] = mapKeysSnakeToCamel(value);
    }
    return result as T;
  }

  return input as T;
}

export function mapKeysCamelToSnake<T>(input: unknown): T {
  if (Array.isArray(input)) {
    return input.map(mapKeysCamelToSnake) as T;
  }

  if (isPlainObject(input)) {
    const result: AnyObject = {};
    for (const [key, value] of Object.entries(input)) {
      result[camelToSnakeCase(key)] = mapKeysCamelToSnake(value);
    }
    return result as T;
  }

  return input as T;
}
