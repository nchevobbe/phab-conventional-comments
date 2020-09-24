// Listen for DOM Mutation in order to detect when the comment textarea is displayed on the page
const observer = new MutationObserver((mutations) => {
  for (let mutation of mutations) {
    for (let addedNode of mutation.addedNodes) {
      const commentContainer = addedNode.querySelector
        ? addedNode.querySelector(".differential-inline-comment-edit")
        : null;
      if (commentContainer) {
        addConventionalCommentUIToCommentToolbar(commentContainer);
      }
      console.log("added node", commentContainer);
    }
  }
});
observer.observe(document, { childList: true, subtree: true });

const CONVENTIONAL_COMMENTS = {
  nitpick: {
    icon: "info-circle",
  },
  typo: {
    icon: "keyboard-o",
  },
  suggestion: {
    icon: "pencil",
  },
  issue: {
    icon: "exclamation-triangle",
    stylePrefix: "IMPORTANT",
  },
  question: {
    icon: "question-circle",
  },
  thought: {
    icon: "comment",
  },
  "follow-up": {
    icon: "share",
  },
  praise: {
    icon: "thumbs-up",
  },
};

/**
 *
 * @param {Element} commentContainerEl
 */
function addConventionalCommentUIToCommentToolbar(commentContainerEl) {
  const commentToolbar = commentContainerEl.querySelector(
    ".remarkup-assist-bar"
  );

  if (!commentToolbar) {
    return;
  }

  const label = document.createElement("label");
  label.innerText = "label:";

  label.style.display = "inline-flex";
  label.style.marginBlockStart = "6px";
  label.style.alignItems = "center";
  label.style.color = "#52596c";
  label.style.marginInlineStart = "4px";

  const select = document.createElement("select");
  select.style.width = "40px";
  select.style.minWidth = "40px";
  select.style.height = "100%";
  select.style.marginInlineStart = "4px";

  label.append(select);

  const optionEl = document.createElement("option");
  optionEl.value = "";
  optionEl.innerText = "-";
  select.append(optionEl);

  for (const option of Object.keys(CONVENTIONAL_COMMENTS)) {
    const el = document.createElement("option");
    el.value = option;
    el.innerText = option;
    select.append(el);
  }

  select.addEventListener("change", () => {
    if (select.value == "") {
      return;
    }

    const labelData = CONVENTIONAL_COMMENTS[select.value];

    const textAreaEl = commentContainerEl.querySelector(
      "textarea.remarkup-assist-textarea"
    );
    const prefix = `${
      labelData.stylePrefix ? `(${labelData.stylePrefix})` : ""
    }{nav, ${labelData.icon ? ` icon=${labelData.icon},` : ""} name=${
      select.value
    }} `;
    textAreaEl.value = `${prefix}\n${textAreaEl.value}`;
    select.value = "";
    textAreaEl.focus();
    textAreaEl.selectionStart = textAreaEl.selectionEnd = prefix.length;
  });

  const separator = document.createElement("span");
  separator.classList.add("remarkup-assist-separator");
  commentToolbar.append(separator, label);
}
