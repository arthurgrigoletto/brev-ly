export class UniqueEntityError extends Error {
  constructor(entity = 'Entity') {
    super(`${entity} already exists`)
  }
}
