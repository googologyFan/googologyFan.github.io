"use strict";

/**
 * id(string) is the id of parent element.
 *
 * data(dictionary) can have these:
 * @title(string) The title of the diary. It be placed \<title> and the \<h1> on the top
 * @date(array[year,month,day]) The day written.
 * @content(array of strings) The content of the diary as markdown. Each string has a '\\n'.
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

  if (data.title != undefined) {
    const title = document.createElement("title");
    title.innerText = data.title;
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
    };

    mdScript.onerror = function () {
      console.error("Failed to load markdown.js");
    };

    head.appendChild(mdScript);
  }
}

function applyStyle1(id) {
  const node = document.getElementById(id);
  node.setAttribute("class", "main-container");
}
