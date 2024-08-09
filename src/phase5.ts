import readFile from './readFile';
import commonWords from '../data/commonWords.json';

const mostCommonLetters = [
  'E', //
  'A',
  'T', //
  'S',
  'O',
  'R',
  'I',
  'N', //
  'H', //
  'C',
  'L',
  'D',
  'U',
  'P',
  'M',
  'F',
  'W',
  'G',
  'Y',
  'B',
  'K', //
  'V', //
  'X',
  'Q',
  'J',
  'Z',
]; //'ETAOIN SHRDLU';

const binomialCoefficient = (n: number, k: number) => {
  if (k < 0 || k > n) return 0;
  if (k === 0 || k === n) return 1;
  if (k === 1 || k === n - 1) return n;
  if (n - k < k) k = n - k;
  let res = n;
  for (let j = 2; j <= k; j++) res *= (n - j + 1) / j;
  return Math.round(res);
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

const mostCommon = (v: string): number => {
  const localV = v;

  let rv = 0;
  commonWords.sort((a, b) => (a.length > b.length ? 1 : -1));

  commonWords.forEach((w) => {
    const re = new RegExp(w.toUpperCase(), 'g');
    localV.replace(re, () => {
      rv++;
      return '';
    });
  });

  return rv;
};

const howManyWithXLetters = (x: number) => {
  const c = commonWords.reduce((acc, curr) => {
    if (curr.length === x) acc++;
    return acc;
  }, 0);
  return c;
};

const getMostCommons = async (keyLen: number) => {
  const d1 = await readFile('../data/krypton5/found1');
  let count = 0;
  let rv = '';

  const aBC = Math.pow(26, keyLen - 6);
  const bBC = Math.pow(26, keyLen - 5);
  const cBC = Math.pow(26, keyLen - 4);
  const dBC = Math.pow(26, keyLen - 3);
  const eBC = Math.pow(26, keyLen - 2);
  const fBC = Math.pow(26, keyLen - 1);

  // for (let i = 0; binomialCoefficient(26, keyLen); i++) {
  //   const offset = (r: number) => Math.floor(i / r);

  //   const a = String.fromCharCode((offset(aBC) % 26) + 'A'.charCodeAt(0));
  //   const b = String.fromCharCode((offset(bBC) % 26) + 'A'.charCodeAt(0));
  //   const c = String.fromCharCode((offset(cBC) % 26) + 'A'.charCodeAt(0));
  //   const d = String.fromCharCode((offset(dBC) % 26) + 'A'.charCodeAt(0));
  //   const e = String.fromCharCode((offset(eBC) % 26) + 'A'.charCodeAt(0));
  //   const f = String.fromCharCode((offset(fBC) % 26) + 'A'.charCodeAt(0));
  //   const decrypted = vignereCipherDecrypt(d1, [a, b, c, d, e, f].join(''));
  //   const mc = mostCommon(decrypted);
  //   if (mc >= count) {
  //     count = mc;
  //     rv = decrypted;
  //     if (count >= 10) console.log([a, b, c, d, e, f], mc, decrypted);
  //   }
  // }

  const offsetArr = [...(new Array(keyLen))].map((_, i)=> Math.pow(26, i));


  for (let i = 0; i < binomialCoefficient(26, keyLen); i++) {

    const offset = (r: number) => Math.floor(i / r);

    const keys = offsetArr.map(e=>String.fromCharCode((offset(e) % 26) + 'A'.charCodeAt(0)));

    const decrypted = vignereCipherDecrypt(d1, keys.join(''));
    const mc = mostCommon(decrypted);
    if (mc >= count) {
      count = mc;
      rv = decrypted;
      if (count >= 10) console.log(keys, mc, decrypted);
    }
  }
  return rv;
};

export { vignereCipherDecrypt, howManyWithXLetters, getMostCommons };
