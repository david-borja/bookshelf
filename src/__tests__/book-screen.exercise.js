// 🐨 here are the things you're going to need for this test:
// import * as React from 'react'
// import {render, screen, waitFor} from '@testing-library/react'
// import {queryCache} from 'react-query'
// import {buildUser, buildBook} from 'test/generate'
// import * as auth from 'auth-provider'
// import {AppProviders} from 'context'
// import {App} from 'app'

import React from 'react'
import {
  render,
  screen,
  waitForLoadingToFinish,
  userEvent,
  loginAsUser,
} from 'test/app-test-utils'
import {App} from 'app'
import {buildBook, buildListItem} from 'test/generate'
import * as booksDB from 'test/data/books'
import * as listItemsDB from 'test/data/list-items'
import {formatDate} from 'utils/misc'
import faker from 'faker'
import {server, rest} from 'test/server'
// 🐨 after each test, clear the queryCache and auth.logout

// async function render(ui, {route = '/list', user, ...renderOptions} = {}) {
//   user = typeof user === 'undefined' ? await loginAsUser() : user
//   window.history.pushState({}, 'Test page', route)

//   const returnValue = {
//     ...rtlRender(ui, { wrapper: AppProviders, ...renderOptions }),
//     user
//   }
//   await waitForLoadingToFinish()
//   return returnValue
// }

// async function loginAsUser(userProperties) {
//   const user = buildUser(userProperties)
//   await usersDB.create(user)
//   const authUser = await usersDB.authenticate(user)
//   window.localStorage.setItem(auth.localStorageKey, authUser.token)
//   return authUser
// }

// const waitForLoadingToFinish = () => waitForElementToBeRemoved(() => [
//   ...screen.queryAllByLabelText(/loading/i),
//   ...screen.queryAllByText(/loading/i),
// ])

const apiURL = process.env.REACT_APP_API_URL

const fakeTimerUserEvent = userEvent.setup({
  advanceTimers: () => jest.runOnlyPendingTimers(),
})

async function renderBookScreen({user, book, listItem} = {}) {
  if (user === undefined) {
    user = await loginAsUser()
  }

  if (book === undefined) {
    book = await booksDB.create(buildBook())
  }

  if (listItem === undefined) {
    listItem = await listItemsDB.create(buildListItem({owner: user, book}))
  }

  const route = `/book/${book.id}`
  const utils = await render(<App />, {route, user})
  return {...utils, user, book, listItem}
}

test('renders all the book information', async () => {
  // const book = await booksDB.create(buildBook())
  // const route = `/book/${book.id}`
  // await render(<App />, {route})

  const {book} = await renderBookScreen({listItem: null})
  expect(screen.getByRole('heading', {name: book.title})).toBeInTheDocument()
  expect(screen.getByText(book.author)).toBeInTheDocument()
  expect(screen.getByText(book.publisher)).toBeInTheDocument()
  expect(screen.getByText(book.synopsis)).toBeInTheDocument()
  expect(screen.getByRole('img', {name: /book cover/i})).toHaveAttribute(
    'src',
    book.coverImageUrl,
  )
  expect(screen.getByRole('button', {name: /add to list/i})).toBeInTheDocument()
  expect(
    screen.queryByRole('button', {name: /remove from list/i}),
  ).not.toBeInTheDocument()
  expect(
    screen.queryByRole('button', {name: /mark as read/i}),
  ).not.toBeInTheDocument()
  expect(
    screen.queryByRole('button', {name: /mark as unread/i}),
  ).not.toBeInTheDocument()
  expect(
    screen.queryByRole('textarea', {name: /notes/i}),
  ).not.toBeInTheDocument()
  expect(screen.queryByRole('radio', {name: /star/i})).not.toBeInTheDocument()
  expect(screen.queryByLabelText(/start date/i)).not.toBeInTheDocument()
})
// 🐨 "authenticate" the client by setting the auth.localStorageKey in localStorage to some string value (can be anything for now)

// 🐨 create a user using `buildUser`
// 🐨 create a book use `buildBook`
// 🐨 update the URL to `/book/${book.id}`
//   💰 window.history.pushState({}, 'page title', route)
//   📜 https://developer.mozilla.org/en-US/docs/Web/API/History/pushState

// 🐨 reassign window.fetch to another function and handle the following requests:
// - url ends with `/bootstrap`: respond with {user, listItems: []}
// - url ends with `/list-items`: respond with {listItems: []}
// - url ends with `/books/${book.id}`: respond with {book}
// 💰 window.fetch = async (url, config) => { /* handle stuff here*/ }
// 💰 return Promise.resolve({ok: true, json: async () => ({ /* response data here */ })})

// 🐨 render the App component and set the wrapper to the AppProviders
// (that way, all the same providers we have in the app will be available in our tests)

// 🐨 use findBy to wait for the book title to appear
// 📜 https://testing-library.com/docs/dom-testing-library/api-async#findby-queries

// 🐨 assert the book's info is in the document

