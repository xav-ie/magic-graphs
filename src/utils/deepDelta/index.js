/**
 * recursively compare two objects and return the delta
 */

const isObj = (obj) => Object.prototype.toString.call(obj) === '[object Object]'

export const delta = (obj1, obj2) => {

  const res = {};

  const obj1Keys = Object.keys(obj1);

  for (const key of obj1Keys) {

    if (isObj(obj1[key])) {
      const subObj = delta(obj1[key], obj2[key]);
      if (subObj) res[key] = subObj;
      continue;
    }

    if (Array.isArray(obj1[key])) {
      if (JSON.stringify(obj1[key]) !== JSON.stringify(obj2[key])) res[key] = obj2[key];
      continue;
    }

    else if (obj1[key] !== obj2[key]) res[key] = obj2[key];

  }

  return Object.keys(res).length ? res : null;
};


/**
 * jesse style tests for deep object delta
 */

const yona = {
  name: 'yona',
  sex: 'm',
  residence: 'amherst',
  school: {
    name: 'umass',
    year: 'senior',
    info: {
      major: ['cs'],
      minor: [],
      start: '2023',
    }
  },
  test: {
    hello: 'world',
    test2: {
      test3:
      'secret'
    }
  },
};

const dila = {
  name: 'dila',
  sex: 'f',
  residence: 'amherst',
  school: {
    name: 'umass',
    year: 'junior',
    info: {
      major: ['cs', 'japanese'],
      minor: [],
      start: '2022',
    }
  },
  test: {
    hello: 'world',
    test2: {
      test3: 'secret changed'
    }
  },
};

const expected = {
  name: 'dila',
  sex: 'f',
  school: {
    year: 'junior',
    info: {
      major: ['cs', 'japanese'],
      start: '2022'
    }
  },
  test: {
    test2: {
      test3: 'secret changed'
    }
  }
};

const passes = JSON.stringify(delta(yona, dila)) === JSON.stringify(expected);
console.log(passes ? 'test passed' : 'test failed');
