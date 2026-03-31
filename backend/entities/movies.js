import typeorm from 'typeorm'

const Movie = new typeorm.EntitySchema({
  name: 'Movie',
  columns: {
    id: {
      primary: true,
      generated: 'uuid',
      type: String,
    },
    title: { type: String },
    date: { type: String }
  },
});

export default Movie;