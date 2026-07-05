import {render, screen} from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import {describe, expect, it, vi} from 'vitest'
import {LoginPanel} from './login-panel'

describe('LoginPanel', () => {
  it('renders Apple, Google, and email sign-in controls', () => {
    render(<LoginPanel onAppleSignIn={vi.fn()} onGoogleSignIn={vi.fn()} onEmailSignIn={vi.fn()} />)

    expect(screen.getByRole('button', {name: /continue with apple/i})).toBeInTheDocument()
    expect(screen.getByRole('button', {name: /continue with google/i})).toBeInTheDocument()
    expect(screen.getByLabelText(/email/i)).toBeInTheDocument()
    expect(screen.getByLabelText(/password/i)).toBeInTheDocument()
    expect(screen.getByRole('button', {name: /sign in with email/i})).toBeInTheDocument()
  })

  it('submits trimmed email credentials', async () => {
    const user = userEvent.setup()
    const onEmailSignIn = vi.fn()
    render(
      <LoginPanel onAppleSignIn={vi.fn()} onGoogleSignIn={vi.fn()} onEmailSignIn={onEmailSignIn} />,
    )

    await user.type(screen.getByLabelText(/email/i), ' coach@example.com ')
    await user.type(screen.getByLabelText(/password/i), 'password-123')
    await user.click(screen.getByRole('button', {name: /sign in with email/i}))

    expect(onEmailSignIn).toHaveBeenCalledWith({
      email: 'coach@example.com',
      password: 'password-123',
    })
  })
})