test('can create a list item for the book', async () => {
  // const book = await booksDB.create(buildBook())
  // const route = `/book/${book.id}`
  // await render(<App />, { route })

  await renderBookScreen({listItem: null})
  const addToListButton = screen.getByRole('button', {name: /add to list/i})
  await userEvent.click(addToListButton)

  expect(addToListButton).toBeDisabled()

  await waitForLoadingToFinish()
  // await waitForElementToBeRemoved(() => [
  //   ...screen.queryAllByLabelText(/loading/i),
  //   ...screen.queryAllByText(/loading/i),
  // ])

  expect(
    screen.getByRole('button', {name: /mark as read/i}),
  ).toBeInTheDocument()
  expect(
    screen.getByRole('button', {name: /remove from list/i}),
  ).toBeInTheDocument()
  expect(screen.getByRole('textbox', {name: /notes/i})).toBeInTheDocument()

  const startDateNode = screen.getByLabelText(/start date/i)
  expect(startDateNode).toHaveTextContent(formatDate(new Date()))

  expect(
    screen.queryByRole('button', {name: /add to list/i}),
  ).not.toBeInTheDocument()
  expect(
    screen.queryByRole('button', {name: /mark as unread/i}),
  ).not.toBeInTheDocument()
  expect(screen.queryByRole('radio', {name: /star/i})).not.toBeInTheDocument()
})

test('can remove a list item for the book', async () => {
  // const user = await loginAsUser()
  // const book = await booksDB.create(buildBook())
  // await listItemsDB.create(buildListItem({ book, owner: user }))
  // const route = `/book/${book.id}`

  await renderBookScreen()
  // await render(<App />, { route, user })

  const removeFromListButton = screen.getByRole('button', {
    name: /remove from list/i,
  })
  await userEvent.click(removeFromListButton)
  expect(removeFromListButton).toBeDisabled()

  await waitForLoadingToFinish()
  // await waitForElementToBeRemoved(() => [
  //   ...screen.queryAllByLabelText(/loading/i),
  //   ...screen.queryAllByText(/loading/i),
  // ])

  expect(screen.getByRole('button', {name: /add to list/i})).toBeInTheDocument()
  expect(
    screen.queryByRole('button', {name: /remove from list/i}),
  ).not.toBeInTheDocument()
})

test('can mark a list item as read', async () => {
  // const user = await loginAsUser()
  // const book = await booksDB.create(buildBook())
  // const listItem = await listItemsDB.create(buildListItem({ book, owner: user, finishDate: null }))
  // const route = `/book/${book.id}`

  // await render(<App />, { route, user })

  const {listItem} = await renderBookScreen()
  await listItemsDB.update(listItem.id, {finishDate: null})

  const markAsReadButton = screen.getByRole('button', {name: /mark as read/i})
  await userEvent.click(markAsReadButton)
  expect(markAsReadButton).toBeDisabled()

  await waitForLoadingToFinish()
  // await waitForElementToBeRemoved(() => [
  //   ...screen.queryAllByLabelText(/loading/i),
  //   ...screen.queryAllByText(/loading/i),
  // ])

  const startAdnFinishDateNode = screen.getByLabelText(/start and finish date/i)
  expect(startAdnFinishDateNode).toHaveTextContent(
    `${formatDate(listItem.startDate)} — ${formatDate(Date.now())}`,
  )

  expect(
    screen.getByRole('button', {name: /mark as unread/i}),
  ).toBeInTheDocument()
  expect(
    screen.queryByRole('button', {name: /mark as read/i}),
  ).not.toBeInTheDocument()
})

test('can edit a note', async () => {
  jest.useFakeTimers()
  // const user = await loginAsUser()
  // const book = await booksDB.create(buildBook())
  // const listItem = await listItemsDB.create(buildListItem({ book, owner: user }))
  // const route = `/book/${book.id}`

  // await render(<App />, { route, user })

  const {listItem} = await renderBookScreen()

  const newNotes = faker.lorem.words()
  const notesTextArea = screen.getByRole('textbox', {name: /notes/i})
  await fakeTimerUserEvent.clear(notesTextArea)
  await fakeTimerUserEvent.type(notesTextArea, newNotes)

  await screen.findByLabelText(/loading/i)
  await waitForLoadingToFinish()
  expect(notesTextArea).toHaveValue(newNotes)
  expect(await listItemsDB.read(listItem.id)).toMatchObject({
    notes: newNotes,
  })
})

describe('console errors', () => {
  // this removes the annoying error message in the test output
  beforeAll(() => {
    jest.spyOn(console, 'error').mockImplementation(() => {})
  })

  afterAll(() => {
    console.error.mockRestore()
  })

  test('shows an error message when the book fails to load', async () => {
    const book = {id: 'BAD_ID'}
    await renderBookScreen({listItem: null, book})

    expect(
      (await screen.findByRole('alert')).textContent,
    ).toMatchInlineSnapshot(`"There was an error: Book not found"`)
  })

  test('note update failures are displayed', async () => {
    jest.useFakeTimers()
    const {listItem} = await renderBookScreen()

    const newNotes = faker.lorem.words()
    const notesTextArea = screen.getByRole('textbox', {name: /notes/i})

    server.use(
      rest.put(`${apiURL}/list-items/:listItemId`, async (req, res, ctx) => {
        return res(ctx.status(400), ctx.json({status: 400, message: 'OH NO!!'}))
      }),
    )

    await fakeTimerUserEvent.clear(notesTextArea)
    await fakeTimerUserEvent.type(notesTextArea, newNotes)

    await screen.findByLabelText(/loading/i)

    await waitForLoadingToFinish()

    expect(screen.getByRole('alert').textContent).toMatchInlineSnapshot(
      `"There was an error: OH NO!!"`,
    )
    expect(await listItemsDB.read(listItem.id)).not.toMatchObject({
      notes: newNotes,
    })
  })
})
