"use client"

import React, { useEffect } from "react"
import Link from "next/link"
import { motion, AnimatePresence } from "framer-motion"
import { useClerk } from "@clerk/nextjs"
import { useRouter } from "next/navigation"

interface MobileMenuProps {
  isOpen: boolean
  onClose: () => void
  menuItems: Array<{
    title: string
    href: string
  }>
  isSignedIn?: boolean
}

const backdropVariants = {
  hidden: { opacity: 0 },
  visible: { 
    opacity: 1,
    transition: {
      duration: 0.3,
      ease: "easeOut"
    }
  },
  exit: {
    opacity: 0,
    transition: {
      duration: 0.2,
      ease: "easeIn"
    }
  }
}

const menuVariants = {
  hidden: { x: "100%" },
  visible: { 
    x: 0,
    transition: {
      type: "spring",
      damping: 25,
      stiffness: 300,
      when: "beforeChildren",
      staggerChildren: 0.1
    }
  },
  exit: {
    x: "100%",
    transition: {
      duration: 0.3,
      ease: [0.6, 0.05, 0.01, 0.99]
    }
  }
}

const menuItemVariants = {
  hidden: { x: 20, opacity: 0 },
  visible: { 
    x: 0, 
    opacity: 1,
    transition: {
      duration: 0.4,
      ease: "easeOut"
    }
  },
  exit: {
    opacity: 0,
    transition: {
      duration: 0.2
    }
  }
}

export default function MobileMenu({ isOpen, onClose, menuItems }: MobileMenuProps) {
  const { openSignIn } = useClerk()
  const router = useRouter()
  
  useEffect(() => {
    const handleEsc = (event: KeyboardEvent) => {
      if (event.key === "Escape") onClose()
    }
    window.addEventListener("keydown", handleEsc)
    return () => window.removeEventListener("keydown", handleEsc)
  }, [onClose])

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden"
    } else {
      document.body.style.overflow = ""
    }
    return () => {
      document.body.style.overflow = ""
    }
  }, [isOpen])

  // Handle auth action or navigation
  const handleAuthClick = (title: string, href: string) => {
    onClose()
    
    if (title === "Dashboard") {
      router.push(href) // Navigate to dashboard
    } else if (title === "Login") {
      openSignIn() // Open sign in
    } else {
      router.push(href) // Navigate to other pages
    }
  }

  return (
    <AnimatePresence mode="wait">
      {isOpen && (
        <>
          <motion.div
            variants={backdropVariants}
            initial="hidden"
            animate="visible"
            exit="exit"
            className="fixed inset-0 bg-black/50 z-40"
            onClick={onClose}
          />
          
          <motion.div
            variants={menuVariants}
            initial="hidden"
            animate="visible"
            exit="exit"
            className="fixed top-0 right-0 h-full w-4/5 max-w-sm bg-white z-50 shadow-xl"
          >
            <div className="flex flex-col h-full">
              <motion.div 
                className="flex justify-end p-4"
                variants={menuItemVariants}
              >
                <motion.button 
                  type="button"
                  onClick={onClose} 
                  className="p-2 text-gray-500 hover:text-gray-700"
                  aria-label="Close menu"
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                >
                  <svg 
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-6 w-6" 
                    fill="none" 
                    viewBox="0 0 24 24" 
                    stroke="currentColor"
                    aria-hidden="true"
                  >
                    <path 
                      strokeLinecap="round" 
                      strokeLinejoin="round" 
                      strokeWidth={2} 
                      d="M6 18L18 6M6 6l12 12" 
                    />
                  </svg>
                </motion.button>
              </motion.div>
              
              <nav className="flex-1 px-4 pb-4" style={{ fontFamily: "Lato, sans-serif" }}>
                <ul className="space-y-4">
                  {menuItems.map((item) => (
                    <motion.li 
                      key={item.title}
                      variants={menuItemVariants}
                    >
                      {item.title === "Login" || item.title === "Dashboard" ? (
                        <motion.button
                          onClick={() => handleAuthClick(item.title, item.href)}
                          type="button"
                          className="block w-full px-6 py-2 text-center rounded-full"
                          style={{ 
                            background: "linear-gradient(135deg, #C33A69 0%, #86399E 100%)",
                            color: "white",
                            fontWeight: 500,
                            fontFamily: "Lato, sans-serif"
                          }}
                          whileHover={{ 
                            scale: 1.05,
                            boxShadow: "0px 8px 20px rgba(0, 0, 0, 0.1)",
                            transition: { duration: 0.2 }
                          }}
                          whileTap={{ scale: 0.98 }}
                        >
                          {item.title}
                        </motion.button>
                      ) : (
                        <Link
                          href={item.href}
                          className="block py-2 text-lg font-medium text-gray-800 hover:text-[#09474C] transition-colors duration-300 relative after:absolute after:w-0 after:h-[1px] after:bg-[#09474C] after:bottom-0 after:left-0 after:transition-all after:duration-300 hover:after:w-full"
                          style={{ fontFamily: "Lato, sans-serif" }}
                          onClick={onClose}
                        >
                          {item.title}
                        </Link>
                      )}
                    </motion.li>
                  ))}
                </ul>
              </nav>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  )
} 