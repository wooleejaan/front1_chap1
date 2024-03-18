export function createHooks(callback) {
  let states = [];
  let memos = [];
  let stateIndex = 0;
  let memoIndex = 0;
  let isRendering = false;

  function useState(initialState) {
    const currentIndex = stateIndex++;
    if (states[currentIndex] === undefined) {
      states[currentIndex] = initialState;
    }

    const setState = (newState) => {
      if (!isRendering) {
        const resolvedState =
          typeof newState === "function"
            ? newState(states[currentIndex])
            : newState;
        // 현재 상태와 새로운 상태가 같은지 비교
        if (states[currentIndex] !== resolvedState) {
          states[currentIndex] = resolvedState;
          render();
        }
      }
    };

    return [states[currentIndex], setState];
  }

  function useMemo(fn, deps) {
    if (
      memos[memoIndex] === undefined ||
      hasDepsChanged(memos[memoIndex].deps, deps)
    ) {
      const newValue = fn();
      memos[memoIndex] = { value: newValue, deps };
    }
    return memos[memoIndex++].value;
  }

  function resetContext() {
    stateIndex = 0;
    memoIndex = 0;
    isRendering = false;
  }

  function render() {
    isRendering = true;
    resetContext();
    callback();
    isRendering = false;
  }

  function hasDepsChanged(oldDeps, newDeps) {
    if (!oldDeps || !newDeps || oldDeps.length !== newDeps.length) return true;
    for (let i = 0; i < oldDeps.length; i++) {
      if (oldDeps[i] !== newDeps[i]) return true;
    }
    return false;
  }

  return { useState, useMemo, resetContext };
}
