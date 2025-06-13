
import { Button } from '@/components/ui/button';

interface WelcomeScreenProps {
  onGetStarted: () => void;
}

const WelcomeScreen = ({ onGetStarted }: WelcomeScreenProps) => {
  return (
    <div className="min-h-screen bg-coral-gradient relative overflow-hidden flex flex-col items-center justify-center p-6">
      {/* Background wave shapes */}
      <div className="absolute inset-0">
        <div className="absolute top-0 left-0 w-full h-1/3 bg-gradient-to-b from-white/20 to-transparent rounded-b-[100px]"></div>
        <div className="absolute bottom-0 left-0 w-full h-2/3 bg-gradient-to-t from-coral-accent/40 to-transparent rounded-t-[100px]"></div>
        <div className="absolute bottom-0 right-0 w-3/4 h-1/2 bg-gradient-to-tl from-coral-secondary/30 to-transparent rounded-tl-[150px]"></div>
      </div>
      
      {/* Content */}
      <div className="relative z-10 text-center max-w-sm w-full">
        {/* Welcome text */}
        <div className="mb-32">
          <p className="text-white/80 text-sm font-light tracking-wider mb-4">WELCOME TO</p>
          <h1 className="text-5xl font-bold mb-2">
            <span className="text-gray-800">Note</span>
            <span className="text-white">Plus</span>
          </h1>
        </div>
        
        {/* Bottom section with tagline and button */}
        <div className="text-white">
          <h2 className="text-2xl font-light leading-relaxed mb-16">
            where every idea<br />
            finds its perfect<br />
            space
          </h2>
          
          <Button 
            onClick={onGetStarted}
            className="w-12 h-12 rounded-full bg-white/20 hover:bg-white/30 border-0 text-white text-xl font-light transition-all duration-200 backdrop-blur-sm"
          >
            &gt;
          </Button>
        </div>
      </div>
    </div>
  );
};

export default WelcomeScreen;
