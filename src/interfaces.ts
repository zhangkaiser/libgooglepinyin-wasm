
type ReturnedCandidateList = string;

export interface IDecoder {
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
  choose(cand_id: number): number;
  getSpsStr(): string;
  getCandidate(cand_id: number): string;
  getSplStartPos(): number;
  cancelLastChoice(): number;
  getFixedLen(): number;
  cancelInput(): boolean;
  /** 当前不能与`search`一起使用,会出现内存溢出现象. */ 
  getPredicts(history: string): ReturnedCandidateList;
  close(): void;
  isOpened: boolean;
  decodedLen: number;
  delete(): void;
}

export interface IDecoderController {
  new (): IDecoder;
  prototype: IDecoder;
}

export interface GooglePinyinDecoder extends EmscriptenModule {
  Decoder: IDecoderController;
}