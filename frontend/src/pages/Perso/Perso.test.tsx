import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { expect, it, vi } from 'vitest'
import Perso from './Perso'

// mock auth (simple)
vi.mock('../../hooks/useAuth', () => ({
  useAuth: () => ({
    isAuthenticated: true,
    user: { email: 'test@email' }
  })
}))

it('displays Perso page title when logged in', () => {
  render(<Perso />)
  expect(screen.getByText('My Space')).toBeInTheDocument()
})

it('displays favourite movies section', () => {
  render(<Perso />)
  expect(screen.getByText('My Favourites')).toBeInTheDocument()
})

it('allows adding a note to a movie', async () => {
  const user = userEvent.setup()
  render(<Perso />)

  const input = screen.getByPlaceholderText('Ajouter une note')
  await user.type(input, 'Amazing movie')
  await user.click(screen.getByText('Add Note'))

  expect(screen.getByText('Amazing movie')).toBeInTheDocument()
})

it('allows creating a playlist', async () => {
  const user = userEvent.setup()
  render(<Perso />)

  const input = screen.getByPlaceholderText('Nom de la playlist')
  await user.type(input, 'Weekend vibes')
  await user.click(screen.getByText('Create'))

  expect(screen.getByText('Weekend vibes')).toBeInTheDocument()
})

it('does not display page if not authenticated', () => {
  vi.mocked(require('../../hooks/useAuth').useAuth).mockReturnValue({
    isAuthenticated: false,
    user: null
  })

  render(<Perso />)

  expect(screen.getByText('Accès refusé')).toBeInTheDocument()
})