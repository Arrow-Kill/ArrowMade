// Utility to suppress Google OAuth Cross-Origin-Opener-Policy console errors
// This error is coming from Google's servers and doesn't affect functionality

export function suppressGoogleOAuthErrors() {
  // Store original console.error
  const originalError = console.error;
  
  // Override console.error to filter out the specific COOP error
  console.error = (...args: any[]) => {
    const message = args[0];
    
    // Check if it's the specific Google OAuth COOP error
    if (typeof message === 'string' && 
        message.includes('Cross-Origin-Opener-Policy policy would block the window')) {
      // Suppress this specific error
      return;
    }
    
    // Allow all other errors through
    originalError.apply(console, args);
  };
}

export function restoreConsoleError() {
  // This would restore the original console.error if needed
  // For now, we'll keep the filtering active
} 