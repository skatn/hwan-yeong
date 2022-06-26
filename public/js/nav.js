function onClickSideMenu() {
  console.log("onClickSideMenu");
  const nav = document.getElementsByClassName("side-menu")[0];
  if (nav.style.display === "none") nav.style.display = "block";
  else nav.style.display = "none";
}
