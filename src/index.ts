/// <reference path="./types/index.d.ts" />
import {mountIDBFS, writeinIDBFS} from "./idbfspre";
export { addUserDict, addUserDicts, downloadUserDict, uploadUserDict } from "./userdictmanager";


Module.preRun.unshift(mountIDBFS);

function inited() {
  return new Promise((resolve) => {
    Module['onRuntimeInitialized'] = () => resolve(true);
  })
}

export function onExit() {
  writeinIDBFS();
}

export const initedPromise = inited();
export default Module as GooglePinyinDecoder;
