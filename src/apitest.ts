import assert from "node:assert";

const pageSize = 5;

function getCandidates(decoder: IDecoder, len: number) {
  
  let n = len > pageSize ? 5 : len;
  let candidates = [];
  for (let i = 0; i < n; i++) {
    candidates.push(decoder.getCandidate(i));
  }

  assert(candidates.filter((candidate) => !!candidate).length == n, "获取到候选词数量不对");
  return candidates;
}

Module['onRuntimeInitialized'] = function() {

  function getPredictsAndChooseBugTest(sps: string) {
    let decoder = new Module['Decoder'];
    console.log(sps, decoder.decode(sps, -1));

    let predicts = decoder.getPredicts(decoder.getCandidate(0));
    let isCancel = decoder.clear();

    console.log(predicts, isCancel);
    console.log("zhangsheng", decoder.decode("zhangsheng", -1));
    predicts = decoder.getPredicts(decoder.getCandidate(0));
    isCancel = decoder.clear();
    console.log(isCancel, predicts);

    console.log("shijie", decoder.decode("shijie", -1));
    predicts = decoder.getPredicts(decoder.getCandidate(0));
    isCancel = decoder.clear();

    let spsStr = decoder.getSpsStr();
    (decoder as any).delete();
  }

  let time = performance.now();
  getPredictsAndChooseBugTest("pinyin");
  console.log(performance.now() - time);

  time = performance.now();
  getPredictsAndChooseBugTest("shijie");
  console.log(performance.now() - time);

  time = performance.now();
  getPredictsAndChooseBugTest("chongqing");
  console.log(performance.now() - time);

  // let decoder = new Module['Decoder'];

  // let candidatesNum = decoder.search("pinyin");
  // assert(candidatesNum > 0, "内部解析出现错误.");
  // let fixedNum = candidatesNum;
  // let candidates = getCandidates(decoder, candidatesNum);
  // assert(candidates.indexOf("拼音") > -1, "解析出词库不符合预期");

  // candidatesNum = decoder.delSearch(1, true, true);
  // assert(candidatesNum > 0, '内部解析出错.');
  // let candidate = decoder.getCandidate(0);
  // console.log("delSearch after:", candidate);

  // decoder.resetSearch();
  // candidate = decoder.getCandidate(0);
  // // assert(candidate === "拼音", "与个人预测的功能不一样" + candidate);
  // console.log("resetSearch", candidate);

  
  // let isCancel = decoder.clear();
  // assert(isCancel, "与想象的不一样");
  // candidatesNum = decoder.search("pinyin");
  // assert(candidatesNum === fixedNum, "逻辑上可能出错.");

  // isCancel = decoder.clear();
  // assert(isCancel, "与想象的不一样");

  // function repeat(spsBuf: string) {
  //   console.log("test1")
  //   isCancel = decoder.clear();
  //   assert(isCancel, "与想象的不一样");
  //   console.log("test2")
  //   let candidates = decoder.decode(spsBuf, -1);
  //   assert(candidates.length > 0, "逻辑上可能出错.");
  //   console.log("test3")
  
  //   let spsStr = decoder.getSpsStr();
  //   console.log(spsStr);
  //   console.log("test4")
  //   assert(spsStr.length === decoder.decodedLen, "返回出错,");
  
  //   let getSplStartPos = decoder.getSplStartPos();
  //   console.log("getSplStartPos:", getSplStartPos);
  //   console.log("test5")
  //   // console.log("splStart:", decoder.splStart);
  //   let getFixedLen = decoder.getFixedLen();
  //   console.log("getFixedLen", getFixedLen);
  //   console.log("test6");
  //   let predicts = decoder.getPredicts(decoder.getCandidate(0));
  //   console.log(getSplStartPos, predicts);
  // }

  // repeat("zhongguo");
  // repeat("zhongwen");
  // repeat("dajiahao");
  // repeat("shijie");


  // function test1() {
  //   isCancel = decoder.clear();
  //   assert(isCancel, "与想象的不一样");
  //   let predicts = decoder.getPredicts("中国");
  //   console.log("1", predicts);

  //   isCancel = decoder.clear();
  //   assert(isCancel, "与想象的不一样");
  //   predicts = decoder.getPredicts("世界");
  //   console.log("2", predicts);
  // }
  

}