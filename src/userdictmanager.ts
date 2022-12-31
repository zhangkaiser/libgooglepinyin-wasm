import { downloadFileUseChromeTabsAPI } from "./api/emscripten/files";
import { IDecoder } from "./interfaces";

export function addUserDict(decoder: IDecoder,pinyin: string, candidate: string) {
  // 不支持非汉字
  if (/[a-zA-Z]/.test(candidate)) return;
  let selectedCandID = -1;
  let maxLoop = 9;
  let sliceStartPos = 0;

  for (let i = 0; i < maxLoop; i++) {
    let candidates = decoder.decode(pinyin, selectedCandID);
    let currentCandidate = candidate.slice(sliceStartPos);

    let candidateList = candidates.split("|");
    if (candidateList.length === 1 || (i == 0 && candidates.startsWith(candidate))) return;

    if (candidates.startsWith(candidate)) {
      selectedCandID = 0;
    } else {
      selectedCandID = candidateList.sort((a: string, b: string) => b.length - a.length)
      .findIndex((value: string) => currentCandidate.startsWith(value));
      sliceStartPos += candidateList[selectedCandID].length;        
    }

    // Avoid decoder lemma issue.      
    if (selectedCandID == 0) {
      decoder.decode(pinyin, -1);
    }
  }
}

type PinyinStrType = string;
type CandidateStrType = string;

export function addUserDicts(decoder: IDecoder, entries: [PinyinStrType, CandidateStrType][]) {

  const actionAfterLoopTimes = 20;
  
  for (let i = 0, l = entries.length; i < l; i++) {
    if (i % actionAfterLoopTimes) {
      let item = entries[i];
      addUserDict(decoder, item[0], item[1]);  
    } else {
      decoder.clear();
    }
  }

  decoder.clear();
}

export function downloadUserDict() {
  downloadFileUseChromeTabsAPI(FS, "user/dict_pinyin.dat");
}

export function uploadUserDict(data: string | ArrayBufferView) {
  FS.writeFile("user/dict_pinyin.dat", data);
}