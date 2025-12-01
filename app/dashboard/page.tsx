'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import {
  FileText, FileSpreadsheet, File, Image, Upload,
  Download, Loader, CheckCircle, XCircle, LogOut,
  BarChart, Settings, FolderOpen
} from 'lucide-react'

interface Job {
  id: string
  type: string
  status: string
  createdAt: string
  outputFiles?: string[]
}

export default function DashboardPage() {
  const router = useRouter()
  const [activeTab, setActiveTab] = useState('tools')
  const [selectedTool, setSelectedTool] = useState<string | null>(null)
  const [files, setFiles] = useState<File[]>([])
  const [jobs, setJobs] = useState<Job[]>([])
  const [uploading, setUploading] = useState(false)
  const [user, setUser] = useState<any>(null)
  const [usage, setUsage] = useState<any>(null)

  useEffect(() => {
    fetchUser()
    fetchJobs()
    fetchUsage()
  }, [])

  const fetchUser = async () => {
    try {
      const res = await fetch('/api/auth/me')
      if (res.ok) {
        const data = await res.json()
        setUser(data.user)
      } else {
        router.push('/login')
      }
    } catch (error) {
      console.error('Error fetching user:', error)
    }
  }

  const fetchJobs = async () => {
    try {
      const res = await fetch('/api/jobs')
      if (res.ok) {
        const data = await res.json()
        setJobs(data.jobs)
      }
    } catch (error) {
      console.error('Error fetching jobs:', error)
    }
  }

  const fetchUsage = async () => {
    try {
      const res = await fetch('/api/usage')
      if (res.ok) {
        const data = await res.json()
        setUsage(data.usage)
      }
    } catch (error) {
      console.error('Error fetching usage:', error)
    }
  }

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      setFiles(Array.from(e.target.files))
    }
  }

  const handleUpload = async () => {
    if (!selectedTool || files.length === 0) return

    setUploading(true)
    const formData = new FormData()
    formData.append('type', selectedTool)
    files.forEach((file) => formData.append('files', file))

    try {
      const res = await fetch('/api/jobs', {
        method: 'POST',
        body: formData,
      })

      if (res.ok) {
        setFiles([])
        setSelectedTool(null)
        fetchJobs()
      }
    } catch (error) {
      console.error('Error uploading:', error)
    } finally {
      setUploading(false)
    }
  }

  const handleLogout = async () => {
    await fetch('/api/auth/logout', { method: 'POST' })
    router.push('/')
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4 flex justify-between items-center">
          <div className="flex items-center space-x-2">
            <FileText className="w-8 h-8 text-primary-600" />
            <span className="text-2xl font-bold text-gray-900">DocSaaS</span>
          </div>
          <div className="flex items-center space-x-4">
            <div className="text-sm text-gray-600">
              {user?.email}
              <span className="ml-2 px-2 py-1 bg-primary-100 text-primary-700 rounded text-xs">
                {user?.tenant?.plan || 'FREE'}
              </span>
            </div>
            <button onClick={handleLogout} className="p-2 hover:bg-gray-100 rounded-lg">
              <LogOut className="w-5 h-5" />
            </button>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8">
        <div className="grid md:grid-cols-4 gap-6">
          {/* Sidebar */}
          <div className="md:col-span-1">
            <nav className="bg-white rounded-lg border p-4 space-y-2">
              <button
                onClick={() => setActiveTab('tools')}
                className={`w-full flex items-center space-x-2 px-4 py-2 rounded-lg ${activeTab === 'tools' ? 'bg-primary-50 text-primary-700' : 'hover:bg-gray-50'}`}
              >
                <FolderOpen className="w-5 h-5" />
                <span>Tools</span>
              </button>
              <button
                onClick={() => setActiveTab('jobs')}
                className={`w-full flex items-center space-x-2 px-4 py-2 rounded-lg ${activeTab === 'jobs' ? 'bg-primary-50 text-primary-700' : 'hover:bg-gray-50'}`}
              >
                <FileText className="w-5 h-5" />
                <span>Jobs</span>
              </button>
              <button
                onClick={() => setActiveTab('usage')}
                className={`w-full flex items-center space-x-2 px-4 py-2 rounded-lg ${activeTab === 'usage' ? 'bg-primary-50 text-primary-700' : 'hover:bg-gray-50'}`}
              >
                <BarChart className="w-5 h-5" />
                <span>Usage</span>
              </button>
              <button
                onClick={() => setActiveTab('settings')}
                className={`w-full flex items-center space-x-2 px-4 py-2 rounded-lg ${activeTab === 'settings' ? 'bg-primary-50 text-primary-700' : 'hover:bg-gray-50'}`}
              >
                <Settings className="w-5 h-5" />
                <span>Settings</span>
              </button>
            </nav>
          </div>

          {/* Main Content */}
          <div className="md:col-span-3">
            {activeTab === 'tools' && (
              <div>
                <h2 className="text-2xl font-bold mb-6">Document Processing Tools</h2>
                <div className="grid md:grid-cols-2 gap-4 mb-8">
                  {tools.map((tool) => (
                    <button
                      key={tool.id}
                      onClick={() => setSelectedTool(tool.id)}
                      className={`p-6 rounded-lg border text-left hover:shadow-md transition-shadow ${selectedTool === tool.id ? 'border-primary-500 bg-primary-50' : 'bg-white'}`}
                    >
                      <div className="flex items-start space-x-4">
                        <div className="w-10 h-10 bg-primary-100 rounded-lg flex items-center justify-center">
                          <tool.icon className="w-6 h-6 text-primary-600" />
                        </div>
                        <div>
                          <h3 className="font-semibold mb-1">{tool.name}</h3>
                          <p className="text-sm text-gray-600">{tool.description}</p>
                        </div>
                      </div>
                    </button>
                  ))}
                </div>

                {selectedTool && (
                  <div className="bg-white rounded-lg border p-6">
                    <h3 className="text-xl font-semibold mb-4">Upload Files</h3>
                    <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center">
                      <Upload className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                      <input
                        type="file"
                        multiple
                        onChange={handleFileChange}
                        className="hidden"
                        id="file-upload"
                      />
                      <label htmlFor="file-upload" className="cursor-pointer">
                        <span className="text-primary-600 hover:text-primary-700 font-medium">
                          Choose files
                        </span>
                        <span className="text-gray-600"> or drag and drop</span>
                      </label>
                      {files.length > 0 && (
                        <div className="mt-4 space-y-2">
                          {files.map((file, i) => (
                            <div key={i} className="text-sm text-gray-600">
                              {file.name} ({(file.size / 1024 / 1024).toFixed(2)} MB)
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                    <button
                      onClick={handleUpload}
                      disabled={uploading || files.length === 0}
                      className="w-full mt-4 bg-primary-600 text-white py-3 rounded-lg hover:bg-primary-700 disabled:opacity-50"
                    >
                      {uploading ? 'Processing...' : 'Process Files'}
                    </button>
                  </div>
                )}
              </div>
            )}

            {activeTab === 'jobs' && (
              <div>
                <h2 className="text-2xl font-bold mb-6">Recent Jobs</h2>
                <div className="bg-white rounded-lg border">
                  {jobs.length === 0 ? (
                    <div className="p-8 text-center text-gray-500">
                      No jobs yet. Start by processing some documents!
                    </div>
                  ) : (
                    <div className="divide-y">
                      {jobs.map((job) => (
                        <div key={job.id} className="p-4 flex items-center justify-between">
                          <div className="flex items-center space-x-4">
                            {job.status === 'COMPLETED' && <CheckCircle className="w-5 h-5 text-green-500" />}
                            {job.status === 'FAILED' && <XCircle className="w-5 h-5 text-red-500" />}
                            {job.status === 'PROCESSING' && <Loader className="w-5 h-5 text-blue-500 animate-spin" />}
                            <div>
                              <div className="font-medium">{job.type}</div>
                              <div className="text-sm text-gray-500">
                                {new Date(job.createdAt).toLocaleString()}
                              </div>
                            </div>
                          </div>
                          {job.status === 'COMPLETED' && job.outputFiles && (
                            <a
                              href={`/api/files/${job.outputFiles[0]?.split('/').pop()}`}
                              className="flex items-center space-x-2 text-primary-600 hover:text-primary-700"
                            >
                              <Download className="w-5 h-5" />
                              <span>Download</span>
                            </a>
                          )}
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            )}

            {activeTab === 'usage' && (
              <div>
                <h2 className="text-2xl font-bold mb-6">Usage Statistics</h2>
                <div className="grid md:grid-cols-3 gap-4">
                  <div className="bg-white p-6 rounded-lg border">
                    <div className="text-sm text-gray-600 mb-2">Jobs Today</div>
                    <div className="text-3xl font-bold">
                      {usage?.jobCount || 0} / {usage?.maxJobs || 10}
                    </div>
                  </div>
                  <div className="bg-white p-6 rounded-lg border">
                    <div className="text-sm text-gray-600 mb-2">Plan</div>
                    <div className="text-3xl font-bold">{user?.tenant?.plan || 'FREE'}</div>
                  </div>
                  <div className="bg-white p-6 rounded-lg border">
                    <div className="text-sm text-gray-600 mb-2">Storage</div>
                    <div className="text-3xl font-bold">
                      {((Number(usage?.storageBytes || 0)) / 1024 / 1024).toFixed(0)} MB
                    </div>
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'settings' && (
              <div>
                <h2 className="text-2xl font-bold mb-6">Account Settings</h2>
                <div className="bg-white p-6 rounded-lg border">
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Name</label>
                      <input
                        type="text"
                        value={user?.name || ''}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg"
                        readOnly
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Email</label>
                      <input
                        type="email"
                        value={user?.email || ''}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg"
                        readOnly
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Organization</label>
                      <input
                        type="text"
                        value={user?.tenant?.name || ''}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg"
                        readOnly
                      />
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

const tools = [
  { id: 'pdf-merge', name: 'Merge PDFs', description: 'Combine multiple PDFs into one', icon: FileText },
  { id: 'pdf-split', name: 'Split PDF', description: 'Split PDF into separate pages', icon: FileText },
  { id: 'pdf-compress', name: 'Compress PDF', description: 'Reduce PDF file size', icon: FileText },
  { id: 'excel-merge', name: 'Merge Excel', description: 'Combine Excel workbooks', icon: FileSpreadsheet },
  { id: 'excel-split', name: 'Split Excel', description: 'Split sheets into separate files', icon: FileSpreadsheet },
  { id: 'excel-csv', name: 'Excel to CSV', description: 'Convert Excel to CSV format', icon: FileSpreadsheet },
  { id: 'word-html', name: 'Word to HTML', description: 'Convert Word to HTML', icon: File },
  { id: 'convert', name: 'Convert Files', description: 'Convert between formats', icon: Image },
]
