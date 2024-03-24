export function createHooks(callback) {
  const stateContext = {
    current: 0,
    states: [],
  };

  const memoContext = {
    current: 0,
    memos: [],
  };

  let requestAnimationFrameId = undefined;
  let pendingRender = false;

  function resetContext() {
    stateContext.current = 0;
    memoContext.current = 0;
    pendingRender = false;
    requestAnimationFrameId = undefined;
  }

  const useState = (initState) => {
    const { current, states } = stateContext;
    stateContext.current += 1;

    states[current] = states[current] ?? initState;

    const setState = (newState) => {
      if (newState === states[current]) return;
      states[current] = newState;
      if (requestAnimationFrameId !== null) {
        cancelAnimationFrame(requestAnimationFrameId);
      }

      if (!pendingRender) {
        // pendingRender flag를 사용해서  다음 frame에서 callback 함수를 실행하도록 batch 처리.
        pendingRender = true;
        requestAnimationFrame(() => {
          // 다음 frame에서 callback 함수 실행 후 플래그 원복 처리.
          callback();
          pendingRender = false;
        });
      }
    };

    return [states[current], setState];
  };

  const useMemo = (fn, refs) => {
    const { current, memos } = memoContext;
    memoContext.current += 1;

    const memo = memos[current];

    const resetAndReturn = () => {
      const value = fn();
      memos[current] = {
        value,
        refs,
      };
      return value;
    };

    if (!memo) {
      return resetAndReturn();
    }

    if (refs.length > 0 && memo.refs.find((v, k) => v !== refs[k])) {
      return resetAndReturn();
    }
    return memo.value;
  };

  return { useState, useMemo, resetContext };
}
