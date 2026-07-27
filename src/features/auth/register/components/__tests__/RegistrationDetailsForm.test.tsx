import { fireEvent, render, waitFor } from '@testing-library/react-native'
import { router } from 'expo-router'
import React from 'react'

import RegistrationDetailsForm from '../RegistrationDetailsForm'

/**
 * Component / integration tests for RegistrationDetailsForm.
 * See src/features/auth/register/__tests__/README.md for the documented matrix.
 */

// ── Clerk mock (mutable so tests can flip isLoaded / behaviours) ──────────────
const mockCreate = jest.fn()
const mockPrepare = jest.fn()
const mockAttempt = jest.fn()
const mockSetActive = jest.fn()
let mockIsLoaded = true

jest.mock('@clerk/clerk-expo', () => ({
  useSignUp: () => ({
    isLoaded: mockIsLoaded,
    signUp: {
      create: mockCreate,
      prepareEmailAddressVerification: mockPrepare,
      attemptEmailAddressVerification: mockAttempt,
    },
    setActive: mockSetActive,
  }),
  useClerk: () => ({ user: null }),
  // getClerkErrorMessage falls back to err.message for plain Errors.
  isClerkAPIResponseError: () => false,
}))

jest.mock('expo-image-picker', () => ({
  requestMediaLibraryPermissionsAsync: jest.fn().mockResolvedValue({ status: 'granted' }),
  launchImageLibraryAsync: jest.fn().mockResolvedValue({ canceled: true, assets: [] }),
}))

// Checkbox → a pressable stub keyed by its aria-labelledby, toggling on press.
jest.mock('@/components/ui/checkbox', () => {
  const React = require('react')
  const { Pressable, Text } = require('react-native')
  return {
    Checkbox: ({ checked, onCheckedChange, ...props }: any) =>
      React.createElement(
        Pressable,
        { testID: props['aria-labelledby'], onPress: () => onCheckedChange(!checked) },
        React.createElement(Text, null, checked ? 'checked' : 'unchecked')
      ),
  }
})

/** Fills every field with valid values and ticks both agreements. */
function fillValidForm(screen: ReturnType<typeof render>) {
  fireEvent.changeText(screen.getByPlaceholderText('John'), 'Ayan')
  fireEvent.changeText(screen.getByPlaceholderText('Doe'), 'Saha')
  fireEvent.changeText(screen.getByPlaceholderText('johndoe123'), 'ayan_01')
  fireEvent.changeText(screen.getByPlaceholderText('john@example.com'), 'ayan@example.com')
  fireEvent.changeText(screen.getByPlaceholderText('At least 8 characters'), 'supersecret')
  fireEvent.changeText(screen.getByPlaceholderText('1234567890'), '1234567890')
  fireEvent.press(screen.getByTestId('terms-label'))
  fireEvent.press(screen.getByTestId('privacy-label'))
}

beforeEach(() => {
  jest.clearAllMocks()
  mockIsLoaded = true
  mockCreate.mockResolvedValue({})
  mockPrepare.mockResolvedValue({})
})

describe('RegistrationDetailsForm — rendering', () => {
  it('renders all input fields and the submit button', () => {
    const screen = render(<RegistrationDetailsForm />)
    expect(screen.getByPlaceholderText('John')).toBeTruthy()
    expect(screen.getByPlaceholderText('Doe')).toBeTruthy()
    expect(screen.getByPlaceholderText('johndoe123')).toBeTruthy()
    expect(screen.getByPlaceholderText('john@example.com')).toBeTruthy()
    expect(screen.getByPlaceholderText('At least 8 characters')).toBeTruthy()
    expect(screen.getByPlaceholderText('1234567890')).toBeTruthy()
    expect(screen.getByText('Submit')).toBeTruthy()
  })

  it('masks the password field by default', () => {
    const screen = render(<RegistrationDetailsForm />)
    expect(screen.getByPlaceholderText('At least 8 characters').props.secureTextEntry).toBe(true)
  })
})

describe('RegistrationDetailsForm — validation', () => {
  it('shows field errors and does not call Clerk on an empty submit', async () => {
    const screen = render(<RegistrationDetailsForm />)
    fireEvent.press(screen.getByText('Submit'))

    expect(await screen.findByText('First name must be at least 2 characters')).toBeTruthy()
    expect(screen.getByText('You must accept the Terms and Conditions')).toBeTruthy()
    expect(screen.getByText('You must accept the Privacy Policy')).toBeTruthy()
    expect(mockCreate).not.toHaveBeenCalled()
  })

  it('blocks submit when agreements are unchecked', async () => {
    const screen = render(<RegistrationDetailsForm />)
    fireEvent.changeText(screen.getByPlaceholderText('John'), 'Ayan')
    fireEvent.changeText(screen.getByPlaceholderText('Doe'), 'Saha')
    fireEvent.changeText(screen.getByPlaceholderText('johndoe123'), 'ayan_01')
    fireEvent.changeText(screen.getByPlaceholderText('john@example.com'), 'ayan@example.com')
    fireEvent.changeText(screen.getByPlaceholderText('At least 8 characters'), 'supersecret')
    fireEvent.changeText(screen.getByPlaceholderText('1234567890'), '1234567890')
    // agreements intentionally left unchecked
    fireEvent.press(screen.getByText('Submit'))

    expect(await screen.findByText('You must accept the Terms and Conditions')).toBeTruthy()
    expect(mockCreate).not.toHaveBeenCalled()
  })
})

