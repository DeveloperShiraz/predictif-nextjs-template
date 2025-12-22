interface LoadingSpinnerProps {
  className?: string;
  message?: string;
}

export function LoadingSpinner({
  className = "",
  message = "Authenticating",
}: LoadingSpinnerProps) {
  return (
    <div
      className={`z-10 w-full max-w-md p-8 space-y-6 bg-white/90 dark:bg-zinc-900/90 rounded-lg shadow-xl backdrop-blur-sm \${className}`}
    >
      <div className="flex flex-col items-center justify-center space-y-6">
        {/* Circle with rotating ball and centered Letter */}
        <div className="relative w-32 h-32">
          {/* Static circle */}
          <div className="absolute inset-0 rounded-full border-4 border-blue-500" />

          {/* Centered Letter */}
          <div className="absolute inset-0 flex items-center justify-center">
            <span className="text-[#17315e] dark:text-white font-black text-4xl">
              Pif
            </span>
          </div>

          {/* Rotating ball */}
          <div
            className="absolute top-0 left-1/2 -ml-2 w-4 h-4"
            style={{
              animation: "orbit 2s linear infinite",
              transformOrigin: "50% 64px",
            }}
          >
            <div className="w-full h-full bg-blue-500 rounded-full shadow-[0_0_10px_4px_rgba(59,130,246,0.5)]" />
          </div>

          <style jsx>{`
            @keyframes orbit {
              from {
                transform: rotate(0deg);
              }
              to {
                transform: rotate(360deg);
              }
            }
          `}</style>
        </div>

        {/* Text content */}
        <div className="text-center space-y-2">
          <h3 className="text-xl font-semibold text-gray-800 dark:text-gray-200">
            {message}
          </h3>
          <p className="text-sm text-gray-500 dark:text-gray-400">
            {message === "Authenticating"
              ? "Please wait while we verify your credentials"
              : "Redirecting you to the dashboard..."}
          </p>
        </div>
      </div>
    </div>
  );
}

// Create a specific component for "Already Authenticated" spinner
export function AlreadyAuthenticatedSpinner({
  className = "",
}: {
  className?: string;
}) {
  return (
    <LoadingSpinner message="Already Authenticated" className={className} />
  );
}
