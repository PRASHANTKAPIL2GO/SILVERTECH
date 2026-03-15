import Link from 'next/link';
import Button from '@/components/ui/Button';

const features = [
  {
    icon: '📧',
    title: 'Email Skills',
    desc: 'Learn to send, receive, and manage emails safely and confidently.',
    color: 'from-blue-500 to-blue-600',
    bg: 'bg-blue-50',
  },
  {
    icon: '🛡️',
    title: 'Scam Protection',
    desc: 'Recognise and avoid common online scams and fraud before they happen.',
    color: 'from-violet-500 to-violet-600',
    bg: 'bg-violet-50',
  },
  {
    icon: '📹',
    title: 'Video Calls',
    desc: 'Stay connected with loved ones through easy video calling.',
    color: 'from-emerald-500 to-teal-500',
    bg: 'bg-emerald-50',
  },
];

const trustItems = [
  ['🔤', 'Large, clear text that is easy to read'],
  ['🎯', 'Lessons that adapt to your skill level'],
  ['🤝', 'A supportive mentorship community'],
  ['🔒', 'Safe and private — your data is protected'],
];

const stats = [
  { value: '10,000+', label: 'Seniors learning' },
  { value: '3', label: 'Expert modules' },
  { value: '100%', label: 'Free forever' },
];

