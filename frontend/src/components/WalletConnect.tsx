import React, { useEffect, useState } from "react";
import { useWallet } from "../context/WalletContext";
import { RefreshCcw } from "lucide-react";

const WalletConnect: React.FC = () => {
  const {
    connected,
    publicKey,
    balance,
    connect,
    disconnect,
    refreshBalance,
    loading,
    myWallets,
    connectMyWallet,
  } = useWallet();
  const [showMyWallets, setShowMyWallets] = useState(false);

  const handleConnectMyWallet = async (walletPublicKey: string) => {
    await connectMyWallet(walletPublicKey);
    setShowMyWallets(false);
  };

  useEffect(() => {
    if (connected) {
      refreshBalance();
    }
    const timeout = setTimeout(() => {
      refreshBalance();
    }, 180000); // three minute
    return () => clearTimeout(timeout);
  }, [connected, refreshBalance]);

  return (
    <div className="wallet-connect">
      {!connected ? (
        <div className="connect-section">
          <button onClick={connect} className="connect-button">
            Connect New Wallet
          </button>

          {myWallets.length > 0 && (
            <div className="my-wallets-section">
              <button
                onClick={() => setShowMyWallets(!showMyWallets)}
                className="my-wallets-toggle"
              >
                My Wallets ({myWallets.length})
              </button>

              {showMyWallets && (
                <div className="my-wallets-dropdown">
                  {myWallets.map((wallet) => (
                    <div
                      key={wallet.id}
                      className="my-wallet-item"
                      onClick={() => handleConnectMyWallet(wallet.publicKey)}
                    >
                      <div className="wallet-info">
                        <div className="wallet-name">{wallet.name}</div>
                        <div className="wallet-address">
                          {wallet.publicKey.substring(0, 8)}...
                          {wallet.publicKey.substring(-8)}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>
      ) : (
        <div className="wallet-info">
          <div className="wallet-details">
            <p>
              <strong>Connected:</strong> {publicKey}
            </p>
            <p>
              <strong>Balance:</strong>{" "}
              {loading
                ? "Loading..."
                : balance !== null
                ? `${balance.toFixed(6)} SOL`
                : "Unable to fetch balance"}
            </p>
          </div>
          <div className="wallet-actions flex items-center gap-2">
            <div className="flex bg-green-500 p-2 rounded-md text-black items-center gap-2 p-2">
              <button className="" onClick={refreshBalance} disabled={loading}>
                {loading ? "Refreshing..." : "Refresh Balance"}
              </button>
              <RefreshCcw className="w-4 h-4" />
            </div>
            <button
              onClick={disconnect}
              className="p-2 text-black bg-red-500  rounded-md"
            >
              Disconnect
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default WalletConnect;
