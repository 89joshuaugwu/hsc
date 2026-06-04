export default function HomePage() {
  return (
    <main className="min-h-screen flex flex-col items-center justify-center bg-ivory">
      {/* Hero placeholder — will be replaced by HeroSection component */}
      <div className="text-center space-y-6 px-4">
        <p className="font-display text-sm tracking-[0.3em] text-gold-500 uppercase">
          Dominus Regnant · Arise, Shine
        </p>
        <h1 className="font-display text-4xl md:text-6xl lg:text-7xl font-bold text-navy-500 uppercase tracking-wide">
          Holy Spirit Chapel
        </h1>
        <p className="font-display text-xl md:text-2xl text-chapel-400">
          ESUT Agbani
        </p>
        <div className="w-24 h-px bg-gold-500 mx-auto" />
        <p className="font-heading text-lg text-text-muted italic max-w-xl mx-auto">
          A vibrant Anglican community of faith, worship, and fellowship at
          Enugu State University of Technology.
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center pt-4">
          <a
            href="/about"
            className="inline-flex items-center justify-center px-8 py-3 bg-gold-500 text-navy-700 font-body font-bold rounded-full hover:bg-gold-400 transition-colors shadow-gold"
          >
            Learn More
          </a>
          <a
            href="/departments"
            className="inline-flex items-center justify-center px-8 py-3 border-2 border-chapel-400 text-chapel-400 font-body font-semibold rounded-full hover:bg-chapel-400 hover:text-white transition-colors"
          >
            Our Departments
          </a>
        </div>
      </div>
    </main>
  );
}
