import { createHooks } from "./hooks";
import { render as updateElement } from "./render";

function MyReact() {
  let currentRootComponent = null;
  let $currentRoot = null;

  const _restJSXFromElement = (element) => {
    element.innerHTML = "";
  };

  const _render = () => {
    if ($currentRoot && currentRootComponent) {
      resetHookContext();
      _restJSXFromElement($currentRoot);
      updateElement($currentRoot, currentRootComponent());
    }
  };

  function render($root, rootComponent) {
    $currentRoot = $root;
    currentRootComponent = rootComponent;
    _render();
  }

  const {
    useState,
    useMemo,
    resetContext: resetHookContext,
  } = createHooks(_render);

  return { render, useState, useMemo };
}

export default MyReact();
