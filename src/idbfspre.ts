
function mountIDBFS() {
  FS.mkdir("/user");
  FS.mount(IDBFS, {}, "/user");

  FS.syncfs(true, (err) => err && console.error(err));
}

Module.preRun.unshift(mountIDBFS);


Module['handleUnmountIDBFS'] = (): Promise<boolean> => {
  return new Promise((resolve, reject) => {
    FS.syncfs((err) => {
      if (err) reject(err);
      else resolve(true);    
    });
  });
}
