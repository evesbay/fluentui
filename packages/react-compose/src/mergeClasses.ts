import cx from 'classnames';
import { ClassDictionary } from './types';

export const mergeClasses = (...classesList: (ClassDictionary | undefined)[]): ClassDictionary => {
  const result: { [key: string]: string | string[] } = {};

  for (const classes of classesList) {
    if (classes) {
      Object.keys(classes).forEach((key: string) => {
        result[key] = result[key] || [];
        (result[key] as string[]).push(classes[key]);
      });
    }
  }

  Object.keys(result!).forEach((key: string) => {
    result[key] = cx(...(result[key] as string[]));
  });

  return result as ClassDictionary;
};
