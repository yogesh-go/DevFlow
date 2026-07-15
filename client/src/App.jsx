import Loader from "./components/ui/Loader.jsx";

function App() {
  return (
    <div className="min-h-screen bg-slate-950 flex items-center justify-center">
      <Loader
        size="lg"
        text="Loading DevFlow..."
      />
    </div>
  );
}

export default App;