export default function LandingPage() {
  return (
    <div className="animate-in fade-in duration-700">
      {/* ── Hero ────────────────────────────────────────────── */}
      <section className="relative overflow-hidden bg-slate-900 text-white py-28 md:py-36" aria-label="Welcome section">
        {/* Decorative blobs */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none" aria-hidden="true">
          <div className="absolute -top-20 -right-20 w-80 h-80 rounded-full bg-violet-600/20 blur-3xl" />
          <div className="absolute bottom-0 -left-20 w-96 h-96 rounded-full bg-blue-600/20 blur-3xl" />
        </div>

        <div className="mx-auto w-full max-w-7xl px-4 sm:px-6 lg:px-8 relative text-center">
          <div
            className="inline-flex items-center justify-center w-24 h-24 rounded-3xl bg-gradient-to-br from-blue-500 to-violet-600 shadow-2xl shadow-blue-900/40 mb-8 animate-bounce"
            aria-hidden="true"
          >
            <span className="text-5xl">💡</span>
          </div>

          <h1 className="font-display text-5xl md:text-6xl font-extrabold mb-6 leading-tight tracking-tight">
            Welcome to{' '}
            <span className="bg-gradient-to-r from-yellow-300 to-orange-300 bg-clip-text text-transparent">
              SilverTech
            </span>
          </h1>

          <p className="text-xl text-blue-100/90 mb-10 max-w-2xl mx-auto leading-relaxed">
            A friendly digital literacy platform designed just for seniors. Learn
            internet skills at your own pace — safely, clearly, and confidently.
          </p>

          <div className="flex flex-wrap gap-4 justify-center mb-14">
            <Link href="/auth/register">
              <Button
                size="lg"
                className="bg-gradient-to-r from-yellow-400 to-orange-400 text-gray-900 hover:from-yellow-300 hover:to-orange-300 shadow-xl shadow-yellow-500/30 font-extrabold border-0"
              >
                🚀 Get Started — It&apos;s Free
              </Button>
            </Link>
            <Link href="/auth/login">
              <Button
                size="lg"
                variant="ghost"
                className="text-white border-2 border-white/30 hover:bg-white/10 backdrop-blur-sm"
              >
                Log In
              </Button>
            </Link>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-3 gap-6 max-w-lg mx-auto">
            {stats.map((s) => (
              <div key={s.label} className="text-center">
                <div className="text-2xl font-extrabold font-display text-white">{s.value}</div>
                <div className="text-sm text-blue-200">{s.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Features ────────────────────────────────────────── */}
      <section className="py-24 mx-auto w-full max-w-7xl px-4 sm:px-6 lg:px-8" aria-label="What you will learn">
        <div className="text-center mb-16">
          <span className="inline-block px-4 py-1.5 bg-blue-100 text-blue-700 rounded-full text-sm font-semibold mb-4 tracking-wide uppercase">
            Our Modules
          </span>
          <h2 className="font-display text-4xl md:text-5xl font-extrabold text-slate-900 mb-4 leading-tight">
            What You Will Learn
          </h2>
          <p className="text-slate-500 text-lg max-w-xl mx-auto">
            Three easy-to-follow modules designed specifically for seniors, with big
            text, simple words, and friendly quizzes.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {features.map((f) => (
            <div
              key={f.title}
              className="group bg-white rounded-3xl shadow-[0_1px_3px_rgb(0_0_0/0.04),_0_8px_32px_rgb(0_0_0/0.07)] border border-slate-100 p-8 text-center hover:-translate-y-2 hover:shadow-[0_4px_8px_rgb(0_0_0/0.04),_0_20px_48px_rgb(0_0_0/0.12)] transition-all duration-300"
            >
              <div
                className={`inline-flex items-center justify-center w-20 h-20 rounded-2xl bg-gradient-to-br ${f.color} shadow-lg mb-6 group-hover:scale-110 transition-transform duration-300`}
              >
                <span className="text-4xl">{f.icon}</span>
              </div>
              <h3 className="font-display text-2xl font-bold text-slate-900 mb-3">{f.title}</h3>
              <p className="text-slate-500 text-lg leading-relaxed">{f.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ── Why SilverTech ──────────────────────────────────── */}
      <section className="py-24 bg-gradient-to-b from-slate-50 to-white" aria-label="Why SilverTech">
        <div className="mx-auto w-full max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="font-display text-4xl md:text-5xl font-extrabold text-slate-900 mb-4">
              Designed With You in Mind
            </h2>
            <p className="text-slate-500 text-lg max-w-md mx-auto">
              Everything about SilverTech is built around what seniors need.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-5 max-w-3xl mx-auto">
            {trustItems.map(([icon, text]) => (
              <div
                key={text}
                className="group flex items-center gap-5 bg-white rounded-2xl p-6 border border-slate-100 shadow-[0_1px_3px_rgb(0_0_0/0.04),_0_8px_32px_rgb(0_0_0/0.06)] hover:border-blue-200 hover:shadow-[0_4px_24px_rgb(37_99_235/0.1)] transition-all duration-300"
              >
                <span
                  className="text-3xl flex-shrink-0 w-14 h-14 bg-blue-50 group-hover:bg-blue-100 rounded-2xl flex items-center justify-center transition-colors duration-300"
                  aria-hidden="true"
                >
                  {icon}
                </span>
                <p className="text-lg font-semibold text-slate-800">{text}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── CTA ─────────────────────────────────────────────── */}
      <section className="py-24" aria-label="Sign up call to action">
        <div className="mx-auto w-full max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-blue-600 via-blue-700 to-violet-700 text-white p-12 md:p-16 text-center shadow-2xl shadow-blue-200">
            <div className="absolute inset-0 overflow-hidden pointer-events-none" aria-hidden="true">
              <div className="absolute -top-10 -right-10 w-64 h-64 rounded-full bg-white/5 blur-2xl" />
              <div className="absolute -bottom-16 -left-16 w-80 h-80 rounded-full bg-violet-600/20 blur-3xl" />
            </div>
            <div className="relative">
              <h2 className="font-display text-4xl md:text-5xl font-extrabold mb-5 leading-tight">
                Ready to Begin Your Digital Journey?
              </h2>
              <p className="text-xl text-blue-100 mb-10 max-w-xl mx-auto">
                Join SilverTech today — completely free. No experience needed!
              </p>
              <Link href="/auth/register">
                <Button
                  size="lg"
                  className="bg-white text-blue-700 hover:bg-blue-50 shadow-xl shadow-blue-900/20 font-extrabold border-0"
                >
                  Join SilverTech Today →
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* ── Footer ──────────────────────────────────────────── */}
      <footer className="bg-slate-950 text-slate-400 py-12 text-center">
        <div className="mx-auto w-full max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-center gap-2 mb-4">
            <div className="w-7 h-7 rounded-lg bg-gradient-to-br from-blue-600 to-violet-600 flex items-center justify-center">
              <span className="text-sm">💡</span>
            </div>
            <span className="font-display font-bold text-white text-lg">SilverTech</span>
          </div>
          <p className="text-slate-500">© {new Date().getFullYear()} SilverTech. All rights reserved.</p>
          <p className="mt-1 text-slate-600 text-sm">Made with ❤️ for seniors everywhere.</p>
        </div>
      </footer>
    </div>
  );
}
