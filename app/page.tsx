'use client'

import { useState } from 'react'
import Link from 'next/link'
import { FileText, FileSpreadsheet, FileImage, ArrowRight, Check } from 'lucide-react'

export default function HomePage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50">
      {/* Header */}
      <header className="border-b bg-white/80 backdrop-blur-sm sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4 flex justify-between items-center">
          <div className="flex items-center space-x-2">
            <FileText className="w-8 h-8 text-primary-600" />
            <span className="text-2xl font-bold text-gray-900">DocSaaS</span>
          </div>
          <nav className="hidden md:flex space-x-6">
            <a href="#features" className="text-gray-600 hover:text-gray-900">Features</a>
            <a href="#pricing" className="text-gray-600 hover:text-gray-900">Pricing</a>
            <a href="#tools" className="text-gray-600 hover:text-gray-900">Tools</a>
          </nav>
          <div className="flex space-x-4">
            <Link href="/login" className="px-4 py-2 text-gray-700 hover:text-gray-900">
              Login
            </Link>
            <Link href="/signup" className="px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700">
              Sign Up
            </Link>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="container mx-auto px-4 py-20 text-center">
        <h1 className="text-5xl md:text-6xl font-bold text-gray-900 mb-6">
          All Your Document Tools
          <span className="block text-primary-600">In One Place</span>
        </h1>
        <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
          Process PDF, Excel, Word documents and more. Merge, split, convert, compress - all in your browser.
        </p>
        <div className="flex justify-center space-x-4">
          <Link href="/signup" className="px-8 py-4 bg-primary-600 text-white rounded-lg hover:bg-primary-700 flex items-center space-x-2">
            <span>Get Started Free</span>
            <ArrowRight className="w-5 h-5" />
          </Link>
          <Link href="/dashboard" className="px-8 py-4 border-2 border-primary-600 text-primary-600 rounded-lg hover:bg-primary-50">
            Try Demo
          </Link>
        </div>
      </section>

      {/* Features Grid */}
      <section id="tools" className="container mx-auto px-4 py-20">
        <h2 className="text-4xl font-bold text-center mb-12">Document Processing Tools</h2>
        <div className="grid md:grid-cols-3 gap-8">
          {tools.map((tool) => (
            <div key={tool.title} className="bg-white p-6 rounded-xl shadow-sm hover:shadow-md transition-shadow border">
              <div className="w-12 h-12 bg-primary-100 rounded-lg flex items-center justify-center mb-4">
                <tool.icon className="w-6 h-6 text-primary-600" />
              </div>
              <h3 className="text-xl font-semibold mb-2">{tool.title}</h3>
              <p className="text-gray-600 mb-4">{tool.description}</p>
              <ul className="space-y-2">
                {tool.features.map((feature) => (
                  <li key={feature} className="flex items-center text-sm text-gray-600">
                    <Check className="w-4 h-4 text-green-500 mr-2" />
                    {feature}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </section>

      {/* Pricing */}
      <section id="pricing" className="container mx-auto px-4 py-20 bg-gray-50">
        <h2 className="text-4xl font-bold text-center mb-12">Simple, Transparent Pricing</h2>
        <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
          {plans.map((plan) => (
            <div key={plan.name} className={`bg-white rounded-xl p-8 ${plan.featured ? 'ring-2 ring-primary-600 shadow-lg' : 'border'}`}>
              {plan.featured && (
                <span className="bg-primary-600 text-white px-3 py-1 rounded-full text-sm">Most Popular</span>
              )}
              <h3 className="text-2xl font-bold mt-4">{plan.name}</h3>
              <div className="mt-4 mb-6">
                <span className="text-4xl font-bold">${plan.price}</span>
                <span className="text-gray-600">/month</span>
              </div>
              <ul className="space-y-3 mb-8">
                {plan.features.map((feature) => (
                  <li key={feature} className="flex items-center">
                    <Check className="w-5 h-5 text-green-500 mr-2" />
                    <span className="text-gray-700">{feature}</span>
                  </li>
                ))}
              </ul>
              <Link
                href="/signup"
                className={`block w-full py-3 rounded-lg text-center ${plan.featured ? 'bg-primary-600 text-white hover:bg-primary-700' : 'border-2 border-primary-600 text-primary-600 hover:bg-primary-50'}`}
              >
                Get Started
              </Link>
            </div>
          ))}
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-gray-300 py-12">
        <div className="container mx-auto px-4 text-center">
          <p>&copy; 2024 DocSaaS. All rights reserved.</p>
        </div>
      </footer>
    </div>
  )
}

const tools = [
  {
    title: 'PDF Tools',
    icon: FileText,
    description: 'Complete PDF manipulation suite',
    features: ['Merge & Split', 'Compress', 'Edit & Sign', 'Protect with Password'],
  },
  {
    title: 'Excel Tools',
    icon: FileSpreadsheet,
    description: 'Excel and spreadsheet processing',
    features: ['Merge Workbooks', 'Split Sheets', 'CSV Conversion', 'Clean Data'],
  },
  {
    title: 'Converters',
    icon: FileImage,
    description: 'Convert between formats',
    features: ['PDF to Word', 'Excel to PDF', 'Image to PDF', 'Word to PDF'],
  },
]

const plans = [
  {
    name: 'Free',
    price: 0,
    features: ['10 jobs/day', '10MB file size', 'Basic tools', 'Email support'],
    featured: false,
  },
  {
    name: 'Pro',
    price: 19,
    features: ['100 jobs/day', '100MB file size', 'All tools', 'Priority support', 'Batch processing'],
    featured: true,
  },
  {
    name: 'Enterprise',
    price: 99,
    features: ['1000 jobs/day', '1GB file size', 'API access', 'Dedicated support', 'Custom branding'],
    featured: false,
  },
]
