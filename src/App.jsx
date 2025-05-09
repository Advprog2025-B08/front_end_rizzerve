function App() {
  return (
    <AuthProvider>
      <div className="min-h-screen bg-gray-100">
        <Header />
        <main className="container mx-auto px-4 py-8">
          <Routes />
        </main>
      </div>
    </AuthProvider>
  );
}