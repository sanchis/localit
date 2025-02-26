type LocalitConfig = {
  domain?: string;
  type?: "localStorage" | "sessionStorage";
};

let DOMAIN = "";
const EXPIRE = "_expiration_date";
let store: Storage = localStorage;

/**
 * @param key - the unprefixed key to retrieve
 * @returns the actual key stored in Storage
 */
const getFullKey = (key: string): string => `${DOMAIN}_${key}`;

/**
 * @param key - the unprefixed key to save with an expiration time
 * @returns the actual key stored in the Storage
 */
const getExpirationKey = (key: string): string => `${getFullKey(key)}${EXPIRE}`;

/**
 * @param key - the key to store with an expiration time
 * @param expirationTime - string with the amount of time we want to store the value. It allows "Xs", "Xm", "Xh", "Xd", where X can be any number.
 */
const setExpiration = (key: string, expirationTime: string): void => {
  const expirationDate = new Date();

  const timeFormats = {
    h: (time: number) => expirationDate.setHours(expirationDate.getHours() + time),
    d: (time: number) => expirationDate.setDate(expirationDate.getDate() + time),
    m: (time: number) => expirationDate.setMinutes(expirationDate.getMinutes() + time),
    s: (time: number) => expirationDate.setSeconds(expirationDate.getSeconds() + time),
  };
  // only minutes, days, hours and seconds allowed!
  const allowedFormats = Object.keys(timeFormats);
  const timeKey = expirationTime[expirationTime.length - 1];
  const time = Number(expirationTime.replace(timeKey, ""));
  if (expirationTime.length < 2 || !allowedFormats.some((char) => timeKey === char) || isNaN(time))
    return console.warn("Localit: provide a valid expiration time format (e.g. '20h', '160s', '15d'). Your expiration date hasn't been saved.");

  store.setItem(getExpirationKey(key), JSON.stringify(timeFormats[timeKey](time)));
};

/**
 * @param key - the key to check if it has an expiration date
 * @return whether or not there is an expiration date for the given key
 */
const hasExpirationDate = (key: string): boolean => store.getItem(getExpirationKey(key)) !== null;

/**
 * @param key - the key to check if it has expired
 * @return whether or not there is an expiration date for the given key
 */
const hasExpired = (key: string): boolean => {
  const expirationDate: string = JSON.parse(store.getItem(getExpirationKey(key)));
  return new Date() > new Date(expirationDate);
};

const config = ({ domain = null, type = "localStorage" }: LocalitConfig): void => {
  store = type === "localStorage" ? localStorage : sessionStorage;
  DOMAIN = domain || "";
};

const set = (key: string, value: any, expirationTime?: string): void => {
  if (!key) return console.error("Localit: provide a key to store the value");

  if (typeof value === "object") value = JSON.stringify(value);

  store.setItem(getFullKey(key), value);
  expirationTime && setExpiration(key, expirationTime);
};

const get = (key: string): any => {
  if (hasExpirationDate(key) && hasExpired(key)) {
    remove(key);
    return null;
  }
  try {
    return JSON.parse(store.getItem(getFullKey(key)));
  } catch (_) {
    return store.getItem(getFullKey(key));
  }
};

const remove = (key: string): void => {
  store.removeItem(getFullKey(key));
  store.removeItem(getExpirationKey(key));
};

const getAndRemove = (key: string): any => {
  const res = get(key);
  remove(key);
  return res;
};

const setDomain = (domain: string): void => {
  DOMAIN = domain;
};

const clearDomain = (domain: string = DOMAIN): void => {
  for (const key of Object.keys(store)) if (key.includes(`${domain}_`)) store.removeItem(key);
};

const bust = (): void => store.clear();

export const localit = {
  /**
   * Sets the default configuration for storing data.
   * @param domain - name of the domain that will prefix all the stored keys. Example: given a "books" domain, the key "alone" will be stored as "books_alone".
   * @param type - the type of Storage you want to use: "localStorage" (default) or "sessionStorage"
   */
  config,
  /**
 * Stores the given key/value in Storage. Additionally, an expiration date can be set.
 * @param key - key to store in Storage
 * @param value - value to store in Storage. 
 * @param expirationTime - seconds, minutes, hours or days that the value will remain stored.
    It will be deleted after that.
    It allows "Xs", "Xm", "Xh", "Xd", where X can be any number.
    Example: "5d" for five days or "3h" for three hours.
  */
  set,
  /**
   * Retrieves the value associated with the given key from the Storage. It uses the current domain.
   * @param key - key that will be used to retrieve from Storage
   */
  get,
  /**
   * Removes the given key from the Storage (and it's associated expiration date, if set). It uses the current domain.
   * @param key - key that will be removed from the Storage
   */
  remove,
  /**
   * Retrieves the value associated with the given key from the Storage and then removes it. It uses the current domain.
   * @param key - Key to get the value of and then remove from Storage. It uses the current domain.
   *
   */
  getAndRemove,
  /**
   * Sets a new domain to prefix the next stored keys
   * @param domain - Name of the domain that will prefix all the keys until changed again
   */
  setDomain,
  /**
   * Removes all the stored values for that domain. Defaults to the current domain.
   * @param domain - Name of the domain we want to remove
   */
  clearDomain,
  /**
   * Removes all the stored values in Storage
   */
  bust,
};

export type TLocalit = typeof localit;
