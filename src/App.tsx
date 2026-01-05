import React from 'react'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import Navbar from './components/Navbar'
import Dashboard from './components/Dashboard'
import MeetingCalendar from './components/MeetingCalendar'
import VideoCall from './components/VideoCall'
import DocumentChamber from './components/DocumentChamber'
import Payments from './components/Payments'
import Security from './components/Security'

function App() {
  return (
    <Router>
      <div className="min-h-screen bg-gray-50">
        <Navbar />
        <Routes>
          <Route path="/" element={<Dashboard />} />
          <Route path="/calendar" element={<MeetingCalendar />} />
          <Route path="/video-call" element={<VideoCall />} />
          <Route path="/documents" element={<DocumentChamber />} />
          <Route path="/payments" element={<Payments />} />
          <Route path="/security" element={<Security />} />
        </Routes>
      </div>
    </Router>
  )
}

export default App
