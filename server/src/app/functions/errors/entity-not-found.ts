export class EntityNotFound extends Error {
  constructor(entity = 'Entity') {
    super(`${entity} not found`)
  }
}
