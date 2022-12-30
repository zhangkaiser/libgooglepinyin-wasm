

type ReturnedCandidateList = string;

interface IDecoder {
  /**
   * decode("pinyin", -1 | cand_id) 
   * @return "你好|你|拟|尼..."
   */
  decode(sps_buf: string, cand_id: number): ReturnedCandidateList;
  clear(): boolean;
  /** @return "你好|你|拟|尼..." */
  search(spsBuf: string): number;
  delSearch(pos: number, isPosInSplid: boolean, clearFixedThisStep: boolean): number;
  resetSearch(): void;
  choose(cand_id): number;
  getSpsStr(): string;
  getCandidate(cand_id: number): string;
  getSplStartPos(): number;
  cancelLastChoice(): number;
  getFixedLen(): number;
  cancelInput(): boolean;
  getPredicts(history: string): ReturnedCandidateList;
  isOpened: boolean;
  decodedLen: number;
}


interface IDecoderController {
  new (): IDecoder;
  prototype: IDecoder;
}

interface GooglePinyinDecoder extends EmscriptenModule {
  Decoder: IDecoderController;
}

declare module globalThis {
  var Module: GooglePinyinDecoder;
  var splStart: number[];
}