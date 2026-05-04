import { render, screen } from '@testing-library/react'
import { expect, it, vi, beforeAll, afterAll, afterEach } from 'vitest'
import userEvent from '@testing-library/user-event'
import { http, HttpResponse } from 'msw'
import { setupServer } from 'msw/node'

import Home from './Home'

// --------------------
// MSW SERVER SETUP
// --------------------
const server = setupServer(
  http.get('/', () => {
    return HttpResponse.json({})
  })
)

// lifecycle (clean way)
beforeAll(() => server.listen())
afterEach(() => server.resetHandlers())
afterAll(() => server.close())

// --------------------
// MOCK HOOK
// --------------------
vi.mock('../../hooks/useFetchMovies', () => ({
  useFetchMovies: () => ({
    movies: ['Inception', 'Harry Potter'],
  }),
}))

// --------------------
// TESTS
// --------------------

it('displays Home', () => {
  render(<Home />)
  expect(screen.getByText('Popular Movies')).toBeInTheDocument()
})

it('displays all popular movies when the search bar is empty', () => {
  render(<Home />)

  expect(screen.getByText('Inception')).toBeInTheDocument()
  expect(screen.getByText('Harry Potter')).toBeInTheDocument()
})

it('displays a message when the search does not match any movie', async () => {
  const user = userEvent.setup()

  render(<Home />)

  const searchInput = screen.getByPlaceholderText('Effectuez votre recherche')
  await user.type(searchInput, 'xyz')

  expect(
    screen.getByText('Aucun film populaire de correspond à votre recherche')
  ).toBeInTheDocument()
})

it('displays matching movies when the user types in a search', async () => {
  const user = userEvent.setup()

  render(<Home />)

  const searchInput = screen.getByPlaceholderText('Effectuez votre recherche')
  await user.type(searchInput, 'H')

  expect(screen.queryByText('Inception')).not.toBeInTheDocument()
  expect(screen.getByText('Harry Potter')).toBeInTheDocument()
})

it('displays the Login form', () => {
  render(<Home />)

  expect(screen.getByText('Login')).toBeInTheDocument()
})

it('requires all fields to be filled to send login form', async () => {
  const user = userEvent.setup()

  render(<Home />)

  await user.click(screen.getByText('Login'))

  expect(
    screen.getByText('Entrez vos informations de connection')
  ).toBeInTheDocument()
})

it('requires email field to send login form', async () => {
  const user = userEvent.setup()

  render(<Home />)

  await user.type(screen.getByPlaceholderText('Mot de passe'), 'testMDP')
  await user.click(screen.getByText('Login'))

  expect(
    screen.getByText('Entrez vos informations de connection')
  ).toBeInTheDocument()
})

it('requires password field to send login form', async () => {
  const user = userEvent.setup()

  render(<Home />)

  await user.type(screen.getByPlaceholderText('E-mail'), 'test@email')
  await user.click(screen.getByText('Login'))

  expect(
    screen.getByText('Entrez vos informations de connection')
  ).toBeInTheDocument()
})

it('displays Utilisateur ou Mot de passe invalide when login returns 401', async () => {
  const user = userEvent.setup()

  server.use(
    http.post('/login', () => {
      return new HttpResponse(null, { status: 401 })
    })
  )

  render(<Home />)

  await user.type(screen.getByPlaceholderText('E-mail'), 'test@email')
  await user.type(screen.getByPlaceholderText('Mot de passe'), 'testMDP')
  await user.click(screen.getByText('Login'))

  expect(
    await screen.findByText('Utilisateur ou Mot de passe invalide')
  ).toBeInTheDocument()
})

it('displays Erreur serveur when login returns 500', async () => {
  const user = userEvent.setup()

  server.use(
    http.post('/login', () => {
      return new HttpResponse(null, { status: 500 })
    })
  )

  render(<Home />)

  await user.type(screen.getByPlaceholderText('E-mail'), 'test@email')
  await user.type(screen.getByPlaceholderText('Mot de passe'), 'testMDP')
  await user.click(screen.getByText('Login'))

  expect(await screen.findByText('Erreur serveur')).toBeInTheDocument()
})

it('displays Connexion réussie when login returns 200', async () => {
  const user = userEvent.setup()

  server.use(
    http.post('/login', () => {
      return HttpResponse.json({ token: 'fake-token' }, { status: 200 })
    })
  )

  render(<Home />)

  await user.type(screen.getByPlaceholderText('E-mail'), 'test@email')
  await user.type(screen.getByPlaceholderText('Mot de passe'), 'testMDP')
  await user.click(screen.getByText('Login'))

  expect(await screen.findByText('Connexion réussie')).toBeInTheDocument()
})

it('stores the cookie when login returns 200', async () => {
  const user = userEvent.setup()

  server.use(
    http.post('/login', () => {
      return HttpResponse.json(
        { token: 'fake-token' },
        {
          status: 200,
          headers: {
            'Set-Cookie': 'authToken=fake-token; Path=/',
          },
        }
      )
    })
  )

  render(<Home />)

  await user.type(screen.getByPlaceholderText('E-mail'), 'test@email')
  await user.type(screen.getByPlaceholderText('Mot de passe'), 'testMDP')
  await user.click(screen.getByText('Login'))

  expect(document.cookie).toContain('authToken=fake-token')
})