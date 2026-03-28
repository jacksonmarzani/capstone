export default function Home() {
  return (
    <main className="min-h-screen bg-gradient-to-br from-blue-600 to-purple-600">
      {/* Navigation */}
      <nav className="backdrop-blur-md bg-black/20 sticky top-0 z-50">
        <div className="max-w-6xl mx-auto px-4 py-4 flex justify-between items-center">
          <h1 className="text-2xl font-bold text-white">Portfolio</h1>
          <div className="space-x-6 hidden md:flex">
            <a href="#about" className="text-white hover:text-blue-200 transition">About</a>
            <a href="#projects" className="text-white hover:text-blue-200 transition">Projects</a>
            <a href="#contact" className="text-white hover:text-blue-200 transition">Contact</a>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="min-h-screen flex items-center justify-center px-4">
        <div className="text-center text-white space-y-6">
          <h2 className="text-6xl font-bold">Welcome!</h2>
          <p className="text-2xl opacity-90">Build amazing things with web technologies</p>
          <button className="mt-8 px-8 py-3 bg-white text-blue-600 font-bold rounded-lg hover:bg-blue-50 transition transform hover:scale-105">
            Get Started
          </button>
        </div>
      </section>

      {/* About Section */}
      <section id="about" className="py-20 px-4 bg-white/10 backdrop-blur-sm">
        <div className="max-w-4xl mx-auto text-white space-y-6">
          <h2 className="text-4xl font-bold">About Me</h2>
          <p className="text-lg opacity-90">
            I'm a passionate developer creating beautiful and functional web experiences. 
            With expertise in modern web technologies, I bring ideas to life through code.
          </p>
        </div>
      </section>

      {/* Projects Section */}
      <section id="projects" className="py-20 px-4">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-4xl font-bold text-white mb-12">Featured Projects</h2>
          <div className="grid md:grid-cols-3 gap-8">
            {[1, 2, 3].map((i) => (
              <div key={i} className="bg-white/20 backdrop-blur-md rounded-lg p-8 hover:bg-white/30 transition">
                <div className="w-full h-40 bg-gradient-to-br from-pink-400 to-purple-400 rounded-lg mb-4"></div>
                <h3 className="text-xl font-bold text-white mb-2">Project {i}</h3>
                <p className="text-white/80">Amazing project description goes here</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer id="contact" className="bg-black/30 py-12 px-4">
        <div className="max-w-6xl mx-auto text-center text-white">
          <h2 className="text-3xl font-bold mb-6">Let's Connect</h2>
          <div className="space-x-4 mb-6">
            <a href="#" className="hover:text-blue-200 transition">Twitter</a>
            <a href="#" className="hover:text-blue-200 transition">LinkedIn</a>
            <a href="#" className="hover:text-blue-200 transition">GitHub</a>
          </div>
          <p className="opacity-75">© 2024 My Portfolio. All rights reserved.</p>
        </div>
      </footer>
    </main>
  )
}
