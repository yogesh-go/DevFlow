import { useEffect, useRef, useState, useCallback } from "react";
import LoadingSpinner from "./LoadingSpinner";

export function GoogleIcon({ className = "h-4 w-4" }) {
  return (
    <svg className={className} viewBox="0 0 24 24" aria-hidden="true">
      <path
        fill="#4285F4"
        d="M23.745 12.27c0-.7-.06-1.4-.19-2.07H12v4.51h6.6c-.29 1.52-1.14 2.82-2.4 3.68v3.05h3.88c2.27-2.09 3.665-5.17 3.665-9.17z"
      />
      <path
        fill="#34A853"
        d="M12 24c3.24 0 5.95-1.08 7.93-2.91l-3.88-3.05c-1.08.72-2.45 1.16-4.05 1.16-3.12 0-5.77-2.1-6.72-4.93H1.26v3.15C3.27 21.36 7.35 24 12 24z"
      />
      <path
        fill="#FBBC05"
        d="M5.28 14.27c-.25-.72-.38-1.49-.38-2.27s.13-1.55.38-2.27V6.58H1.26C.46 8.16 0 9.94 0 12s.46 3.84 1.26 5.42l4.02-3.15z"
      />
      <path
        fill="#EA4335"
        d="M12 4.75c1.77 0 3.35.61 4.6 1.8l3.42-3.42C17.95 1.19 15.24 0 12 0 7.35 0 3.27 2.64 1.26 6.58l4.02 3.15c.95-2.83 3.6-4.98 6.72-4.98z"
      />
    </svg>
  );
}

/**
 * Production Google Authentication Button Component
 *
 * Integrates official Google Identity Services (GIS) Web SDK:
 * - Dynamically loads Google Identity Services script
 * - Renders official Google-compliant Sign-In button
 * - Returns the cryptographic Google ID Token (credential) to parent
 * - Provides graceful fallback UI if VITE_GOOGLE_CLIENT_ID is unconfigured
 */
function GoogleAuthButton({
  onSuccess,
  onError,
  disabled = false,
  text = "continue_with", // "continue_with" | "signin_with" | "signup_with"
}) {
  const containerRef = useRef(null);
  const [sdkLoaded, setSdkLoaded] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const clientId = import.meta.env.VITE_GOOGLE_CLIENT_ID;
  const isConfigured = Boolean(
    clientId &&
      !clientId.includes("your_google_oauth_client_id") &&
      clientId.includes(".apps.googleusercontent.com")
  );

  const handleCredentialResponse = useCallback(
    async (response) => {
      if (!response?.credential) {
        onError?.("Google sign-in did not return a valid credential.");
        return;
      }

      try {
        setIsProcessing(true);
        await onSuccess(response.credential);
      } catch (err) {
        onError?.(err.message || "Failed to complete Google authentication.");
      } finally {
        setIsProcessing(false);
      }
    },
    [onSuccess, onError]
  );

  // Load Google Identity Services script if not already on page
  useEffect(() => {
    if (!isConfigured) return;

    if (window.google?.accounts?.id) {
      setSdkLoaded(true);
      return;
    }

    const scriptId = "google-identity-services-script";
    let script = document.getElementById(scriptId);

    if (!script) {
      script = document.createElement("script");
      script.id = scriptId;
      script.src = "https://accounts.google.com/gsi/client";
      script.async = true;
      script.defer = true;
      script.onload = () => setSdkLoaded(true);
      script.onerror = () => {
        console.error("Failed to load Google Identity Services SDK");
        onError?.("Unable to reach Google authentication services.");
      };
      document.head.appendChild(script);
    } else {
      script.addEventListener("load", () => setSdkLoaded(true));
    }
  }, [isConfigured, onError]);

  // Render official Google button when SDK is ready
  useEffect(() => {
    if (!sdkLoaded || !isConfigured || !containerRef.current) return;

    try {
      window.google.accounts.id.initialize({
        client_id: clientId,
        callback: handleCredentialResponse,
        auto_select: false,
        cancel_on_tap_outside: true,
      });

      // Calculate width to fit container (bounded between 240 and 400 per GIS spec)
      const containerWidth = containerRef.current.offsetWidth || 384;
      const buttonWidth = Math.min(Math.max(containerWidth, 240), 400);

      containerRef.current.innerHTML = "";
      window.google.accounts.id.renderButton(containerRef.current, {
        type: "standard",
        theme: "outline",
        size: "large",
        text,
        shape: "rectangular",
        logo_alignment: "center",
        width: buttonWidth,
      });
    } catch (err) {
      console.error("Error initializing Google Identity Services:", err);
      onError?.("Failed to initialize Google Sign-In button.");
    }
  }, [sdkLoaded, isConfigured, clientId, text, handleCredentialResponse, onError]);

  const handleUnconfiguredClick = () => {
    onError?.(
      "Google Sign-In requires configuration. Set VITE_GOOGLE_CLIENT_ID in client/.env and GOOGLE_CLIENT_ID in server/.env."
    );
  };

  if (isProcessing) {
    return (
      <div className="flex h-[42px] w-full items-center justify-center rounded-lg border border-[#E6E3DB] bg-[#FAF9F5] text-xs text-[#575653]">
        <LoadingSpinner message="Connecting with Google..." size="sm" />
      </div>
    );
  }

  // If Client ID is not configured, show polished DevFlow fallback button with clear explanation on click
  if (!isConfigured) {
    return (
      <button
        type="button"
        onClick={handleUnconfiguredClick}
        disabled={disabled}
        className="group relative flex h-[42px] w-full items-center justify-center gap-3 rounded-lg border border-[#E6E3DB] bg-white px-4 text-sm font-medium text-[#18181B] transition-all hover:bg-[#FAF9F5] hover:border-[#D5D1C6] active:scale-[0.99] focus:outline-none focus:ring-2 focus:ring-[#657858]/15"
        title="Google OAuth Client ID required in .env"
      >
        <GoogleIcon className="h-4 w-4 shrink-0" />
        <span>Continue with Google</span>
      </button>
    );
  }

  return (
    <div className="w-full flex justify-center min-h-[42px]">
      <div ref={containerRef} className="w-full flex justify-center" />
    </div>
  );
}

export default GoogleAuthButton;
