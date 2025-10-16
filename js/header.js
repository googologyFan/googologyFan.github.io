function addHeader() {
  const headerContainer = document.createElement("div");
  headerContainer.id = "header-container";
  document.body.prepend(headerContainer);
  const footerContainer = document.createElement("div");
  footerContainer.id = "footer-container";
  document.body.appendChild(footerContainer);

  fetch(`/common/header.html`)
    .then((res) => {
      if (!res.ok) throw new Error("header.html fetch failed");
      return res.text();
    })
    .then((html) => {
      document.getElementById("header-container").innerHTML = html;
      const temp = document.createElement("div");
      temp.innerHTML = html;
      const style = temp.querySelector("style");
      if (style) document.head.appendChild(style);
    })
    .catch((e) => {
      document.getElementById("header-container").innerHTML =
        '<div style="color:red">ヘッダの読み込みに失敗しました: ' +
        e.message +
        "</div>";
    });
  fetch(`/common/footer.html`)
    .then((res) => {
      if (!res.ok) throw new Error("footer.html fetch failed");
      return res.text();
    })
    .then((html) => {
      document.getElementById("footer-container").innerHTML = html;
      const temp = document.createElement("div");
      temp.innerHTML = html;
      const style = temp.querySelector("style");
      if (style) document.head.appendChild(style);
    })
    .catch((e) => {
      document.getElementById("footer-container").innerHTML =
        '<div style="color:red">フッタの読み込みに失敗しました: ' +
        e.message +
        "</div>";
    });
}
