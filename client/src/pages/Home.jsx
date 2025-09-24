export default function Home() {
  console.log('[Home] mounted')
  return (
    <section className="space-y-6">
      <div className="text-xs text-gray-500">[Home component rendered]</div>
      <div className="text-center space-y-4">
        <h1 className="text-4xl sm:text-5xl font-bold tracking-tight">Build websites faster with drag & drop + code generation</h1>
        <p className="text-gray-600 max-w-2xl mx-auto">
          Our builder lets you visually design with drag & drop components, then exports clean, production-ready code.
        </p>
        <div className="flex items-center justify-center gap-3">
          <a href="/signup" className="inline-flex items-center rounded-md bg-blue-600 px-4 py-2 text-white font-medium hover:bg-blue-700">Get Started</a>
          <a href="/login" className="inline-flex items-center rounded-md border px-4 py-2 font-medium text-gray-700 hover:bg-gray-50">Login</a>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="rounded-lg border bg-white p-5">
          <h3 className="font-semibold mb-1">Drag & Drop</h3>
          <p className="text-sm text-gray-600">Compose pages quickly using a library of ready components.</p>
        </div>
        <div className="rounded-lg border bg-white p-5">
          <h3 className="font-semibold mb-1">Code Generation</h3>
          <p className="text-sm text-gray-600">Export clean React + Tailwind code or static HTML/CSS.</p>
        </div>
        <div className="rounded-lg border bg-white p-5">
          <h3 className="font-semibold mb-1">Projects</h3>
          <p className="text-sm text-gray-600">Create and manage multiple projects from your dashboard.</p>
        </div>
      </div>
    </section>
  )
}
