/** @jsx jsx */
import {jsx} from '@emotion/core'

import './bootstrap'
import Tooltip from '@reach/tooltip'
import {FaSearch, FaTimes} from 'react-icons/fa'
import {Input, BookListUL, Spinner} from './components/lib'
import {BookRow} from './components/book-row'
import React from 'react'
import { client } from 'utils/api-client.exercise'
import * as colors from './styles/colors'
import { useAsync } from 'utils/hooks'
// 🐨 import the client from './utils/api-client'

function DiscoverBooksScreen() {
  const {data, error, run, isLoading, isError, isSuccess} = useAsync()
  const [status, setStatus] = React.useState('idle')
  const [query, setQuery] = React.useState('')
  const [queried, setQueried] = React.useState(false)
  // const [data, setData] = React.useState(null)
  // const [error, setError] = React.useState(null)
  // 🐨 add state for status ('idle', 'loading', or 'success'), data, and query
  // 💣 remove this, it's just here so the example doesn't explode
  // 🐨 you'll also notice that we don't want to run the search until the
  // user has submitted the form, so you'll need a boolean for that as well
  // 💰 I called it "queried"

  // 🐨 Add a useEffect callback here for making the request with the
  // client and updating the status and data.
  // 💰 Here's the endpoint you'll call: `books?query=${encodeURIComponent(query)}`
  // 🐨 remember, effect callbacks are called on the initial render too
  // so you'll want to check if the user has submitted the form yet and if
  // they haven't then return early (💰 this is what the queried state is for).

  console.log(query)

  // 🐨 replace these with derived state values based on the status.
  // const isLoading = status === 'loading'
  // const isSuccess = status === 'success'
  // const isError = status === 'error'

  React.useEffect(() => {
    if (!queried) {
      return
    }
    setStatus('loading')
    run(client(`books?query=${encodeURIComponent(query)}`))
    // .then(responseData => {
    //   setData(responseData)
    //   setStatus('success')
    // }, errorData => {
    //   setError(errorData)
    //   setStatus('error')
    // })
  }, [queried, query, run])

  function handleSearchSubmit(event) {
    // 🐨 call preventDefault on the event so you don't get a full page reload
    // 🐨 set the queried state to true
    // 🐨 set the query value which you can get from event.target.elements
    // 💰 console.log(event.target.elements) if you're not sure.
    event.preventDefault()
    setQuery(event.target.elements.search.value)
    setQueried(true)
  }

  return (
    <div
      css={{maxWidth: 800, margin: 'auto', width: '90vw', padding: '40px 0'}}
    >
      <form onSubmit={handleSearchSubmit}>
        <Input
          placeholder="Search books..."
          id="search"
          css={{width: '100%'}}
        />
        <Tooltip label="Search Books">
          <label htmlFor="search">
            <button
              type="submit"
              css={{
                border: '0',
                position: 'relative',
                marginLeft: '-35px',
                background: 'transparent',
              }}
            >
              {isLoading ? <Spinner /> : (isError ? <FaTimes aria-label="error" css={{color: colors.danger}}/> : <FaSearch aria-label="search" />)}
            </button>
          </label>
        </Tooltip>
      </form>

      {isError ? (
        <div css={{ color: colors.danger }}>
          <p>There was an error</p>
          <pre>{error.message}</pre>
        </div>
      ) : null}

      {isSuccess ? (
        data?.books?.length ? (
          <BookListUL css={{marginTop: 20}}>
            {data.books.map(book => (
              <li key={book.id} aria-label={book.title}>
                <BookRow key={book.id} book={book} />
              </li>
            ))}
          </BookListUL>
        ) : (
          <p>No books found. Try another search.</p>
        )
      ) : null}
    </div>
  )
}

export {DiscoverBooksScreen}
