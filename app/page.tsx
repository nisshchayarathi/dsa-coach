import Link from "next/link";
import {
  Bot,
  Code,
  Target,
  Zap,
  CheckCircle,
  ArrowRight,
  BookOpen,
  Trophy,
  Users,
} from "lucide-react";

function App() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950">
      <nav className="fixed w-full bg-slate-900/80 backdrop-blur-md border-b border-slate-800 z-50">
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Bot className="w-8 h-8 text-blue-500" />
            <span className="text-2xl font-bold text-white">DSA Coach</span>
          </div>
          <div className="hidden md:flex items-center gap-8">
            <a
              href="#features"
              className="text-slate-300 hover:text-white transition-colors"
            >
              Features
            </a>
            <a
              href="#how-it-works"
              className="text-slate-300 hover:text-white transition-colors"
            >
              How It Works
            </a>
            <a
              href="#pricing"
              className="text-slate-300 hover:text-white transition-colors"
            >
              Pricing
            </a>
            <Link
              href={"/signin"}
              className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-all hover:shadow-lg"
            >
              Signin
            </Link>
            <Link
              href={"/signup"}
              className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-all hover:shadow-lg"
            >
              Signup
            </Link>
          </div>
        </div>
      </nav>

      <section className="pt-32 pb-20 px-6">
        <div className="max-w-7xl mx-auto">
          <div className="text-center max-w-4xl mx-auto">
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-blue-500/10 border border-blue-500/20 rounded-full text-blue-400 text-sm font-medium mb-6">
              <Zap className="w-4 h-4" />
              AI-Powered Learning
            </div>
            <h1 className="text-6xl md:text-7xl font-bold text-white mb-6 leading-tight">
              Master Data Structures
              <span className="block text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-cyan-400">
                & Algorithms
              </span>
            </h1>
            <p className="text-xl text-slate-300 mb-10 leading-relaxed">
              Your personal AI coach that adapts to your learning style. Get
              instant feedback, personalized problem recommendations, and expert
              guidance to ace your coding interviews.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <button className="group px-8 py-4 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition-all hover:shadow-xl hover:shadow-blue-500/25 text-lg font-semibold flex items-center justify-center gap-2">
                Start Learning Free
                <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </button>
              <button className="px-8 py-4 bg-slate-800 text-slate-200 rounded-xl hover:bg-slate-700 transition-all border-2 border-slate-700 text-lg font-semibold">
                Watch Demo
              </button>
            </div>
            <div className="flex items-center justify-center gap-8 mt-12 text-sm text-slate-400">
              <div className="flex items-center gap-2">
                <CheckCircle className="w-5 h-5 text-green-500" />
                No credit card required
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle className="w-5 h-5 text-green-500" />
                10,000+ problems
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle className="w-5 h-5 text-green-500" />
                Expert guidance
              </div>
            </div>
          </div>

          <div className="mt-20 relative">
            <div className="absolute inset-0 bg-gradient-to-r from-blue-600 to-cyan-600 rounded-3xl blur-3xl opacity-20"></div>
            <div className="relative bg-slate-800/50 backdrop-blur-sm rounded-2xl shadow-2xl border border-slate-700 p-8 max-w-5xl mx-auto">
              <div className="flex items-center gap-3 mb-4">
                <div className="flex gap-2">
                  <div className="w-3 h-3 rounded-full bg-red-500"></div>
                  <div className="w-3 h-3 rounded-full bg-yellow-500"></div>
                  <div className="w-3 h-3 rounded-full bg-green-500"></div>
                </div>
                <span className="text-slate-400 text-sm">
                  DSA Coach Terminal
                </span>
              </div>
              <div className="bg-slate-950 rounded-xl p-6 font-mono text-sm">
                <div className="text-green-400 mb-2">
                  &gt; Analyzing your solution...
                </div>
                <div className="text-blue-400 mb-2">
                  &gt; Time Complexity: O(n log n) ✓
                </div>
                <div className="text-yellow-400 mb-2">
                  &gt; Space Complexity: O(n) - Can be optimized
                </div>
                <div className="text-cyan-400 mb-4">
                  &gt; Suggestion: Consider using a two-pointer approach
                </div>
                <div className="text-white">
                  &gt; <span className="animate-pulse">|</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section id="features" className="py-20 px-6 bg-slate-900/50">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold text-white mb-4">
              Everything You Need to Succeed
            </h2>
            <p className="text-xl text-slate-300">
              Comprehensive tools and features designed for your interview
              success
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            <div className="group p-8 rounded-2xl bg-gradient-to-br from-blue-500/10 to-cyan-500/10 border border-blue-500/20 hover:shadow-xl hover:shadow-blue-500/10 transition-all">
              <div className="w-14 h-14 bg-blue-600 rounded-xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                <Bot className="w-7 h-7 text-white" />
              </div>
              <h3 className="text-2xl font-bold text-white mb-3">
                AI-Powered Feedback
              </h3>
              <p className="text-slate-400 leading-relaxed">
                Get instant, detailed analysis of your code with optimization
                suggestions and best practices.
              </p>
            </div>

            <div className="group p-8 rounded-2xl bg-gradient-to-br from-purple-500/10 to-pink-500/10 border border-purple-500/20 hover:shadow-xl hover:shadow-purple-500/10 transition-all">
              <div className="w-14 h-14 bg-purple-600 rounded-xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                <Target className="w-7 h-7 text-white" />
              </div>
              <h3 className="text-2xl font-bold text-white mb-3">
                Personalized Path
              </h3>
              <p className="text-slate-400 leading-relaxed">
                AI adapts to your skill level and learning pace, recommending
                the perfect problems for you.
              </p>
            </div>

            <div className="group p-8 rounded-2xl bg-gradient-to-br from-green-500/10 to-emerald-500/10 border border-green-500/20 hover:shadow-xl hover:shadow-green-500/10 transition-all">
              <div className="w-14 h-14 bg-green-600 rounded-xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                <Code className="w-7 h-7 text-white" />
              </div>
              <h3 className="text-2xl font-bold text-white mb-3">
                Real Interview Problems
              </h3>
              <p className="text-slate-400 leading-relaxed">
                Practice with problems from top tech companies like Google,
                Amazon, and Microsoft.
              </p>
            </div>

            <div className="group p-8 rounded-2xl bg-gradient-to-br from-orange-500/10 to-red-500/10 border border-orange-500/20 hover:shadow-xl hover:shadow-orange-500/10 transition-all">
              <div className="w-14 h-14 bg-orange-600 rounded-xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                <BookOpen className="w-7 h-7 text-white" />
              </div>
              <h3 className="text-2xl font-bold text-white mb-3">
                Interactive Lessons
              </h3>
              <p className="text-slate-400 leading-relaxed">
                Learn concepts with visual explanations, step-by-step guides,
                and interactive examples.
              </p>
            </div>

            <div className="group p-8 rounded-2xl bg-gradient-to-br from-cyan-500/10 to-blue-500/10 border border-cyan-500/20 hover:shadow-xl hover:shadow-cyan-500/10 transition-all">
              <div className="w-14 h-14 bg-cyan-600 rounded-xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                <Trophy className="w-7 h-7 text-white" />
              </div>
              <h3 className="text-2xl font-bold text-white mb-3">
                Track Progress
              </h3>
              <p className="text-slate-400 leading-relaxed">
                Monitor your improvement with detailed analytics and
                achievements to stay motivated.
              </p>
            </div>

            <div className="group p-8 rounded-2xl bg-gradient-to-br from-pink-500/10 to-rose-500/10 border border-pink-500/20 hover:shadow-xl hover:shadow-pink-500/10 transition-all">
              <div className="w-14 h-14 bg-pink-600 rounded-xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                <Users className="w-7 h-7 text-white" />
              </div>
              <h3 className="text-2xl font-bold text-white mb-3">
                Community Support
              </h3>
              <p className="text-slate-400 leading-relaxed">
                Join thousands of learners, share solutions, and learn from
                others' approaches.
              </p>
            </div>
          </div>
        </div>
      </section>

      <section id="how-it-works" className="py-20 px-6">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold text-white mb-4">
              How It Works
            </h2>
            <p className="text-xl text-slate-300">
              Start mastering DSA in three simple steps
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8 relative">
            <div className="hidden md:block absolute top-24 left-1/4 right-1/4 h-1 bg-gradient-to-r from-blue-600 via-cyan-600 to-green-600"></div>

            <div className="relative text-center">
              <div className="w-16 h-16 bg-blue-600 rounded-full flex items-center justify-center text-white text-2xl font-bold mx-auto mb-6 shadow-lg shadow-blue-500/25">
                1
              </div>
              <h3 className="text-2xl font-bold text-white mb-3">
                Choose Your Goal
              </h3>
              <p className="text-slate-400 leading-relaxed">
                Tell us about your target company and timeline. We'll create a
                personalized learning path just for you.
              </p>
            </div>

            <div className="relative text-center">
              <div className="w-16 h-16 bg-cyan-600 rounded-full flex items-center justify-center text-white text-2xl font-bold mx-auto mb-6 shadow-lg shadow-cyan-500/25">
                2
              </div>
              <h3 className="text-2xl font-bold text-white mb-3">
                Practice & Learn
              </h3>
              <p className="text-slate-400 leading-relaxed">
                Solve problems with real-time AI feedback. Get hints when stuck
                and learn optimal solutions.
              </p>
            </div>

            <div className="relative text-center">
              <div className="w-16 h-16 bg-green-600 rounded-full flex items-center justify-center text-white text-2xl font-bold mx-auto mb-6 shadow-lg shadow-green-500/25">
                3
              </div>
              <h3 className="text-2xl font-bold text-white mb-3">
                Ace Your Interview
              </h3>
              <p className="text-slate-400 leading-relaxed">
                Build confidence with mock interviews and expert insights. Land
                your dream job with preparation that works.
              </p>
            </div>
          </div>
        </div>
      </section>

      <section id="pricing" className="py-20 px-6 bg-slate-900/50">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold text-white mb-4">
              Simple, Transparent Pricing
            </h2>
            <p className="text-xl text-slate-300">
              Start for free, upgrade when you're ready
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
            <div className="p-8 rounded-2xl border-2 border-slate-700 hover:border-blue-600 bg-slate-800/50 transition-all">
              <h3 className="text-2xl font-bold text-white mb-2">Free</h3>
              <div className="mb-6">
                <span className="text-4xl font-bold text-white">$0</span>
                <span className="text-slate-400">/month</span>
              </div>
              <ul className="space-y-4 mb-8">
                <li className="flex items-start gap-3">
                  <CheckCircle className="w-5 h-5 text-green-500 mt-1 flex-shrink-0" />
                  <span className="text-slate-300">50 problems per month</span>
                </li>
                <li className="flex items-start gap-3">
                  <CheckCircle className="w-5 h-5 text-green-500 mt-1 flex-shrink-0" />
                  <span className="text-slate-300">Basic AI feedback</span>
                </li>
                <li className="flex items-start gap-3">
                  <CheckCircle className="w-5 h-5 text-green-500 mt-1 flex-shrink-0" />
                  <span className="text-slate-300">Community access</span>
                </li>
              </ul>
              <button className="w-full py-3 bg-slate-700 text-white rounded-xl hover:bg-slate-600 transition-all font-semibold">
                Get Started
              </button>
            </div>

            <div className="p-8 rounded-2xl bg-gradient-to-br from-blue-600 to-cyan-600 text-white relative shadow-2xl shadow-blue-500/25 transform md:scale-105">
              <div className="absolute -top-4 left-1/2 -translate-x-1/2 px-4 py-1 bg-yellow-400 text-slate-900 rounded-full text-sm font-bold">
                Most Popular
              </div>
              <h3 className="text-2xl font-bold mb-2">Pro</h3>
              <div className="mb-6">
                <span className="text-4xl font-bold">$29</span>
                <span className="opacity-90">/month</span>
              </div>
              <ul className="space-y-4 mb-8">
                <li className="flex items-start gap-3">
                  <CheckCircle className="w-5 h-5 flex-shrink-0 mt-1" />
                  <span>Unlimited problems</span>
                </li>
                <li className="flex items-start gap-3">
                  <CheckCircle className="w-5 h-5 flex-shrink-0 mt-1" />
                  <span>Advanced AI coaching</span>
                </li>
                <li className="flex items-start gap-3">
                  <CheckCircle className="w-5 h-5 flex-shrink-0 mt-1" />
                  <span>Personalized learning path</span>
                </li>
                <li className="flex items-start gap-3">
                  <CheckCircle className="w-5 h-5 flex-shrink-0 mt-1" />
                  <span>Mock interviews</span>
                </li>
                <li className="flex items-start gap-3">
                  <CheckCircle className="w-5 h-5 flex-shrink-0 mt-1" />
                  <span>Priority support</span>
                </li>
              </ul>
              <button className="w-full py-3 bg-white text-blue-600 rounded-xl hover:bg-slate-50 transition-all font-semibold">
                Start Free Trial
              </button>
            </div>

            <div className="p-8 rounded-2xl border-2 border-slate-700 hover:border-blue-600 bg-slate-800/50 transition-all">
              <h3 className="text-2xl font-bold text-white mb-2">Enterprise</h3>
              <div className="mb-6">
                <span className="text-4xl font-bold text-white">Custom</span>
              </div>
              <ul className="space-y-4 mb-8">
                <li className="flex items-start gap-3">
                  <CheckCircle className="w-5 h-5 text-green-500 mt-1 flex-shrink-0" />
                  <span className="text-slate-300">Everything in Pro</span>
                </li>
                <li className="flex items-start gap-3">
                  <CheckCircle className="w-5 h-5 text-green-500 mt-1 flex-shrink-0" />
                  <span className="text-slate-300">Team management</span>
                </li>
                <li className="flex items-start gap-3">
                  <CheckCircle className="w-5 h-5 text-green-500 mt-1 flex-shrink-0" />
                  <span className="text-slate-300">Custom integrations</span>
                </li>
                <li className="flex items-start gap-3">
                  <CheckCircle className="w-5 h-5 text-green-500 mt-1 flex-shrink-0" />
                  <span className="text-slate-300">Dedicated support</span>
                </li>
              </ul>
              <button className="w-full py-3 bg-slate-700 text-white rounded-xl hover:bg-slate-600 transition-all font-semibold">
                Contact Sales
              </button>
            </div>
          </div>
        </div>
      </section>

      <section className="py-20 px-6 bg-gradient-to-br from-blue-600 to-cyan-600">
        <div className="max-w-4xl mx-auto text-center text-white">
          <h2 className="text-4xl md:text-5xl font-bold mb-6">
            Ready to Ace Your Coding Interview?
          </h2>
          <p className="text-xl mb-10 opacity-90">
            Join thousands of developers who've landed their dream jobs with DSA
            Coach
          </p>
          <button className="group px-8 py-4 bg-white text-blue-600 rounded-xl hover:bg-slate-50 transition-all hover:shadow-2xl text-lg font-semibold inline-flex items-center gap-2">
            Start Your Free Trial
            <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
          </button>
        </div>
      </section>

      <footer className="py-12 px-6 bg-slate-900 text-white">
        <div className="max-w-7xl mx-auto">
          <div className="grid md:grid-cols-4 gap-8 mb-8">
            <div>
              <div className="flex items-center gap-2 mb-4">
                <Bot className="w-6 h-6" />
                <span className="text-xl font-bold">DSA Coach</span>
              </div>
              <p className="text-slate-400 text-sm">
                Your AI-powered companion for mastering data structures and
                algorithms.
              </p>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Product</h4>
              <ul className="space-y-2 text-sm text-slate-400">
                <li>
                  <a href="#" className="hover:text-white transition-colors">
                    Features
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-white transition-colors">
                    Pricing
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-white transition-colors">
                    Testimonials
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-white transition-colors">
                    FAQ
                  </a>
                </li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Company</h4>
              <ul className="space-y-2 text-sm text-slate-400">
                <li>
                  <a href="#" className="hover:text-white transition-colors">
                    About
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-white transition-colors">
                    Blog
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-white transition-colors">
                    Careers
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-white transition-colors">
                    Contact
                  </a>
                </li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Legal</h4>
              <ul className="space-y-2 text-sm text-slate-400">
                <li>
                  <a href="#" className="hover:text-white transition-colors">
                    Privacy
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-white transition-colors">
                    Terms
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-white transition-colors">
                    Security
                  </a>
                </li>
              </ul>
            </div>
          </div>
          <div className="pt-8 border-t border-slate-800 text-center text-sm text-slate-400">
            <p>&copy; 2025 DSA Coach. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}

export default App;
