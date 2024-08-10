import readFile from './readFile';
import commonWords from '../data/commonWords.json';

const binomialCoefficient = (n: number, k: number) => {
  if (k < 0 || k > n) return 0;
  if (k === 0 || k === n) return 1;
  if (k === 1 || k === n - 1) return n;
  if (n - k < k) k = n - k;
  let res = n;
  for (let j = 2; j <= k; j++) res *= (n - j + 1) / j;
  return Math.round(res);
};

const howManyWithXLetters = (x: number) => {
  const c = commonWords.reduce((acc, curr) => {
    if (curr.length === x) acc++;
    return acc;
  }, 0);
  return c;
};

const vignereCipherDecrypt = (code: string, key: string): string => {
  const codeArr = code.replace(/\s+/g, '').split('');
  const keyOfLen = [...new Array(codeArr.length)].map((_, i) => {
    return key[i % key.length];
  });

  return codeArr
    .map((c, i) => {
      const k = keyOfLen[i].charCodeAt(0);
      return String.fromCharCode(((c.charCodeAt(0) - k + 26) % 26) + 'A'.charCodeAt(0));
    })
    .join('');
};

const mostCommon = (v: string, wordList: string[]): {count:number, list:string[]} => {
  let localV = v;

  let rv = 0;
  const arr:string[] = [];
  wordList.sort((a, b) => (a.length > b.length ? -1 : 1));

  wordList.forEach((w) => {
    const re = new RegExp(w.toUpperCase(), 'g');
    localV = localV.replace(re, () => {
      rv++;
      arr.push(w.toUpperCase());
      return '';
    });
  });

  return {count: rv, list:arr};
};

const getMostCommons = async (keyLen: number) => {
  const d1 = await readFile('../data/krypton5/found1');
  let count = 0;
  let rv = '';

  const offsetArr = [...new Array(keyLen)].map((_, i) => Math.pow(26, i));

  for (let i = 0; i < Math.pow(26, keyLen); i++) {

    const offset = (r: number) => Math.floor(i / r);

    const keys = offsetArr.map((e) => String.fromCharCode((offset(e) % 26) + 'A'.charCodeAt(0)));

    const decrypted = vignereCipherDecrypt(d1, keys.join(''));

    // brute force
    const mc = mostCommon(decrypted, commonWords);

    if (mc.count >= count) {
      count = mc.count;
      rv = decrypted;
      if (count >= 10) console.log(keys, mc, decrypted);
    }
  }
  return rv;
};

export { vignereCipherDecrypt, howManyWithXLetters, getMostCommons };
