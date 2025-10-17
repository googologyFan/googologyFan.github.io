"use strict";

function convertMarkdown(parent, content) {
  var section = [];
  var blockquote;
  var inBlockquote = false;
  for (var i = 0; i < content.length; i++) {
    if (content[i][0] !== `>`) inBlockquote = false;
    switch (content[i][0]) {
      case "1": {
        if (content[i].startsWith("1.")) {
          var depth = 1;
          while (content[i][2 * depth - 2] + content[i][2 * depth - 1] === "1.")
            depth++;
          if (content[i][depth * 2 - 2] !== " ") {
            content[i] = `\\` + content[i];
            i--;
            continue;
          }
          depth--;
          while (section.length > depth) section.pop();
          if (section.length == depth) section[section.length - 1]++;
          while (section.length < depth) section.push(1);
          var str = "";
          for (var j = 0; j < Math.min(depth, 3); j++) str += "#";
          str += " ";
          for (var j = 0; j < depth; j++) str += section[j] + ".";
          content[i] = str + content[i].slice(2 * depth);
          i--;
          continue;
        } else {
          content[i] = `\\` + content[i];
          i--;
          continue;
        }
        break;
      }
      case ">": {
        if (content[i].startsWith(">> ")) {
          const details = document.createElement("details");
          const summary = document.createElement("summary");
          convertMarkdownString(summary, content[i].slice(3));
          details.appendChild(summary);
          parent.appendChild(details);
        } else {
          if (content[i][1] !== " ") {
            content[i] = `\\` + content[i];
            i--;
            continue;
          }
          if (!inBlockquote) {
            blockquote = document.createElement("blockquote");
            parent.appendChild(blockquote);
            inBlockquote = true;
          }
          const child = document.createElement("div");
          blockquote.appendChild(child);
          child.setAttribute("class", "blockquote-line");
          convertMarkdownString(child, content[i].slice(2));
        }
        break;
      }
      case "#": {
        var hLevel = 1;
        while (content[i][hLevel] === "#") hLevel++;
        if (hLevel > 6 || content[i][hLevel] !== " ") {
          content[i] = `\\` + content[i];
          i--;
          continue;
        }
        const h = document.createElement(`h${hLevel}`);
        convertMarkdownString(h, content[i].slice(hLevel + 1));
        parent.appendChild(h);
        break;
      }
      case "-": {
        if (content[i].startsWith("---")) {
          const hr = document.createElement("hr");
          parent.appendChild(hr);
          break;
        }
        if (content[i].startsWith("-# ")) {
          const div = document.createElement("div");
          div.setAttribute("class", "details");
          convertMarkdownString(div, content[i].slice(3));
          parent.appendChild(div);
          break;
        }
        content[i] = `\\` + content[i];
        i--;
        continue;
      }
      case undefined: {
        parent.appendChild(document.createElement("br"));
        break;
      }

      default: {
        const div = document.createElement("div");
        convertMarkdownString(div, content[i]);
        parent.appendChild(div);
        break;
      }
    }
    inBlockquote;
  }
}

function convertMarkdownString(parent, str) {
  // 画像: \img(size) url
  let match = str.match(/\\img\((.*?)\)\s+(\S+)/);
  if (match) {
    const img = document.createElement("img");
    img.style.maxWidth = match[1] + "%";
    img.src = "../img/" + match[2];
    parent.appendChild(img);
    return;
  }
  // 中央[etc..]揃え: \align{pattern} text
  match = str.match(/\\align\{(.*?)\}\s+(.*)/);
  if (match) {
    const before = str.substring(0, match.index);
    if (before) {
      parent.appendChild(document.createTextNode(before));
    }

    const aligned = document.createElement("div");
    aligned.setAttribute("class", "align-" + match[1]);
    convertMarkdownString(aligned, match[2]);
    parent.appendChild(aligned);
    return;
  }
  if (str[0] === "\\") str = str.slice(1);

  // リンク: [text](url)
  match = str.match(/\[(.*?)\]\((.*?)\)/);
  if (match) {
    const before = str.substring(0, match.index);
    if (before) {
      convertMarkdownString(parent, before);
    }

    const a = document.createElement("a");
    a.href = match[2];
    convertMarkdownString(a, match[1]);
    parent.appendChild(a);

    const after = str.substring(match.index + match[0].length);
    convertMarkdownString(parent, after);
    return;
  }

  // 太字: **text**
  match = str.match(/\*\*(.*?)\*\*/);
  if (match) {
    const before = str.substring(0, match.index);
    if (before) {
      parent.appendChild(document.createTextNode(before));
    }

    const strong = document.createElement("strong");
    convertMarkdownString(strong, match[1]);
    parent.appendChild(strong);

    const after = str.substring(match.index + match[0].length);
    convertMarkdownString(parent, after);
    return;
  }

  // 下線: __text__
  match = str.match(/__(.*?)__/);
  if (match) {
    const before = str.substring(0, match.index);
    if (before) {
      parent.appendChild(document.createTextNode(before));
    }

    const u = document.createElement("u");
    convertMarkdownString(u, match[1]);
    parent.appendChild(u);

    const after = str.substring(match.index + match[0].length);
    convertMarkdownString(parent, after);
    return;
  }

  // 斜体: *text*
  match = str.match(/\*(.*?)\*/);
  if (match) {
    const before = str.substring(0, match.index);
    if (before) {
      parent.appendChild(document.createTextNode(before));
    }

    const em = document.createElement("em");
    convertMarkdownString(em, match[1]);
    parent.appendChild(em);

    const after = str.substring(match.index + match[0].length);
    convertMarkdownString(parent, after);
    return;
  }
  // 斜体: _text_
  match = str.match(/_(.*?)_/);
  if (match) {
    const before = str.substring(0, match.index);
    if (before) {
      parent.appendChild(document.createTextNode(before));
    }

    const em = document.createElement("em");
    convertMarkdownString(em, match[1]);
    parent.appendChild(em);

    const after = str.substring(match.index + match[0].length);
    convertMarkdownString(parent, after);
    return;
  }

  // 打ち消し線: ~~text~~
  match = str.match(/~~(.*?)~~/);
  if (match) {
    const before = str.substring(0, match.index);
    if (before) {
      parent.appendChild(document.createTextNode(before));
    }

    const s = document.createElement("s");
    convertMarkdownString(s, match[1]);
    parent.appendChild(s);

    const after = str.substring(match.index + match[0].length);
    convertMarkdownString(parent, after);
    return;
  }

  // インラインコード: `code`
  match = str.match(/`(.*?)`/);
  if (match) {
    const before = str.substring(0, match.index);
    if (before) {
      parent.appendChild(document.createTextNode(before));
    }

    const code = document.createElement("code");
    code.innerText = match[1];
    parent.appendChild(code);

    const after = str.substring(match.index + match[0].length);
    convertMarkdownString(parent, after);
    return;
  }

  const span = document.createElement("span");
  span.innerText = str;
  parent.appendChild(span);
}
