import { WalletProvider } from "./context/WalletContext";
import WalletConnect from "./components/WalletConnect";
import TransactionForm from "./components/TransactionForm";
import WalletGenerator from "./components/WalletGenerator";
import WalletManager from "./components/WalletManager";
import { Nav } from "./header";
import { ChatInterface } from "./components/chat-interface";
import "./App.css";
import "../src/index.css";

function App() {
  return (
    <WalletProvider>
      <div className="min-h-screen bg-black text-white">
        <Nav />

        {/* Hero Section with LiquidMetal effect */}
        <section className="relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-br from-orange-900/10 via-amber-900/5 to-black"></div>
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-orange-600/5 via-transparent to-transparent"></div>

          <div className="relative max-w-7xl mx-auto px-6 py-24">
            <div className="text-center">
              <h1 className="text-6xl md:text-7xl font-bold bg-gradient-to-r from-white via-orange-200 to-amber-200 bg-clip-text text-transparent mb-6 instrument-serif-regular">
                SolMate
              </h1>
            </div>
          </div>
        </section>

        <main className="relative z-10">
          <div className="max-w-7xl mx-auto px-6 pb-24">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              <div className="space-y-8">
                <div className="relative bg-[#040404] rounded-2xl p-8 border border-[#3D3D3D] hover:border-[#BA9465] transition-all duration-600">
                  <WalletConnect />
                </div>

                <div className="relative bg-[#040404] rounded-2xl p-8 border border-[#3D3D3D] hover:border-[#BA9465] transition-all duration-600">
                  <TransactionForm />
                </div>
              </div>

              <div className="space-y-8">
                <div className="relative bg-[#040404] rounded-2xl p-8 border border-[#3D3D3D] hover:border-[#BA9465] transition-all duration-600">
                  <WalletManager />
                </div>

                <div className="relative bg-[#040404] rounded-2xl p-8 border border-[#3D3D3D] hover:border-[#BA9465] transition-all duration-600">
                  <WalletGenerator />
                </div>
              </div>
            </div>
          </div>

          <div className="max-w-7xl mx-auto px-6 pb-24">
            <ChatInterface />
          </div>
        </main>

        <footer className="border-t border-[#3D3D3D] bg-[#040404]">
          <div className="max-w-7xl mx-auto px-6 py-12">
            <div className="text-center text-white/40 font-light">
              <p>Built with React, Node.js, and Solana Web4.js</p>
            </div>
          </div>
        </footer>
      </div>
    </WalletProvider>
  );
}

export default App;
