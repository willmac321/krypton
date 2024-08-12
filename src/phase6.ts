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

const cycleThroughLengths = async (
  offset = 0,
  keyLen = 3,
  letterToFind = 'E',
): Promise<{ freq: number; letter: string }[][]> => {
  const f1 = (await readFile('../data/krypton6/found1')).replace(/\s/g, '');
  const f2 = (await readFile('../data/krypton6/found2')).replace(/\s/g, '');
  const f3 = (await readFile('../data/krypton6/found3')).replace(/\s/g, '');

  const rv: { freq: number; letter: string }[][] = [];

  [f1, f2, f3].forEach((f) => {
    let testP = '';
    for (let t = offset; t < f.length; t += keyLen) {
      testP += f[t];
    }

    const t = [];
    for (let i = 0; i < 26; i++) {
      const newFreq = vignereCipherDecrypt(testP, String.fromCharCode(65 + i))
        .split('')
        .filter((e) => e === letterToFind).length;
      const freq = newFreq;
      const letter = String.fromCharCode(65 + i);
      t.push({ letter, freq });
    }

    rv.push(t.sort((a, b) => (a.freq < b.freq ? 1 : -1)));
  });

  // get intersection
  let intersect = rv[0].slice(0,10).map(r=>r.letter)
  .filter((r)=>rv[1].slice(0,10).map(t=>t.letter).includes(r))
  .filter((r)=>rv[2].slice(0,10).map(t=>t.letter).includes(r));
  console.log(intersect)

  return rv;
};

const mostCommon = (v: string, wordList: string[]): { count: number; list: string[] } => {
  let localV = v;

  let rv = 0;
  const arr: string[] = [];
  wordList.forEach((w) => {
    const re = new RegExp(w.toUpperCase(), 'g');
    localV = localV.replace(re, () => {
      rv++;
      arr.push(w.toUpperCase());
      return '';
    });
  });

  return { count: rv, list: arr };
};

const getMostCommons = async (
  file: string,
  keyLen: number,
  firstXChars?: number,
  pguess = '',
  matchReportLimit = 2,
) => {
  const guess = pguess.toUpperCase().split('');

  const d1F: string = file;

  const d1 = d1F.slice(0, firstXChars !== -1 ? firstXChars : d1F.length);
  let count = 0;
  let rv = '';
  let key = '';
  let list: string[] = [];
  let allRes = [];

  const offsetArr = [...new Array(keyLen - guess.length)].map((_, i) => Math.pow(26, i));

  // optimize word list a bit
  const wl = commonWords
    // .filter((f) => f.length >= 4)
    .sort((a, b) => (a.length > b.length ? -1 : 1));

  for (let i = 0; i < Math.pow(26, keyLen - guess.length); i++) {
    const offset = (r: number) => Math.floor(i / r);

    const keys = [
      ...guess,
      ...offsetArr.map((e) => String.fromCharCode((offset(e) % 26) + 'A'.charCodeAt(0))),
    ];

    const decrypted = vignereCipherDecrypt(d1, keys.join(''));

    // brute force
    const mc = mostCommon(decrypted, wl);

    if (mc.count >= count) {
      count = mc.count;
      rv = decrypted;
      key = keys.join('');
      list = mc.list;
    }
    if (new Set(mc.list).size >= matchReportLimit) allRes.push({ keys, ...mc, decrypted });
  }
  return { rv, list, key, count, allRes };
};

const getMostCommonForAllFiles = async (
  keyLen: number,
  firstXChars?: number,
  pguess = '',
  matchReportLimit = 2,
) => {
  const f1 = (await readFile('../data/krypton6/found1')).replace(/\s/g, '');
  const res1 = await getMostCommons(f1, keyLen, firstXChars, pguess, matchReportLimit);
  const f2 = (await readFile('../data/krypton6/found2')).replace(/\s/g, '');
  const res2 = await getMostCommons(f2, keyLen, firstXChars, pguess, matchReportLimit);
  const f3 = (await readFile('../data/krypton6/found3')).replace(/\s/g, '');
  const res3 = await getMostCommons(f3, keyLen, firstXChars, pguess, matchReportLimit);

  [res1.allRes, res2.allRes, res3.allRes].forEach((r) => {
    r.sort((a, b) => (a.keys[0] > b.keys[0] ? 1 : -1));
    console.log('new result', r);
  });
};

export const trialWithFile = async (w: string) => {
  const f1 = await readFile('../data/krypton6/found1');
  const f2 = (await readFile('../data/krypton6/found2')).replace(/\s/g, '');
  const f3 = (await readFile('../data/krypton6/found3')).replace(/\s/g, '');
  [f1, f2, f3].forEach((d1) => {
    const rv = vignereCipherDecrypt(d1, w);
    console.log(rv);
  });
};

export {
  vignereCipherDecrypt,
  howManyWithXLetters,
  getMostCommons,
  getMostCommonForAllFiles,
  cycleThroughLengths,
};
