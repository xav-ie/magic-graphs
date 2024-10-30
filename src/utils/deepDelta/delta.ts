/**
 * recursively compare two objects and return the delta
 */

const isObj = (obj: any) => Object.prototype.toString.call(obj) === '[object Object]'

/**
 * gets the delta between two objects
 *
 * @param oldObject
 * @param newObject
 * @returns an object with the keys from oldObject that have changed values in newObject
 * set to the new value
 */
export const delta = (oldObject: Record<any, any>, newObject: Record<any, any>) => {

  const output: Record<any, any> = {};

  const oldObjectKeys = Object.keys(oldObject);

  for (const key of oldObjectKeys) {

    if (isObj(oldObject[key])) {
      const diffObj = delta(oldObject[key], newObject[key]);
      if (diffObj) output[key] = diffObj;
      continue;
    }

    if (Array.isArray(oldObject[key])) {
      if (JSON.stringify(oldObject[key]) !== JSON.stringify(newObject[key])) output[key] = newObject[key];
      continue;
    }

    else if (oldObject[key] !== newObject[key]) output[key] = newObject[key];

  }

  return Object.keys(output).length ? output : null;
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
    removeMe: {
      removeMe: 'removeMe',
      removeMe2: {}
    },
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
    removeMe: {
      removeMe: 'removeMe',
      removeMe2: {}
    },
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