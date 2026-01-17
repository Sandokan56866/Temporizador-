
import React, { useState, useEffect, useCallback, useRef } from 'react';
import { audioService } from './services/audioService';

const App: React.FC = () => {
  const [timeLeft, setTimeLeft] = useState(270); // 4:30 default
  const [initialTime, setInitialTime] = useState(270);
  const [isActive, setIsActive] = useState(false);
  const [soundEnabled, setSoundEnabled] = useState(true);
  const [vibrateEnabled, setVibrateEnabled] = useState(true);
  const [showHelp, setShowHelp] = useState(false);
  
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const formatTime = (seconds: number) => {
    const totalSeconds = Math.max(0, seconds);
    const m = Math.floor(totalSeconds / 60);
    const s = Math.ceil(totalSeconds % 60);
    return {
      minutes: m.toString().padStart(2, '0'),
      seconds: (s === 60 ? 0 : s).toString().padStart(2, '0'),
      displayMinutes: (s === 60 ? m + 1 : m).toString().padStart(2, '0')
    };
  };

  const stopTimer = useCallback(() => {
    if (timerRef.current) {
      clearInterval(timerRef.current);
      timerRef.current = null;
    }
    setIsActive(false);
  }, []);

  const triggerAlarm = useCallback(() => {
    if (vibrateEnabled && navigator.vibrate) {
      navigator.vibrate([300, 100, 300, 100, 500]);
    }
    if (soundEnabled) {
      audioService.playAlarm();
    }
  }, [vibrateEnabled, soundEnabled]);

  useEffect(() => {
    if (isActive && timeLeft > 0) {
      timerRef.current = setInterval(() => {
        setTimeLeft((prev) => {
          if (prev <= 0.1) {
            stopTimer();
            triggerAlarm();
            return 0;
          }
          return prev - 0.1;
        });
      }, 100);
    } else {
      if (timerRef.current) clearInterval(timerRef.current);
    }
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [isActive, timeLeft, stopTimer, triggerAlarm]);

  const handleStart = () => {
    if (timeLeft <= 0) {
      setTimeLeft(initialTime);
      setIsActive(true);
      return;
    }
    setIsActive(!isActive);
  };

  const handleReset = () => {
    stopTimer();
    setTimeLeft(initialTime);
  };

  const setPreset = (seconds: number) => {
    stopTimer();
    const validSeconds = Math.max(0, seconds);
    setInitialTime(validSeconds);
    setTimeLeft(validSeconds);
  };

  const progress = initialTime > 0 ? (timeLeft / initialTime) * 100 : 0;
  const strokeDashoffset = 276.46 - (276.46 * progress) / 100;

  const time = formatTime(timeLeft);

  return (
    <div className="relative flex h-screen w-full flex-col overflow-hidden max-w-md mx-auto bg-background-dark font-display text-white selection:bg-primary selection:text-black">
      {/* Help Modal */}
      {showHelp && (
        <div className="absolute inset-0 z-50 bg-black flex flex-col p-8 animate-in fade-in slide-in-from-bottom-4 duration-300">
          <div className="flex justify-between items-center mb-10">
            <h2 className="text-2xl font-bold text-primary uppercase tracking-tighter">Instruções</h2>
            <button 
              onClick={() => setShowHelp(false)}
              className="size-12 rounded-full border-2 border-primary text-primary flex items-center justify-center active:scale-90 transition-transform"
            >
              <span className="material-symbols-outlined text-3xl">close</span>
            </button>
          </div>
          
          <div className="flex-1 space-y-8">
            <div className="space-y-2">
              <h3 className="text-primary font-bold uppercase text-xs tracking-widest">Controle Principal</h3>
              <p className="text-white/70 text-sm leading-relaxed">
                Clique no <span className="text-primary font-bold">Círculo Central</span> ou no botão <span className="text-primary font-bold">Iniciar</span> para começar ou pausar a contagem.
              </p>
            </div>
            
            <div className="space-y-2">
              <h3 className="text-primary font-bold uppercase text-xs tracking-widest">Acesso Rápido</h3>
              <p className="text-white/70 text-sm leading-relaxed">
                Use os botões de <span className="text-primary font-bold">30s, 40s ou 2m</span> para configurar tempos esportivos comuns instantaneamente.
              </p>
            </div>

            <div className="space-y-2">
              <h3 className="text-primary font-bold uppercase text-xs tracking-widest">Tempo Personalizado</h3>
              <p className="text-white/70 text-sm leading-relaxed">
                Ajuste manualmente os minutos e segundos no campo de <span className="text-primary font-bold">Tempo Personalizado</span> na parte inferior.
              </p>
            </div>

            <div className="space-y-2">
              <h3 className="text-primary font-bold uppercase text-xs tracking-widest">Alertas</h3>
              <p className="text-white/70 text-sm leading-relaxed">
                O aplicativo emitirá um <span className="text-primary font-bold">alerta sonoro</span> e uma <span className="text-primary font-bold">vibração</span> (se suportado pelo dispositivo) quando o cronômetro chegar a zero.
              </p>
            </div>
          </div>

          <button 
            onClick={() => setShowHelp(false)}
            className="w-full h-16 bg-primary text-black font-bold uppercase tracking-widest rounded-2xl active:scale-95 transition-all mt-6"
          >
            Entendido
          </button>
        </div>
      )}

      {/* Top Progress Line */}
      <div className="h-1.5 w-full bg-surface/50">
        <div 
          className="h-full bg-primary transition-all duration-300" 
          style={{ width: `${progress}%` }}
        ></div>
      </div>

      {/* Header Controls */}
      <div className="flex items-center justify-between px-6 py-8">
        <div className="flex gap-3">
          <button 
            onClick={() => setSoundEnabled(!soundEnabled)}
            className={`flex items-center justify-center size-11 rounded-lg border-2 transition-colors ${soundEnabled ? 'border-primary text-primary' : 'border-surface text-white/30'}`}
          >
            <span className="material-symbols-outlined text-2xl">
              {soundEnabled ? 'volume_up' : 'volume_off'}
            </span>
          </button>
          <button 
            onClick={() => setVibrateEnabled(!vibrateEnabled)}
            className={`flex items-center justify-center size-11 rounded-lg border-2 transition-colors ${vibrateEnabled ? 'border-primary text-primary' : 'border-surface text-white/30'}`}
          >
            <span className="material-symbols-outlined text-2xl">
              {vibrateEnabled ? 'vibration' : 'vibration_lock'}
            </span>
          </button>
        </div>
        
        <div className="flex items-center gap-4">
          <div className="text-[10px] font-bold tracking-[0.2em] text-primary uppercase">
            Nitro Timer
          </div>
          <button 
            onClick={() => setShowHelp(true)}
            className="flex items-center justify-center size-10 rounded-full border border-primary/30 text-primary active:bg-primary/10 transition-colors"
          >
            <span className="material-symbols-outlined text-xl">help</span>
          </button>
        </div>
      </div>

      {/* Main Display Area - Centered inside the circle */}
      <div className="flex-1 flex flex-col items-center justify-center relative">
        <div 
          onClick={handleStart}
          className="relative w-[340px] h-[340px] flex items-center justify-center mx-auto cursor-pointer group active:scale-95 transition-transform"
          role="button"
          aria-label={isActive ? "Pause timer" : "Start timer"}
        >
          <svg className="absolute inset-0 circular-progress w-full h-full" viewBox="0 0 100 100">
            <circle 
              className="text-surface" 
              cx="50" cy="50" fill="transparent" r="44" 
              stroke="currentColor" strokeWidth="9"
            ></circle>
            <circle 
              className={`text-primary transition-all duration-300 ease-linear ${isActive ? 'timer-glow' : ''}`} 
              cx="50" cy="50" fill="transparent" r="44" 
              stroke="currentColor" strokeWidth="9"
              strokeDasharray="276.46" 
              strokeDashoffset={strokeDashoffset} 
              strokeLinecap="round" 
            ></circle>
          </svg>
          
          <div className="flex flex-col items-center relative z-10 w-full text-center px-4">
            <div className="flex items-center justify-center">
              <span className={`text-[84px] font-bold leading-none tracking-tight text-primary transition-all duration-300 ${isActive ? 'timer-glow scale-105' : 'scale-100 opacity-80 group-hover:opacity-100'}`}>
                {time.displayMinutes}:{time.seconds}
              </span>
            </div>
            <div className="flex gap-14 mt-4 justify-center w-full">
              <p className="text-[10px] font-bold tracking-[0.2em] text-primary/60 uppercase">Minutes</p>
              <p className="text-[10px] font-bold tracking-[0.2em] text-primary/60 uppercase">Seconds</p>
            </div>
          </div>
        </div>
      </div>

      {/* Preset Cards */}
      <div className="px-6 py-4">
        <div className="grid grid-cols-3 gap-4">
          <button 
            onClick={() => setPreset(30)}
            className="flex flex-col items-center justify-center h-20 bg-surface/40 rounded-2xl active:scale-95 transition-transform"
          >
            <span className="text-primary text-2xl font-bold">30s</span>
          </button>
          <button 
            onClick={() => setPreset(40)}
            className="flex flex-col items-center justify-center h-20 bg-surface/40 rounded-2xl active:scale-95 transition-transform"
          >
            <span className="text-primary text-2xl font-bold">40s</span>
          </button>
          <button 
            onClick={() => setPreset(120)}
            className="flex flex-col items-center justify-center h-20 bg-surface/40 rounded-2xl active:scale-95 transition-transform"
          >
            <span className="text-primary text-2xl font-bold">2m</span>
          </button>
        </div>
      </div>

      {/* Custom Time Selector */}
      <div className="px-6 py-4">
        <div className="flex flex-col gap-3">
          <div className="flex justify-between items-center">
            <h3 className="text-[10px] font-bold tracking-[0.2em] text-primary uppercase">Set Custom Time</h3>
            <span className="material-symbols-outlined text-primary text-lg">settings_input_component</span>
          </div>
          <div className="flex items-center h-[72px] bg-surface/40 border border-primary/20 rounded-2xl px-6 overflow-hidden">
            <div className="flex-1 flex justify-center items-center text-white/20 font-bold gap-4">
              <div className="flex items-center gap-2">
                <input 
                  type="number"
                  value={Math.floor(initialTime / 60)}
                  className="w-12 bg-transparent text-2xl text-primary text-center outline-none border-b border-primary/20 focus:border-primary"
                  onChange={(e) => {
                    const m = parseInt(e.target.value) || 0;
                    setPreset(m * 60 + (initialTime % 60));
                  }}
                />
                <span className="text-[10px] text-white/30 uppercase">min</span>
              </div>
              <span className="text-2xl text-primary">:</span>
              <div className="flex items-center gap-2">
                <input 
                  type="number"
                  value={initialTime % 60}
                  className="w-12 bg-transparent text-2xl text-primary text-center outline-none border-b border-primary/20 focus:border-primary"
                  onChange={(e) => {
                    const s = parseInt(e.target.value) || 0;
                    setPreset(Math.floor(initialTime / 60) * 60 + s);
                  }}
                />
                <span className="text-[10px] text-white/30 uppercase">sec</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Actions */}
      <div className="px-6 pt-4 pb-12 flex gap-3">
        <button 
          onClick={handleStart}
          className={`flex-1 h-20 text-2xl font-bold flex items-center justify-center rounded-2xl uppercase tracking-widest active:scale-95 transition-all ${isActive ? 'bg-surface text-primary border-2 border-primary' : 'bg-primary text-black'}`}
        >
          <span className="material-symbols-outlined mr-3 text-3xl" style={{fontVariationSettings: "'FILL' 1"}}>
            {isActive ? 'pause' : 'play_arrow'}
          </span>
          {isActive ? 'Pause' : 'Start'}
        </button>
        <button 
          onClick={handleReset}
          className="w-20 h-20 bg-surface/40 text-primary flex items-center justify-center rounded-2xl border border-primary/20 active:scale-95 active:rotate-180 transition-all"
        >
          <span className="material-symbols-outlined text-3xl">refresh</span>
        </button>
      </div>

      {/* Interaction Bar */}
      <div className="h-1.5 w-32 bg-white/10 mx-auto rounded-full mb-2"></div>
    </div>
  );
};

export default App;
