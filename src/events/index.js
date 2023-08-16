export const predicate = (structure) =>
  Boolean(structure) && typeof structure === 'object' && 'name' in structure && 'execute' in structure && typeof structure.name === 'string' && typeof structure.execute === 'function'
