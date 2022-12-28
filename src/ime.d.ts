
type ReturnedCandidateList = string;

interface IDecoder {
  /** @return "你好|你|拟|尼..." */
  decode(sps_buf: string, cand_id: number): ReturnedCandidateList;
  clear(): boolean;
  /** @return "你好|你|拟|尼..." */
  search(spsBuf: string): number;
  delSearch(pos: number, isPosInSplid: boolean, clearFixedThisStep: boolean);
  resetSearch(): void;
  choose(cand_id): number;
  getSpsStr(): string;
  getCandidate(cand_id: number): string;
  getSplStartPos(): ReturnedCandidateList;
  cancelLastChoice(): number;
  getFixedLen(): number;
  cancelInput(): boolean;
  getPredicts(history: string): string;
  isOpened: boolean;
  decodedLen: number;
  splStart: string;
}

interface IDecoderController {
  new (): IDecoder;
  prototype: IDecoder;
}

interface GooglePinyinWasm extends EmscriptenModule {
  Decoder: IDecoderController;
}