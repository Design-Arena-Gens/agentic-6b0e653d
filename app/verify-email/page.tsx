import Link from 'next/link'
import { FileText } from 'lucide-react'

export default function VerifyEmailPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50 flex items-center justify-center px-4">
      <div className="max-w-md w-full text-center">
        <Link href="/" className="inline-flex items-center space-x-2 mb-6">
          <FileText className="w-10 h-10 text-primary-600" />
          <span className="text-3xl font-bold text-gray-900">DocSaaS</span>
        </Link>

        <div className="bg-white rounded-xl shadow-sm border p-8">
          <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg
              className="w-8 h-8 text-green-600"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M5 13l4 4L19 7"
              />
            </svg>
          </div>

          <h1 className="text-2xl font-bold text-gray-900 mb-2">Check your email</h1>
          <p className="text-gray-600 mb-6">
            We've sent you a verification link. Please check your email and click the link to verify your account.
          </p>

          <div className="text-sm text-gray-500">
            Didn't receive the email?{' '}
            <button className="text-primary-600 hover:text-primary-700 font-medium">
              Resend
            </button>
          </div>

          <div className="mt-6">
            <Link
              href="/login"
              className="text-primary-600 hover:text-primary-700 font-medium"
            >
              Back to login
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}
