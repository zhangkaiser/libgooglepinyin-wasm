

function inited() {
  return new Promise((resolve) => {
    Module['onRuntimeInitialized'] = () => resolve(true);
  })
}

export const initedPromise = inited();
export default Module as GooglePinyinDecoder;
