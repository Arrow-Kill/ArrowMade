
export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-900 to-black text-white">
      <main className="container mx-auto px-4 py-16">
        <div className="flex flex-col items-center justify-center space-y-8">
          <h1 className="text-6xl font-bold text-center bg-clip-text text-transparent bg-gradient-to-r from-red-500 to-orange-500">
            ArrowKill
          </h1>  

          <p className="text-xl text-gray-300 text-center max-w-2xl">
            Precision. Power. Performance.
          </p>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-12">
            <div className="bg-gray-800/50 p-6 rounded-lg backdrop-blur-sm">
              <h2 className="text-2xl font-semibold mb-4 text-orange-500">Precision</h2>
              <p className="text-gray-300">Hit your targets with unmatched accuracy</p>
            </div>

            <div className="bg-gray-800/50 p-6 rounded-lg backdrop-blur-sm">
              <h2 className="text-2xl font-semibold mb-4 text-orange-500">Power</h2>
              <p className="text-gray-300">Experience the ultimate in arrow technology</p>
            </div>

            <div className="bg-gray-800/50 p-6 rounded-lg backdrop-blur-sm">
              <h2 className="text-2xl font-semibold mb-4 text-orange-500">Performance</h2>
              <p className="text-gray-300">Unleash your potential with every shot</p>
            </div>
          </div>

          <div className="mt-12">
            <button className="bg-orange-500 hover:bg-orange-600 text-white font-bold py-3 px-8 rounded-full transition-all duration-300 transform hover:scale-105">
              Get Started
            </button>
          </div>
        </div>
      </main>

      <footer className="mt-20 py-8 border-t border-gray-800">
        <div className="container mx-auto px-4 text-center text-gray-400">
          <p>© 2025 ArrowKill. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
}
