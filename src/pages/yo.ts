export function yo() {
  new Promise((resolve) => {
    setTimeout(() => {
      return resolve("halo ");
    }, 3000);
  });
}
