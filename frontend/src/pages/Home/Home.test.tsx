import { render, screen } from '@testing-library/react'
import { expect, it, vi } from 'vitest'
import {userEvent} from '@testing-library/user-event'

import Home from './Home'

vi.mock('../../hooks/useFetchMovies', () => ({
  useFetchMovies: () => ({
    movies: ['Inception','Harry Potter']
  }),
}))

it('displays Home', () => {
  render(<Home />)
  expect(screen.getByText('Popular Movies')).toBeInTheDocument()
})

it('displays all popular movies when the search bar is empty', async () => {
  //arrange
  const user = userEvent.setup()
  //act
  render(<Home />)
  //assert
  expect(screen.queryByText('Inception')).toBeInTheDocument()
  expect(screen.queryByText('Harry Potter')).toBeInTheDocument()
})

it('displays a message when the search does not match any movie', async () => {
  //arrange
  const user = userEvent.setup()
  //act
  render(<Home />)
  const searchInput = screen.getByPlaceholderText('Effectuez votre recherche')
  await user.type(searchInput,'xyz')
  //assert
  expect(screen.queryByText('Aucun film populaire de correspond à votre recherche')).toBeInTheDocument()
})

it('displays matching movies when tyhe user types in a search', async () => {
   //arrange
  const user = userEvent.setup()
  //act
  render(<Home />)
  const searchInput = screen.getByPlaceholderText('Effectuez votre recherche')
  await user.type(searchInput,'H')
  // assert
  expect(screen.queryByText("Inception")).not.toBeInTheDocument()
  expect(screen.queryByText("Harry Potter")).toBeInTheDocument()
})
