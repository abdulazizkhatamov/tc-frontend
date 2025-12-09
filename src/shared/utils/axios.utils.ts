// utils/handleAxiosError.ts
import type { AxiosError } from 'axios'

/**
 * Extracts a human-readable error message from an Axios error object.
 * Handles both string and string[] message formats.
 */
export const getAxiosErrorMessage = (error: unknown): string => {
  if (isAxiosErrorWithMessage(error)) {
    const msg = error.response?.data.message

    if (Array.isArray(msg)) {
      // Return each message on a new line
      return msg.join('\n')
    }

    if (typeof msg === 'string') {
      return msg
    }

    return 'An unknown error occurred'
  }

  if (error instanceof Error) {
    return error.message
  }

  return 'Something went wrong'
}

/**
 * Type guard to check if error is an AxiosError with a message
 */
const isAxiosErrorWithMessage = (
  error: unknown,
): error is AxiosError<{ message: string | Array<string> }> => {
  return (
    typeof error === 'object' &&
    error !== null &&
    'isAxiosError' in error &&
    (error as AxiosError).isAxiosError === true
  )
}
