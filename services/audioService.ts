
class AudioService {
  private audioCtx: AudioContext | null = null;

  private init() {
    if (!this.audioCtx) {
      this.audioCtx = new (window.AudioContext || (window as any).webkitAudioContext)();
    }
  }

  public async playAlarm() {
    this.init();
    if (!this.audioCtx) return;

    if (this.audioCtx.state === 'suspended') {
      await this.audioCtx.resume();
    }

    const playTone = (freq: number, start: number, duration: number) => {
      if (!this.audioCtx) return;
      const osc = this.audioCtx.createOscillator();
      const gain = this.audioCtx.createGain();

      osc.type = 'square';
      osc.frequency.setValueAtTime(freq, start);
      
      gain.gain.setValueAtTime(0.3, start);
      gain.gain.exponentialRampToValueAtTime(0.01, start + duration);

      osc.connect(gain);
      gain.connect(this.audioCtx.destination);

      osc.start(start);
      osc.stop(start + duration);
    };

    const now = this.audioCtx.currentTime;
    // Sequential beeps for impact
    playTone(880, now, 0.2);
    playTone(880, now + 0.3, 0.2);
    playTone(1100, now + 0.6, 0.5);
  }
}

export const audioService = new AudioService();
