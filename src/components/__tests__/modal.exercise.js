// 🐨 you're gonna need this stuff:
// import {Modal, ModalContents, ModalOpenButton} from '../modal'
import React from 'react'
import userEvent from '@testing-library/user-event'
// const userEvent = require('@testing-library/user-event')
const { render, screen, within } = require('@testing-library/react')
const { Modal, ModalOpenButton, ModalContents } = require('../modal')

test('can be opened and closed', async () => {
  const label = 'Modal Label'
  const title = 'Modal Title'
  const content = 'Modal content'

  render(
    <Modal>
      <ModalOpenButton>
        <button>Open</button>
      </ModalOpenButton>
      <ModalContents aria-label={label} title={title}>
        <div>{content}</div>
      </ModalContents>
    </Modal>
  )
  await userEvent.click(screen.getByRole('button', {name: /open/i}))
  const modal = screen.getByRole('dialog')
  expect(modal).toHaveAttribute('aria-label', label)
  const inModal = within(modal)
  expect(inModal.getByRole('heading', {name: title})).toBeInTheDocument()
  expect(inModal.getByText(content)).toBeInTheDocument()

  await userEvent.click(inModal.getByRole('button', {name: /close/i}))
  expect(screen.queryByRole('dialog')).not.toBeInTheDocument()
})
// 🐨 render the Modal, ModalOpenButton, and ModalContents
// 🐨 click the open button
// 🐨 verify the modal contains the modal contents, title, and label
// 🐨 click the close button
// 🐨 verify the modal is no longer rendered
// 💰 (use `query*` rather than `get*` or `find*` queries to verify it is not rendered)
// 💰 Remember all userEvent utils are async, so you need to await them.
