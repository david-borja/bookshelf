import {useQuery, useMutation, queryCache} from 'react-query'
import { client } from './api-client'
import { setQueryDataForBook } from './books.exercise'

function useListItems(user) {
  const { data: listItems } = useQuery({
    queryKey: 'list-items',
    queryFn: () => client('list-items', { token: user.token }).then(data => data.listItems),
    config: {
      onSuccess(listItems) {
        for (const listItem of listItems) {
          setQueryDataForBook(listItem.book)
        }
      }
    }
  })
  return listItems ?? []
}

function useListItem(user, bookId) {
  const listItems = useListItems(user)
  return listItems.find(li => li.bookId === bookId) ?? null
}

const defaultMutationOptions = {
  onError(err, variables, recover) {
    if (typeof recover === 'function') {
      recover()
    }
  },
  onSettled: () => queryCache.invalidateQueries('list-items'),
  // throwOnError: true,
}

function useUpdateListItem(user, options) {
  return useMutation(
    (updates) => client(`list-items/${updates.id}`, { method: 'PUT', data: updates, token: user.token }),
    {
      ...defaultMutationOptions,
      ...options,
      onMutate(newItem) {
        const previousItems = queryCache.getQueryData('list-items')
        queryCache.setQueryData('list-items', old => {
          return old.map(item => {
            return item.id === newItem.id ? {...item, ...newItem} : item
          })
        })
        // this function becomes the recover function
        return () => queryCache.setQueryData('list-items', previousItems)
      },
      // onError(err, variables, recover) {
      //   recover()
      // },
      ...defaultMutationOptions,
      ...options
    }
  )
}

function useRemoveListItem(user, options) {
  return useMutation(
    ({ id }) => client(`list-items/${id}`, { method: 'DELETE', token: user.token }),
        {
          onMutate(removedItem) {
            const previousItems = queryCache.getQueryData('list-items')
            queryCache.setQueryData('list-items', old => {
              return old.filter(item => item.id !== removedItem.id)
            })
            // this function becomes the recover function
            return () => queryCache.setQueryData('list-items', previousItems)
          },
          ...defaultMutationOptions,
          ...options
        }
  )
}

function useCreateListItem(user, options) {
  return useMutation(
    ({ bookId }) => client('list-items', { data: { bookId }, token: user.token }),
        { ...defaultMutationOptions, ...options }
  )
}



export {
  useListItem,
  useListItems,
  useUpdateListItem,
  useRemoveListItem,
  useCreateListItem,
}