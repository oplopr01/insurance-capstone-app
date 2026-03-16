import { Link } from "react-router-dom";

function LandingPage() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-[#020617] via-[#030d24] to-[#020617] text-white">

      {/* NAVBAR */}
      <nav className="max-w-7xl mx-auto px-6 py-6 flex justify-between items-center">
        <h1 className="text-indigo-400">
          Insure<span className="text-indigo-400">Sphere</span>
        </h1>

        <Link
          to="/login"
          className="px-5 py-2 rounded-lg bg-indigo-500 hover:bg-indigo-600 transition"
        >
          Login
        </Link>
      </nav>

      {/* HERO */}
      <section className="text-center py-20 px-6">

        <h1 className="text-5xl font-bold text-white mb-6 drop-shadow-lg">
  Insurance & Reinsurance
  <span className="text-indigo-400"> Management</span>
</h1>

        <p className="text-gray-300 max-w-2xl mx-auto mb-8">
          Enterprise workflow simulation for managing insurance policies,
          claims processing, and automated reinsurance risk allocation.
        </p>

        <Link
          to="/login"
          className="px-8 py-3 rounded-xl bg-gradient-to-r from-indigo-500 to-cyan-500 hover:opacity-90"
        >
          Login to Dashboard
        </Link>

      </section>

      {/* FEATURES */}
      <section className="max-w-6xl mx-auto px-6 py-16">

        <h2 className="text-3xl font-semibold text-white text-center mb-12">
          Key Features
        </h2>

        <div className="grid md:grid-cols-4 gap-6">

          <div className="bg-white/5 backdrop-blur-lg border border-white/10 p-6 rounded-xl">
            <h3 className="font-semibold text-white mb-2">Policy Lifecycle</h3>
            <p className="text-gray-300 text-sm">
              Create and manage policies through structured workflows.
            </p>
          </div>

          <div className="bg-white/5 backdrop-blur-lg border border-white/10 p-6 rounded-xl">
            <h3 className="font-semibold text-white mb-2">Claims Processing</h3>
            <p className="text-gray-300 text-sm">
              Submit and process claims with lifecycle tracking.
            </p>
          </div>

          <div className="bg-white/5 backdrop-blur-lg border border-white/10 p-6 rounded-xl">
            <h3 className="font-semibold text-white mb-2">Reinsurance Allocation</h3>
            <p className="text-gray-300 text-sm">
              Automatically distribute policy risk across reinsurers.
            </p>
          </div>

          <div className="bg-white/5 backdrop-blur-lg border border-white/10 p-6 rounded-xl">
            <h3 className="font-semibold text-white mb-2">Role Based Access</h3>
            <p className="text-gray-300 text-sm">
              JWT authentication with secure role permissions.
            </p>
          </div>

        </div>

      </section>

      {/* TECH STACK */}
      <section className="max-w-5xl mx-auto px-6 py-16 text-center">

        <h2 className="text-3xl font-semibold text-white mb-10">Tech Stack</h2>

        <div className="grid md:grid-cols-3 gap-10 text-gray-300">

          <div>
            <h4 className="font-semibold text-white mb-2 text-white">Frontend</h4>
            <p>React • Tailwind • React Router</p>
          </div>

          <div>
            <h4 className="font-semibold text-white mb-2 text-white">Backend</h4>
            <p>Node.js • Express • JWT Auth</p>
          </div>

          <div>
            <h4 className="font-semibold text-white mb-2 text-white">Database</h4>
            <p>MongoDB • Mongoose • Atlas</p>
          </div>

        </div>

      </section>

      {/* DEMO CREDENTIALS */}
      <section className="max-w-4xl mx-auto px-6 py-16">

        <h2 className="text-3xl font-semibold text-center mb-8">
          Demo Credentials
        </h2>

        <div className="bg-white/5 border border-white/10 rounded-xl p-8 backdrop-blur-lg">

          <div className="mb-6">
            <p className="font-semibold text-indigo-400">Underwriter</p>
            <p className="text-gray-400">Email: underwriter@demo.com</p>
            <p className="text-gray-400">Password: demo123</p>
          </div>

          <div className="mb-6">
            <p className="font-semibold text-indigo-400">Claims Adjuster</p>
            <p className="text-gray-400">Email: claims@demo.com</p>
            <p className="text-gray-400">Password: demo123</p>
          </div>

          <div>
            <p className="font-semibold text-indigo-400">Admin</p>
            <p className="text-gray-400">Email: admin1</p>
            <p className="text-gray-400">Password: password123</p>
          </div>

        </div>

      </section>

      {/* FOOTER */}
      <footer className="text-center text-gray-500 pb-10">
        © 2026 InsureSphere. All rights reserved.
      </footer>

    </div>
  );
}

export default LandingPage;