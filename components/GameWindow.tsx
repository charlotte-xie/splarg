import { ReactNode } from 'react';

interface GameWindowProps {
  children: ReactNode;
}

export default function GameWindow({ children }: GameWindowProps) {
  return (
    <div className="game-window">
      {children}
    </div>
  );
} 