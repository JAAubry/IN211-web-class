import { EntitySchema } from 'typeorm'

export default new EntitySchema({
  name: 'Movie',
  tableName: 'movie',
  columns: {
    id: {
      type: Number,
      primary: true,
      generated: true,
    },
    title: {
      type: String,
    },
    poster: {
      type: String,
      nullable: true,
    },
  },
  relations: {
    favouritedBy: {
      type: 'many-to-many',
      target: 'User',
      inverseSide: 'favourites',
    },
  },
})
