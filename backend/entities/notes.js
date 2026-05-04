import { EntitySchema } from 'typeorm'

export default new EntitySchema({
  name: 'Note',
  tableName: 'note',
  columns: {
    id: {
      type: Number,
      primary: true,
      generated: true,
    },
    content: {
      type: String,
    },
  },
  relations: {
    user: {
      type: 'many-to-one',
      target: 'User',
      inverseSide: 'notes',
      onDelete: 'CASCADE',
    },
    movie: {
      type: 'many-to-one',
      target: 'Movie',
      eager: false,
      onDelete: 'CASCADE',
    },
  },
})
