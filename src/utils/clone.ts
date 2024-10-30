
// deeply clone the object while keeping all the references in place
export const clone = (obj: Record<any, any>) => {
  const cloned = { ...obj }
  for (const key in cloned) {
    if (typeof cloned[key] === 'object') {
      cloned[key] = clone(cloned[key])
    }
  }
  return cloned
}