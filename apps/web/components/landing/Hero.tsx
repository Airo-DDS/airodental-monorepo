"use client"

import React from "react"
import { motion } from "framer-motion"
import Link from "next/link"
import Image from "next/image"

// Animation variants for consistent, reusable animations
const fadeInUp = {
  hidden: { opacity: 0, y: 30 },
  visible: (custom: number) => ({
    opacity: 1,
    y: 0,
    transition: {
      delay: custom * 0.2,
      duration: 0.6,
      ease: [0.215, 0.61, 0.355, 1] // Cubic bezier for a professional easing
    }
  })
}

export default function Hero() {
  return (
    <div className="relative h-screen w-full overflow-hidden">
      {/* Background image with animation */}
      <motion.div 
        className="absolute inset-0 z-0 bottom-0"
        initial={{ scale: 1.05, opacity: 0 }}
        animate={{ 
          scale: 1, 
          opacity: 1,
          transition: {
            duration: 1.2,
            ease: "easeOut"
          }
        }}
      >
        <div className="relative w-full h-full flex items-end">
          <div className="relative w-full h-[100%]">
            <Image
              src="/hero-bg-image.png"
              alt="Hero background"
              fill
              priority
              className="object-cover object-bottom opacity-80"
              sizes="100vw"
            />
          </div>
        </div>
      </motion.div>
      
      {/* Content container */}
      <div className="relative z-10 h-full flex flex-col justify-center mx-auto max-w-[1920px] px-4 sm:px-8 md:px-16 lg:px-24 xl:px-[120px] pt-20">
        <motion.div
          initial="hidden"
          animate="visible"
          className="hero-main-container text-center"
        >
          {/* Hero Logo */}
          <motion.div
            variants={fadeInUp}
            custom={0}
          >
            <Image 
              src="/hero-section-logo.png" 
              alt="Airodental Logo" 
              width={300} 
              height={100}
              className="w-[200px] sm:w-[300px] max-w-full h-auto mb-6 sm:mb-8 mx-auto"
            />
          </motion.div>
          
          {/* Hero Text */}
          <motion.div 
  variants={fadeInUp}
  custom={1}
  className="text-[36px] font-medium mb-[30px] text-black md:pr-10 sm:text-[30px] xs:text-[24px]"
  style={{ fontFamily: "Lato, sans-serif" }}
>
  Revolutionizing dental practices with AI
</motion.div>
          
          {/* CTA Container */}
          <motion.div 
            variants={fadeInUp}
            custom={2}
            className="flex flex-col sm:flex-row items-center justify-center gap-[33px] flex-wrap"
          >
            <motion.div
              whileHover={{ 
                scale: 1.05,
                boxShadow: "0px 8px 20px rgba(0, 0, 0, 0.1)",
                transition: { duration: 0.2 }
              }}
              whileTap={{ scale: 0.98 }}
            >
              <Link 
                href="#how-it-works" 
                className="inline-block px-10 py-3 bg-white rounded-full border border-[#f1f1f1]"
              >
                <span 
                  className="text-xl font-medium font-lato"
                  style={{ 
                    background: "linear-gradient(135deg, #C33A69 0%, #86399E 100%)",
                    WebkitBackgroundClip: "text",
                    WebkitTextFillColor: "transparent",
                    backgroundClip: "text"
                  }}
                >
                  See how it works
                </span>
              </Link>
            </motion.div>
          </motion.div>
        </motion.div>
      </div>
    </div>
  )
}