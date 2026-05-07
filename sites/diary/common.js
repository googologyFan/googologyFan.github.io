"use strict";

const debugging = false;
// debugging = true;

/**
 * id(string) is the id of parent element.
 *
 * data(dictionary) can have these:
 * @title(string) The title of the diary. It be placed \<title> and the \<h1> on the top
 * @date(array[year,month,day]) The day written.
 * @content(array of strings) The content of the diary as markdown. Each string has a '\\n'.
 * @mokuji(bool) Whether to generate mokuji or not. Default is false.
 *
 *  */
function setup(id, data) {
  const parent = document.getElementById(id);
  const head = document.getElementsByTagName("head")[0];
  function add(str) {
    const elem = document.createElement(str);
    parent.appendChild(elem);
    return elem;
  }

  // const codeHighlightScript = document.createElement("script");
  // codeHighlightScript.setAttribute("src", "https://cdnjs.cloudflare.com/ajax/libs/highlight.js/11.9.0/highlight.min.js");
  // const codeHighlightStyle = document.createElement("link");
  // codeHighlightStyle.setAttribute("rel", "stylesheet");
  // codeHighlightStyle.setAttribute("href", "https://cdnjs.cloudflare.com/ajax/libs/highlight.js/11.9.0/styles/default.min.css");
  // head.appendChild(codeHighlightScript);
  // head.appendChild(codeHighlightStyle);

  if (data.title != undefined) {
    const title = document.createElement("title");
    title.innerText = "かみゅ～ - " + data.title;
    const h1 = document.createElement("h1");
    h1.innerHTML = data.title;
    head.appendChild(title);
    parent.appendChild(h1);
  }
  if (data.date != undefined && data.date.length === 3) {
    const dateContainer = document.createElement("div");
    dateContainer.setAttribute("class", "date-container");
    const date = document.createElement("span");
    date.setAttribute("class", "date");
    date.innerText = `${data.date[0]}/${data.date[1]}/${data.date[2]}`;
    dateContainer.appendChild(date);
    parent.appendChild(dateContainer);
  }
  // add("hr");
  add("br");
  add("br");

  if (data.content != undefined) {
    const mdScript = document.createElement("script");
    mdScript.src = "./markdown.js";

    mdScript.onload = function () {
      const contentDiv = document.createElement("div");
      parent.appendChild(contentDiv);
      if (typeof convertMarkdown === "function") {
        convertMarkdown(contentDiv, data.content);
      } else {
        console.error("convertMarkdown function is not defined.");
      }

      if (data.mokuji != undefined && data.mokuji == true) {
        const headings = contentDiv.querySelectorAll(
          "h1[id^='section-'], h2[id^='section-'], h3[id^='section-'], h4[id^='section-'], h5[id^='section-'], h6[id^='section-']"
        );
        if (headings.length > 0) {
          const detailsWrapper = document.createElement("div");
          detailsWrapper.style.textAlign = "center";

          const details = document.createElement("details");
          details.style.display = "inline-block";
          details.style.textAlign = "left";
          details.style.fontSize = "1.35em";
          details.style.backgroundColor = "#181202";
          details.style.padding = "10px 14px";
          details.style.borderRadius = "8px";

          const summary = document.createElement("summary");
          summary.style.textAlign = "center";
          summary.style.display = "list-item";
          summary.style.listStylePosition = "inside";
          summary.innerText = "目次";
          details.appendChild(summary);

          const list = document.createElement("ul");
          list.style.display = "inline-block";
          list.style.textAlign = "left";
          list.style.margin = "0 auto";
          for (var i = 0; i < headings.length; i++) {
            const heading = headings[i];
            const level = parseInt(heading.tagName.slice(1), 10) || 1;
            const li = document.createElement("li");
            li.style.marginLeft = (level - 1) * 16 + "px";

            const a = document.createElement("a");
            a.href = "#" + heading.id;
            a.innerText = heading.innerText;
            li.appendChild(a);
            list.appendChild(li);
          }
          details.appendChild(list);
          detailsWrapper.appendChild(details);
          parent.insertBefore(detailsWrapper, contentDiv);
        }
      }
    };

    mdScript.onerror = function () {
      console.error("Failed to load markdown.js");
    };

    head.appendChild(mdScript);
  }

  const timer = setTimeout(function () {
    const latexScript = document.createElement("script");
    latexScript.setAttribute("src", "https://cdn.jsdelivr.net/npm/mathjax@3/es5/tex-mml-chtml.js");
    head.appendChild(latexScript);

    if (debugging)
      scrollTo(0, 1000000);
  }, 1000);

}

function applyStyle1(id) {
  const node = document.getElementById(id);
  node.setAttribute("class", "main-container");
}
