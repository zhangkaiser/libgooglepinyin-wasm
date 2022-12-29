
import {mountIDBFS, writeinIDBFS} from "./idbfspre";

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
