"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const assert_1 = __importDefault(require("assert"));
const pageSize = 5;
function getCandidates(decoder, len) {
    let n = len > pageSize ? 5 : len;
    let candidates = [];
    for (let i = 0; i < n; i++) {
        candidates.push(decoder.getCandidate(i));
    }
    (0, assert_1.default)(candidates.filter((candidate) => !!candidate).length == n, "获取到候选词数量不对");
    return candidates;
}
Module['onRuntimeInitialized'] = function () {
    let decoder = new Module['Decoder'];
    let candidatesNum = decoder.search("pinyin");
    (0, assert_1.default)(candidatesNum > 0, "内部解析出现错误.");
    let fixedNum = candidatesNum;
    let candidates = getCandidates(decoder, candidatesNum);
    (0, assert_1.default)(candidates.indexOf("拼音") > -1, "解析出词库不符合预期");
    candidatesNum = decoder.delSearch(1, true, true);
    (0, assert_1.default)(candidatesNum > 0, '内部解析出错.');
    let candidate = decoder.getCandidate(0);
    console.log("delSearch after:", candidate);
    decoder.resetSearch();
    candidate = decoder.getCandidate(0);
    (0, assert_1.default)(candidate === "拼音", "与个人预测的功能不一样");
    let isCancel = decoder.clear();
    (0, assert_1.default)(isCancel, "与想象的不一样");
    candidatesNum = decoder.search("pinyin");
    (0, assert_1.default)(candidatesNum === fixedNum, "逻辑上可能出错.");
    function repeat(spsBuf) {
        let isCancel = decoder.clear();
        (0, assert_1.default)(isCancel, "与想象的不一样");
        candidatesNum = decoder.search(spsBuf);
        (0, assert_1.default)(candidatesNum > 0, "逻辑上可能出错.");
        let spsStr = decoder.getSpsStr();
        (0, assert_1.default)(spsStr.length === decoder.decodedLen, "返回出错,");
        let getSplStartPos = decoder.getSplStartPos();
        console.log("getSplStartPos:", getSplStartPos);
        console.log("splStart:", decoder.splStart);
        let getFixedLen = decoder.getFixedLen();
        console.log("getFixedLen", getFixedLen);
    }
    repeat("zhongguo");
    repeat("zhongwen");
    repeat("dajiahao");
    repeat("shijie");
};
//# sourceMappingURL=apitest.js.map