import { Dispatch, SetStateAction, useEffect, useState } from 'react';

export interface useLocalStorageProps<T> {
  key: string;
  defaultValue: T;
}

export type useLocalStorageResultType<T> = [T, Dispatch<SetStateAction<T>>];

export const useLocalStorage = <T>(props: { key: string; defaultValue: T }): useLocalStorageResultType<T> => {
  const { key, defaultValue } = props;
  const [value, setItem] = useState<T>(() => {
    if (localStorage && localStorage.getItem(key)) {
      return JSON.parse(localStorage.getItem(key) ?? "");
    }
    return defaultValue;
  });

  useEffect(() => {
    localStorage.setItem(key, JSON.stringify(value));
  }, [value, key]);

  return [value, setItem];
};
