import { EntitySchema } from 'typeorm'

export default new EntitySchema({
  name: 'User',
  tableName: 'user',
  columns: {
    id: {
      type: Number,
      primary: true,
      generated: true,
    },
    email: {
      type: String,
    },
    password: {
      type: String,
    },
  },
  relations: {
    favourites: {
      type: 'many-to-many',
      target: 'Movie',
      inverseSide: 'favouritedBy',
      joinTable: true,
      cascade: true,
    },
    notes: {
      type: 'one-to-many',
      target: 'Note',
      inverseSide: 'user',
    },
  },
})
