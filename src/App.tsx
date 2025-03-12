"use client"

import React, { useState, useEffect } from "react"
import { createClient } from '@supabase/supabase-js'
import { Menu, X, GitlabIcon as GitHub, Linkedin, Twitter, Mail, ExternalLink, ArrowDown } from "lucide-react"

const supabaseUrl = import.meta.env.VITE_NEXT_PUBLIC_SUPABASE_URL || '';
const supabaseAnonKey = import.meta.env.VITE_NEXT_PUBLIC_SUPABASE_ANON_KEY || '';
const supabase = createClient(supabaseUrl, supabaseAnonKey)

function App() {
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [isLoaded, setIsLoaded] = useState(false)
  const [activeSection, setActiveSection] = useState("")
  
  // Form state
  const [formData, setFormData] = useState({
    email: '',
    message: ''
  })
  const [formStatus, setFormStatus] = useState({
    isSubmitting: false,
    isSuccess: false,
    isError: false,
    message: ''
  })

  // Handle form input changes
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { id, value } = e.target
    setFormData(prevData => ({
      ...prevData,
      [id]: value
    }))
  }

  // Handle form submission
  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    
    // Validate form
    if (!formData.email || !formData.message) {
      setFormStatus({
        isSubmitting: false,
        isSuccess: false,
        isError: true,
        message: 'Please fill in all fields'
      })
      return
    }

    setFormStatus({
      isSubmitting: true,
      isSuccess: false,
      isError: false,
      message: ''
    })

    try {
      // Insert data into Supabase
      const { error } = await supabase
        .from('messages')
        .insert([
          { 
            email: formData.email, 
            message: formData.message,
            created_at: new Date()
          }
        ])

      if (error) throw error

      // Success
      setFormStatus({
        isSubmitting: false,
        isSuccess: true,
        isError: false,
        message: 'Message sent successfully!'
      })

      // Reset form
      setFormData({
        email: '',
        message: ''
      })

      // Reset success message after 5 seconds
      setTimeout(() => {
        setFormStatus(prev => ({
          ...prev,
          isSuccess: false,
          message: ''
        }))
      }, 5000)
    } catch (error) {
      console.error('Error sending message:', error)
      setFormStatus({
        isSubmitting: false,
        isSuccess: false,
        isError: true,
        message: 'Failed to send message. Please try again.'
      })
    }
  }

  useEffect(() => {
    setIsLoaded(true)

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setActiveSection(entry.target.id)
          }
        })
      },
      { threshold: 0.3 }
    )

    document.querySelectorAll("section[id]").forEach((section) => {
      observer.observe(section)
    })

    const animateElements = () => {
      const fadeElements = document.querySelectorAll('.fade-in')
      
      fadeElements.forEach(element => {
        const elementTop = element.getBoundingClientRect().top
        const elementVisible = 150
        
        if (elementTop < window.innerHeight - elementVisible) {
          element.classList.add('visible')
        }
      })
    }
    
    animateElements()
    
    window.addEventListener('scroll', animateElements)

    return () => {
      document.querySelectorAll("section[id]").forEach((section) => {
        observer.unobserve(section)
      })
      window.removeEventListener('scroll', animateElements)
    }
  }, [])

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen)
  }

  return (
    <div className="min-h-screen bg-[#1e151d] text-gray-50">
      {/* Global CSS for text transitions */}
      <style dangerouslySetInnerHTML={{ __html: `
        h1, h2, h3, p, a, button {
          transition: color 0.3s ease, transform 0.3s ease, opacity 0.3s ease;
        }
        
        .fade-in {
          opacity: 0;
          transform: translateY(20px);
          transition: opacity 0.6s ease, transform 0.6s ease;
        }
        
        .fade-in.visible {
          opacity: 1;
          transform: translateY(0);
        }
        
        .stagger-item:nth-child(1) { transition-delay: 0.1s; }
        .stagger-item:nth-child(2) { transition-delay: 0.2s; }
        .stagger-item:nth-child(3) { transition-delay: 0.3s; }
        .stagger-item:nth-child(4) { transition-delay: 0.4s; }
        .stagger-item:nth-child(5) { transition-delay: 0.5s; }
        .stagger-item:nth-child(6) { transition-delay: 0.6s; }
        .stagger-item:nth-child(7) { transition-delay: 0.7s; }
        .stagger-item:nth-child(8) { transition-delay: 0.8s; }
        .stagger-item:nth-child(9) { transition-delay: 0.9s; }
        .stagger-item:nth-child(10) { transition-delay: 1s; }
        .stagger-item:nth-child(11) { transition-delay: 1.1s; }
        .stagger-item:nth-child(12) { transition-delay: 1.2s; }
      `}} />

      {/* Header */}
      <header className="sticky top-0 z-50 bg-[#1e151d]/90 backdrop-blur-sm border-b border-[#db924c]/30">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex-shrink-0 font-bold text-xl">
              <a 
                href="#" 
                className={`text-[#db924c] transition-all duration-300 ${isLoaded ? 'opacity-100' : 'opacity-0'}`}
              >
                Zidanni Clerigo
              </a>
            </div>

            {/* Desktop Navigation */}
            <nav className="hidden md:flex space-x-8">
              {["skills", "projects", "contact"].map((item, index) => (
                <a 
                  key={item}
                  href={`#${item}`} 
                  className={`hover:text-[#db924c] transition-all duration-300 ${
                    isLoaded ? 'opacity-100' : 'opacity-0'
                  } ${
                    activeSection === item ? 'text-[#db924c]' : ''
                  }`}
                  style={{ transitionDelay: `${index * 0.1}s` }}
                >
                  {item.charAt(0).toUpperCase() + item.slice(1)}
                </a>
              ))}
            </nav>

            {/* Mobile Menu Button */}
            <div className="md:hidden">
              <button
                onClick={toggleMenu}
                className="p-2 rounded-md text-gray-400 hover:text-white transition-colors duration-300"
              >
                {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
              </button>
            </div>
          </div>
        </div>

        {/* Mobile Navigation */}
        {isMenuOpen && (
          <div className="md:hidden bg-[#1e151d] border-b border-[#db924c]/30">
            <div className="container mx-auto px-4 py-4 space-y-3">
              {["skills", "projects", "contact"].map((item, index) => (
                <a 
                  key={item}
                  href={`#${item}`} 
                  className={`block hover:text-[#db924c] transition-all duration-300 ${
                    activeSection === item ? 'text-[#db924c]' : ''
                  }`}
                  style={{ transitionDelay: `${index * 0.05}s` }}
                  onClick={toggleMenu}
                >
                  {item.charAt(0).toUpperCase() + item.slice(1)}
                </a>
              ))}
            </div>
          </div>
        )}
      </header>

      <main>
        {/* Hero Section */}
        <section className="relative py-20 md:py-32 overflow-hidden">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex flex-col md:flex-row items-center justify-between gap-12">
              <div className="md:w-1/2 space-y-6">
                <h1 className={`text-4xl md:text-5xl lg:text-6xl font-bold leading-tight fade-in ${isLoaded ? 'visible' : ''}`}>
                  Hi, I'm <span className="text-[#db924c] inline-block transition-transform hover:scale-105">Zidanni</span>
                </h1>
                <p className={`text-lg text-gray-300 max-w-lg fade-in ${isLoaded ? 'visible' : ''}`} style={{ transitionDelay: '0.2s' }}>
                  I like building things and telling stories. Somebody once told me that was a deadly combo. I guess I'm here to prove it to them :)
                </p>
                <p className={`text-lg text-gray-300 max-w-lg fade-in ${isLoaded ? 'visible' : ''}`} style={{ transitionDelay: '0.3s' }}>
                  If you wanna make something cool with me, HMU
                </p>
                <div className={`flex space-x-4 fade-in ${isLoaded ? 'visible' : ''}`} style={{ transitionDelay: '0.4s' }}>
                  <a
                    href="#contact"
                    className="px-6 py-3 bg-[#db924c] text-white rounded-md hover:bg-[#db924c]/90 transition-all duration-300 hover:scale-105"
                  >
                    Contact Me
                  </a>
                  <a
                    href="#projects"
                    className="px-6 py-3 border border-[#db924c]/50 rounded-md hover:bg-[#261b25] transition-all duration-300 hover:scale-105"
                  >
                    View Projects
                  </a>
                </div>
                <div className={`flex space-x-4 pt-4 fade-in ${isLoaded ? 'visible' : ''}`} style={{ transitionDelay: '0.5s' }}>
                  {[
                    { icon: GitHub, href: "https://github.com/zClerigo", label: "GitHub" },
                    { icon: Linkedin, href: "https://www.linkedin.com/in/zidanni-clerigo/", label: "LinkedIn" },
                    { icon: Mail, href: "mailto:zidanni.clerigo@gmail.com", label: "Email" },
                    { icon: Twitter, href: "https://x.com/zidanni_clerigo", label: "X (Twitter)" }
                  ].map((link, index) => (
                    <a
                      key={link.label}
                      href={link.href}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-gray-400 hover:text-[#db924c] transition-all duration-300 hover:scale-110"
                      style={{ transitionDelay: `${0.5 + (index * 0.1)}s` }}
                    >
                      <link.icon size={24} />
                      <span className="sr-only">{link.label}</span>
                    </a>
                  ))}
                </div>
              </div>
              <div className={`md:w-1/2 flex justify-center fade-in ${isLoaded ? 'visible' : ''}`} style={{ transitionDelay: '0.6s' }}>
                <div className="relative w-64 h-64 md:w-80 md:h-80 rounded-full overflow-hidden border-4 border-[#db924c] transition-all duration-500 hover:border-white">
                  <img
                    src={`${import.meta.env.BASE_URL}profile-pic.jpg`}
                    alt="Zidanni Clerigo"
                    className="w-full h-full object-cover transition-transform duration-700 hover:scale-110"
                  />
                </div>
              </div>
            </div>
            <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 animate-bounce hidden md:block">
              <a href="#skills" className="text-gray-400 hover:text-[#db924c] transition-colors duration-300">
                <ArrowDown size={24} />
                <span className="sr-only">Scroll down</span>
              </a>
            </div>
          </div>
        </section>

        {/* Skills Section */}
        <section id="skills" className="py-20 bg-[#261b25]">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <div className="max-w-3xl mx-auto text-center mb-16">
              <h2 className="text-3xl md:text-4xl font-bold mb-6 fade-in" data-section="skills">Skills</h2>
              <div className="w-20 h-1 bg-[#db924c] mx-auto mb-8 fade-in" style={{ transitionDelay: '0.1s' }}></div>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
              {[
                "JavaScript",
                "TypeScript",
                "React",
                "Python",
                "HTML/CSS",
                "Tailwind CSS",
                "Django",
                "Flask",
                "Supabase",
                "PostgreSQL",
                "Git",
                "Godot",
              ].map((skill) => (
                <div
                  key={skill}
                  className={`bg-[#261b25] p-6 rounded-lg shadow-sm hover:shadow-md transition-all duration-300 text-center border border-[#db924c]/20 hover:border-[#db924c]/40 hover:scale-105 fade-in stagger-item`}
                >
                  <p className="font-medium">{skill}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Projects Section */}
        <section id="projects" className="py-20 bg-[#1e151d]">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <div className="max-w-3xl mx-auto text-center mb-16">
              <h2 className="text-3xl md:text-4xl font-bold mb-6 fade-in" data-section="projects">Projects</h2>
              <div className="w-20 h-1 bg-[#db924c] mx-auto mb-8 fade-in" style={{ transitionDelay: '0.1s' }}></div>
              <p className="text-lg text-gray-300 fade-in" style={{ transitionDelay: '0.2s' }}>
                What I do for fun.
              </p>
            </div>

            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              {[
                {
                  title: "NJ-Track",
                  description: "2nd place winner @ HackRU Fall 2024. Allows vehicle conductors to manage the locations of passengers.",
                  image: `${import.meta.env.BASE_URL}NJ-Track.png`,
                  link: "https://github.com/zClerigo/nj-track",
                },
                {
                  title: "Sharky",
                  description:
                    "Best Web Application winner @ Fungi Studio Hackathon 2025. SMMT that strives for virality in each post.",
                  image: `${import.meta.env.BASE_URL}sharky.png`,
                  link: "https://github.com/zClerigo/sharky",
                },
                {
                  title: "DramaBrew",
                  description: "Mobile app that lets you talk to any character in any scenario.",
                  image: `${import.meta.env.BASE_URL}DramaBrew.png`,
                  link: "https://github.com/zClerigo/DramaBrew",
                },
                {
                  title: "Hairstyle Helper",
                  description: "Analyzes your hair type and provides advice on maintenance.",
                  image: `${import.meta.env.BASE_URL}placeholder.png`,
                  link: "https://github.com/zClerigo/hairstyle-helper",
                },
              ].map((project) => (
                <div
                  key={project.title}
                  className={`bg-[#1e151d] rounded-lg overflow-hidden shadow-md hover:shadow-lg transition-all duration-500 border border-[#db924c]/20 hover:border-[#db924c]/40 hover:scale-105 fade-in stagger-item`}
                >
                  <img
                    src={project.image}
                    alt={project.title}
                    className="w-full h-48 object-cover transition-transform duration-700 hover:scale-105"
                  />
                  <div className="p-6">
                    <h3 className="text-xl font-bold mb-2 transition-colors duration-300 hover:text-[#db924c]">{project.title}</h3>
                    <p className="text-gray-300 mb-4">{project.description}</p>
                    <a href={project.link} className="inline-flex items-center text-[#db924c] hover:underline transition-all duration-300 hover:translate-x-1">
                      View Project <ExternalLink size={16} className="ml-1" />
                    </a>
                  </div>
                </div>
              ))}
            </div>

            <div className="text-center mt-12 fade-in" style={{ transitionDelay: '0.3s' }}>
              <a
                href="https://github.com/zClerigo"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center px-6 py-3 bg-[#db924c] text-white rounded-md hover:bg-[#db924c]/90 transition-all duration-300 hover:scale-105"
              >
                View More on GitHub <GitHub size={16} className="ml-2" />
              </a>
            </div>
          </div>
        </section>

        {/* Contact Section */}
        <section id="contact" className="py-20 bg-[#261b25]">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <div className="max-w-3xl mx-auto text-center mb-16">
              <h2 className="text-3xl md:text-4xl font-bold mb-6 fade-in" data-section="contact">Get In Touch</h2>
              <div className="w-20 h-1 bg-[#db924c] mx-auto mb-8 fade-in" style={{ transitionDelay: '0.1s' }}></div>
              <p className="text-lg text-gray-300 fade-in" style={{ transitionDelay: '0.2s' }}>
                Project in mind? Need a new friend? Want an anime rec?
              </p>
            </div>

            <div className="max-w-2xl mx-auto fade-in" style={{ transitionDelay: '0.3s' }}>
              <form className="space-y-6" onSubmit={handleSubmit}>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label htmlFor="email" className="block text-sm font-medium text-gray-300 mb-1 transition-colors duration-300">
                      Email
                    </label>
                    <input
                      type="email"
                      id="email"
                      value={formData.email}
                      onChange={handleInputChange}
                      className="w-full px-4 py-2 border border-[#db924c]/30 rounded-md focus:ring-2 focus:ring-[#db924c] focus:border-transparent bg-[#261b25] text-white transition-all duration-300 focus:scale-105"
                      placeholder="Your email"
                      required
                    />
                  </div>
                </div>
                <div>
                  <label htmlFor="message" className="block text-sm font-medium text-gray-300 mb-1 transition-colors duration-300">
                    Message
                  </label>
                  <textarea
                    id="message"
                    rows={5}
                    value={formData.message}
                    onChange={handleInputChange}
                    className="w-full px-4 py-2 border border-[#db924c]/30 rounded-md focus:ring-2 focus:ring-[#db924c] focus:border-transparent bg-[#261b25] text-white transition-all duration-300 focus:scale-105"
                    placeholder="Your message"
                    required
                  ></textarea>
                </div>
                
                {/* Form status message */}
                {(formStatus.isSuccess || formStatus.isError) && (
                  <div className={`text-center p-3 rounded-md ${formStatus.isSuccess ? 'bg-green-800/50 text-green-200' : 'bg-red-800/50 text-red-200'}`}>
                    {formStatus.message}
                  </div>
                )}
                
                <div>
                  <button
                    type="submit"
                    disabled={formStatus.isSubmitting}
                    className={`w-full px-6 py-3 bg-[#db924c] text-white rounded-md hover:bg-[#db924c]/90 transition-all duration-300 hover:scale-105 ${
                      formStatus.isSubmitting ? 'opacity-70 cursor-not-allowed' : ''
                    }`}
                  >
                    {formStatus.isSubmitting ? 'Sending...' : 'Send Message'}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="py-8 bg-[#1e151d] border-t border-[#db924c]/30">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="mb-4 md:mb-0">
              <p className="text-gray-300 transition-colors duration-300 hover:text-white">
                &copy; {new Date().getFullYear()} Zidanni Clerigo
              </p>
            </div>
            <div className="flex space-x-6">
              {[
                { icon: GitHub, href: "https://github.com/zClerigo", label: "GitHub" },
                { icon: Linkedin, href: "https://www.linkedin.com/in/zidanni-clerigo/", label: "LinkedIn" },
                { icon: Mail, href: "mailto:zidanni.clerigo@gmail.com", label: "Email" },
                { icon: Twitter, href: "https://x.com/zidanni_clerigo", label: "X (Twitter)" }
              ].map((link) => (
                <a
                  key={link.label}
                  href={link.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-gray-400 hover:text-[#db924c] transition-all duration-300 hover:scale-110"
                >
                  <link.icon size={20} />
                  <span className="sr-only">{link.label}</span>
                </a>
              ))}
            </div>
          </div>
        </div>
      </footer>
    </div>
  )
}

export default App