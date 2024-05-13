import fs from 'node:fs/promises';
import {resolve} from 'node:path';

export default async (path: string, enc?: 'utf-8'): Promise<string> => {
  const fp = resolve(__dirname, path);
  console.log(fp);
  return fs.readFile(fp, { encoding: enc || 'utf-8' });
};
