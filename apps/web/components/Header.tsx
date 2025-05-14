"use client"

import React, { useState, useEffect } from "react"
import Link from "next/link"
import { motion } from "framer-motion"
import Image from "next/image"
import MobileMenu from "./MobileMenu"
import { useClerk, useAuth } from "@clerk/nextjs"
import { useRouter } from "next/navigation"
import { Menu } from "lucide-react"

// Animation variants
const headerVariants = {
  hidden: { y: -80, opacity: 0 },
  visible: { 
    y: 0, 
    opacity: 1,
    transition: {
      duration: 0.6,
      ease: [0.215, 0.61, 0.355, 1],
      when: "beforeChildren",
      staggerChildren: 0.1
    }
  }
}

const itemVariants = {
  hidden: { y: -20, opacity: 0 },
  visible: { 
    y: 0, 
    opacity: 1,
    transition: {
      duration: 0.4,
      ease: "easeOut"
    }
  }
}

const menuItems = [
  { title: "Home", href: "/" },
  { title: "Features", href: "#features" },
  { title: "Pricing", href: "#pricing" },
  { title: "Contact", href: "#contact" }
]

export default function Header() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const [hasScrolled, setHasScrolled] = useState(false)
  const { openSignIn } = useClerk()
  const { isSignedIn } = useAuth()
  const router = useRouter()

  useEffect(() => {
    const handleScroll = () => {
      setHasScrolled(window.scrollY > 10)
    }
    
    window.addEventListener("scroll", handleScroll)
    return () => window.removeEventListener("scroll", handleScroll)
  }, [])
  
  const handleAuthAction = () => {
    if (isSignedIn) {
      router.push("/dashboard")
    } else {
      openSignIn()
    }
  }

  return (
    <motion.header 
      className="fixed top-0 left-0 right-0 z-50"
      variants={headerVariants}
      initial="hidden"
      animate="visible"
    >
      {/* Main menu container */}
      <div className="flex justify-center items-center gap-[60px] mt-[50px]">
        {/* Logo container */}
        <motion.div 
          className="w-[60px] h-[60px] bg-[#f1f1f1] rounded-full flex items-center justify-center"
          variants={itemVariants}
          animate={hasScrolled ? "withShadow" : "noShadow"}
          initial="noShadow"
          whileHover={{ 
            scale: 1.05,
            transition: { duration: 0.2 }
          }}
          whileTap={{ scale: 0.98 }}
          style={{
            boxShadow: hasScrolled 
              ? "0px 4px 20px rgba(0, 0, 0, 0.1)" 
              : "0px 0px 0px rgba(0, 0, 0, 0)"
          }}
          transition={{ duration: 0.3 }}
        >
          <Link href="/">
            <Image 
              src="/logo.png" 
              alt="Airodental Logo" 
              width={40} 
              height={40}
              className="object-contain"
            />
          </Link>
        </motion.div>
        
        {/* Navigation container */}
        <motion.div 
          className="bg-[#f1f1f1] py-[18px] px-[33px] rounded-[50px] hidden md:block"
          variants={itemVariants}
          animate={hasScrolled ? "withShadow" : "noShadow"}
          initial="noShadow"
          style={{
            boxShadow: hasScrolled 
              ? "0px 4px 20px rgba(0, 0, 0, 0.1)" 
              : "0px 0px 0px rgba(0, 0, 0, 0)"
          }}
          transition={{ duration: 0.3 }}
        >
          <nav className="flex gap-[100px]">
            {menuItems.map((item) => (
              <motion.div key={item.title} variants={itemVariants}>
                <Link 
                  href={item.href}
                  className="text-[16px] text-black hover:text-[#09474C] transition-colors duration-300 relative after:absolute after:w-0 after:h-[1px] after:bg-[#09474C] after:bottom-[-2px] after:left-0 after:transition-all after:duration-300 hover:after:w-full"
                  style={{ fontFamily: "Lato, sans-serif" }}
                >
                  {item.title}
                </Link>
              </motion.div>
            ))}
          </nav>
        </motion.div>
        
        {/* Auth button - Login or Dashboard */}
        <motion.div
          variants={itemVariants}
          className="hidden md:block"
        >
          <motion.button
            onClick={handleAuthAction}
            whileHover={{ 
              scale: 1.05,
              boxShadow: "0px 8px 20px rgba(0, 0, 0, 0.1)",
              transition: { duration: 0.2 }
            }}
            whileTap={{ scale: 0.98 }}
            className="inline-block px-6 py-2 rounded-full"
            style={{ 
              background: "linear-gradient(135deg, #C33A69 0%, #86399E 100%)",
              color: "white",
              fontWeight: 500,
              fontFamily: "Lato, sans-serif"
            }}
          >
            {isSignedIn ? "Dashboard" : "Login"}
          </motion.button>
        </motion.div>
        
        {/* Mobile menu button */}
        <motion.button 
          type="button" 
          className="md:hidden text-gray-700 absolute right-4"
          onClick={() => setMobileMenuOpen(true)}
          aria-label="Open menu"
          variants={itemVariants}
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
        >
          <Menu className="h-6 w-6" aria-hidden="true" />
        </motion.button>

        {/* Mobile menu */}
        <MobileMenu 
          isOpen={mobileMenuOpen} 
          onClose={() => setMobileMenuOpen(false)}
          menuItems={[
            ...menuItems,
            { title: isSignedIn ? "Dashboard" : "Login", href: isSignedIn ? "/dashboard" : "#" }
          ]}
          isSignedIn={isSignedIn}
        />
      </div>
    </motion.header>
  )
} 