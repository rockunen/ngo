"use client";

export default function LoadingSpinner() {
  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 backdrop-blur-sm">
      <div className="bg-white rounded-lg p-8 shadow-2xl">
        <div className="flex flex-col items-center gap-4">
          {/* Spinner */}
          <div className="relative w-16 h-16">
            <div className="absolute inset-0 border-4 border-orange-100 rounded-full"></div>
            <div className="absolute inset-0 border-4 border-orange-500 border-t-transparent rounded-full animate-spin"></div>
          </div>
          
          {/* Loading Text */}
          <p className="text-gray-700 font-semibold">Loading...</p>
          
          {/* Animated dots */}
          <style>{`
            @keyframes dots {
              0%, 20% { content: '.'; }
              40% { content: '..'; }
              60%, 100% { content: '...'; }
            }
          `}</style>
        </div>
      </div>
    </div>
  );
}
