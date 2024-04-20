// pages/index.tsx

import { FC, useEffect } from 'react';
import  FloodMap  from '../../components/FloodMap'; // Import the FloodMap component
import { RequestAirdrop } from '../../components/RequestAirdrop'; // Import the RequestAirdrop component
import { useWallet, useConnection } from '@solana/wallet-adapter-react';
import useUserSOLBalanceStore from '../../stores/useUserSOLBalanceStore';
import pkg from '../../../package.json';

declare global {
  interface Window {
    Jupiter: {
      init: (options: any) => void; // Adjust the type of options as per your requirements
    };
  }
}

export const HomeView: FC = () => {
  const wallet = useWallet();
  const { connection } = useConnection();

  const balance = useUserSOLBalanceStore((s) => s.balance)
  const { getUserSOLBalance } = useUserSOLBalanceStore()

  useEffect(() => {
    window.Jupiter.init({
      displayMode: "integrated",
      integratedTargetId: "integrated-terminal",
      endpoint: "https://solana-api.projectserum.com",
      formProps: {
        initialOutputMint: "DezXAZ8z7PnrnRJjz3wXBoRgixCa6xjnB7YaB1pPB263",
      },
    });
  }, []);

  useEffect(() => {
    if (wallet.publicKey) {
      console.log(wallet.publicKey.toBase58())
      getUserSOLBalance(wallet.publicKey, connection)
    }
  }, [wallet.publicKey, connection, getUserSOLBalance])

  return (
    <div className="md:hero mx-auto p-4">
      <div className="md:hero-content flex flex-col">
        <div className='mt-6'>
          <h1 className="text-center text-5xl md:pl-12 font-bold  bg-clip-text bg-gradient-to-br mb-4">
          🌧️🌧️🌊🌊🏊🏽🏊🏽 $FLOOD 🏊🏽🏊🏽🌊🌊🌧️🌧️
          </h1>
        </div>
        <div className="w-full"> {/* Set FloodMap width to full */}
          <FloodMap />
        </div>
        <h4 className="md:w-full text-2x1 md:text-4xl text-center text-slate-300 my-2">
          <p>Get realtime flood info.</p>
          <p className='text-slate-500 text-2x1 leading-relaxed'>Buy $Flood coin.</p>
        </h4>
        <div className="relative group">
          <div className="absolute -inset-0.5 bg-gradient-to-r from-indigo-500 to-indigo-500 rounded-lg blur opacity-40 animate-tilt"></div>
          <div id="integrated-terminal"></div>
        </div>

      </div>
    </div>
  );
};

export default HomeView;
