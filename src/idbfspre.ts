
export function mountIDBFS() {
  let depsId = "mountIDBFS";

  FS.mkdir("/user");
  FS.mount(IDBFS, {}, "/user");
  (Module as any).addRunDependency(depsId);
  FS.syncfs(true, (err) => {
    err && console.error(err);
    (Module as any).removeRunDependency(depsId);
  });
}

export function writeinIDBFS(): Promise<boolean> {
  return new Promise((resolve, reject) => {
    FS.syncfs((err) => {
      if (err) reject(err);
      else resolve(true);    
    });
  });
}