describe('RegistrationDetailsForm — sign-up submission', () => {
  it('calls signUp.create with the mapped payload and advances to the verify step', async () => {
    const screen = render(<RegistrationDetailsForm />)
    fillValidForm(screen)
    fireEvent.press(screen.getByText('Submit'))

    await waitFor(() => expect(mockCreate).toHaveBeenCalledTimes(1))
    expect(mockCreate).toHaveBeenCalledWith(
      expect.objectContaining({
        emailAddress: 'ayan@example.com',
        password: 'supersecret',
        unsafeMetadata: expect.objectContaining({
          username: 'ayan_01',
          firstName: 'Ayan',
          lastName: 'Saha',
          phoneNumber: '+11234567890',
          acceptedTermsAndConditions: true,
          acceptedPrivacyPolicy: true,
        }),
      })
    )
    expect(mockPrepare).toHaveBeenCalledWith({ strategy: 'email_code' })
    expect(await screen.findByText('Verify your email')).toBeTruthy()
  })

  it('surfaces a Clerk error and stays on the form', async () => {
    mockCreate.mockRejectedValueOnce(new Error('That email address is taken.'))
    const screen = render(<RegistrationDetailsForm />)
    fillValidForm(screen)
    fireEvent.press(screen.getByText('Submit'))

    expect(await screen.findByText('That email address is taken.')).toBeTruthy()
    expect(screen.getByText('Submit')).toBeTruthy() // still on the form step
  })

  it('does nothing when Clerk is not loaded yet', async () => {
    mockIsLoaded = false
    const screen = render(<RegistrationDetailsForm />)
    fillValidForm(screen)
    fireEvent.press(screen.getByText('Submit'))

    await waitFor(() => expect(screen.getByText('Submit')).toBeTruthy())
    expect(mockCreate).not.toHaveBeenCalled()
  })
})

describe('RegistrationDetailsForm — email verification', () => {
  async function reachVerifyStep() {
    const screen = render(<RegistrationDetailsForm />)
    fillValidForm(screen)
    fireEvent.press(screen.getByText('Submit'))
    await screen.findByText('Verify your email')
    return screen
  }

  it('rejects an OTP shorter than 6 digits', async () => {
    const screen = await reachVerifyStep()
    fireEvent.changeText(screen.getByPlaceholderText('000000'), '123')
    fireEvent.press(screen.getByText('Verify & Create Account'))

    expect(await screen.findByText('Enter the 6-digit code from your email.')).toBeTruthy()
    expect(mockAttempt).not.toHaveBeenCalled()
  })

  it('verifies a 6-digit code, activates the session and routes to profile', async () => {
    mockAttempt.mockResolvedValueOnce({ status: 'complete', createdSessionId: 'sess_123' })
    const screen = await reachVerifyStep()
    fireEvent.changeText(screen.getByPlaceholderText('000000'), '123456')
    fireEvent.press(screen.getByText('Verify & Create Account'))

    await waitFor(() => expect(mockAttempt).toHaveBeenCalledWith({ code: '123456' }))
    expect(mockSetActive).toHaveBeenCalledWith({ session: 'sess_123' })
    expect(router.replace).toHaveBeenCalledWith('/(tabs)/profile')
  })

  it('shows a message when verification is incomplete', async () => {
    mockAttempt.mockResolvedValueOnce({ status: 'missing_requirements' })
    const screen = await reachVerifyStep()
    fireEvent.changeText(screen.getByPlaceholderText('000000'), '000000')
    fireEvent.press(screen.getByText('Verify & Create Account'))

    expect(await screen.findByText('Verification is incomplete. Please try again.')).toBeTruthy()
    expect(mockSetActive).not.toHaveBeenCalled()
    expect(router.replace).not.toHaveBeenCalled()
  })

  it('can resend the verification code', async () => {
    const screen = await reachVerifyStep()
    mockPrepare.mockClear()
    fireEvent.press(screen.getByText('Resend code'))

    await waitFor(() =>
      expect(mockPrepare).toHaveBeenCalledWith({ strategy: 'email_code' })
    )
  })
})
