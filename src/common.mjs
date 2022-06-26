export function redirectWithAlert(res, msg, url) {
  // res.writeHead(200, {
  //   "Content-Type": "application/javascript; charset=utf-8",
  // });
  res.write(`<script>alert('${msg}')</script>`);
  res.write(`<script>window.location="${url}"</script>`);
  res.end();
}
