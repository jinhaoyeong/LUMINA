import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

// Scroll utility for smooth scrolling to sections
export function scrollToSection(href: string, onClose?: () => void) {
  const id = href.substring(1) // Remove the # symbol
  const element = document.getElementById(id)

  if (element) {
    const offset = 80 // Offset for fixed navbar
    const elementPosition = element.getBoundingClientRect().top + window.scrollY
    const offsetPosition = elementPosition - offset

    // Use Lenis scrollTo if available, otherwise fallback to native
    if ((window as any).lenis) {
      (window as any).lenis.scrollTo(offsetPosition)
    } else {
      window.scrollTo({
        top: offsetPosition,
        behavior: "smooth"
      })
    }

    // Close any modal if provided
    if (onClose) {
      onClose()
    }
  }
}
