export {}; // Ensure this file is treated as a module.

declare global {
  interface CustomJwtSessionClaims {
    metadata?: { // Make metadata itself optional initially
      onboardingComplete?: boolean;
      // Add other simple user-specific onboarding fields here if decided
      // e.g., practiceDisplayName?: string; 
    };
    // Add other custom claims here if any in the future
  }
} 