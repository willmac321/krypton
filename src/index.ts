import {getPhase4} from './phase4AndBelow';
import { getMostCommons, howManyWithXLetters, trialWithFile, vignereCipherDecrypt } from './phase6';


const main = async () => {
  // file 1 ZQQ = the, qjrh - code, qjrhLYAT, qjrhjgbT, qjrhaswu
  console.log(await getMostCommons(3, 4, '', 1));
  // await trialWithFile('ZQQ');
};

main();
