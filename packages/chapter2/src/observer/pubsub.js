let observers = {};
let currentCallback;

const wrapFunction =
  (fn, wrapWith) =>
  (...args) =>
    wrapWith(fn, ...args);

const setWithLogging = (getOriginalFunc, target, prop, value) => {
  console.log(`Setting property '${prop}' with value ${value}`);
  return getOriginalFunc(target, prop, value);
};

const getWithLogging = (getOriginalFunc, target, prop) => {
  console.log(`Getting property '${prop}'`);
  return getOriginalFunc(target, prop);
};

export const 구독 = (fn) => {
  currentCallback = fn;
  return fn();
};

export const 발행기관 = (object) => {
  const newObject = new Proxy(object, {
    set: wrapFunction((target, prop, value) => {
      target[prop] = value;
      observers[prop]?.forEach((fn) => fn());
      return true;
    }, setWithLogging),
    get: wrapFunction((target, prop) => {
      if (typeof currentCallback !== "function") {
        return;
      }
      if (!observers[prop]) {
        observers[prop] = new Set();
      }
      observers[prop].add(currentCallback);
      return target[prop];
    }, getWithLogging),
  });
  return newObject;
};
