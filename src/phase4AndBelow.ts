import readFile from './readFile';
import commonWords from '../data/commonWords.json';

const rot = async (value: string, shiftBy: number = 13) => {
  return value.split('').reduce((acc, curr) => {
    const letter = curr.charCodeAt(0) - 64;
    if (letter < 0) return acc;
    const shifted = String.fromCharCode(((letter + shiftBy + 26) % 26) + 64);
    console.log(curr, letter, letter + shiftBy, shifted);
    return acc + shifted;
  }, '');
};

const ceasar = async (value: string) => {
  const shift = 'M'.charCodeAt(0) - 'Y'.charCodeAt(0);
  return rot(value, shift);
};

const mostCommon = async (value: string) => {
  const d1 = await readFile('../data/krypton4/found1');
  const d2 = await readFile('../data/krypton4/found2');
  const d3 = await readFile('../data/krypton4/found3');

  const mostCommon = [
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
  const freq: Record<string, number> = {};

  [d1, d2, d3].forEach((d) => {
    // get freq
    d.split('').forEach((el) => {
      if (el === ' ') return;
      if (freq[el]) freq[el]++;
      else freq[el] = 1;
    });
  });

  // try to find most common based on freq
  const map: Record<string, string> = Object.entries(freq)
    .sort((a, b) => (a[1] > b[1] ? -1 : 1))
    .reduce((acc, curr, i) => {
      if (i >= mostCommon.length) {
        return { ...acc, [curr[0]]: '*' };
      }
      return { ...acc, [curr[0]]: mostCommon[i] };
    }, {});

  let rv = '';
  let alt = '';
  let alt1 = '';

  d3.split('').forEach((el) => {
    if (el === ' ') alt1 += '';
    else alt1 += map[el];
  });

  (d1 + d2 + d3).split('').forEach((el) => {
    if (el === ' ') alt += '';
    else alt += map[el];
  });

  value.split('').forEach((el) => {
    if (el === ' ') rv += '';
    else rv += map[el];
  });
  return rv;
};

const wordsIn = (str: string) => {
  let matches = 0;
  commonWords.forEach((e) => {
    const els = str.match(new RegExp(e, 'gi'));
    matches += els?.length || 0;
    if (els?.length) console.log(els);
  });
  return matches;
};

// find a phrase freq based on end letter
const phrase = (phrase: string, dict: string) => {
  const end = phrase.slice(phrase.length - 1, phrase.length);
  return Object.entries(
    dict.split(end).reduce((acc: Record<string, number>, curr) => {
      const key: string = `${curr.slice(curr.length - phrase.length + 1)}${end}`;
      const value: number = acc[key] ? acc[key] + 1 : 1;
      return { ...acc, ...{ [key]: value } };
    }, {}),
  ).sort((a, b) => (a[1] > b[1] ? -1 : 1));
};

const getPhase4 = async () => {
  const data1 = await readFile('../data/krypton4/krypton4');
  console.log(await mostCommon(data1));
};
