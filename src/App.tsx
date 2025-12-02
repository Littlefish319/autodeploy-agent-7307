import React, { useState, useEffect, useRef } from 'react';
import { 
  Terminal, 
  Cpu, 
  Zap, 
  CheckCircle2, 
  Loader2, 
  Code2, 
  Globe, 
  Play,
  ChevronRight
} from 'lucide-react';

interface LogEntry {
  id: string;
  message: string;
  type: 'info' | 'success' | 'error' | 'process';
  timestamp: string;
}

const App = () => {
  const [prompt, setPrompt] = useState('');
  const [isDeploying, setIsDeploying] = useState(false);
  const [logs, setLogs] = useState<LogEntry[]>([]);
  const [deployedUrl, setDeployedUrl] = useState<string | null>(null);
  const logsEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    logsEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [logs]);

  const addLog = (message: string, type: LogEntry['type'] = 'info') => {
    const now = new Date();
    const timeString = `${now.getHours().toString().padStart(2, '0')}:${now.getMinutes().toString().padStart(2, '0')}:${now.getSeconds().toString().padStart(2, '0')}`;
    
    setLogs(prev => [...prev, {
      id: Math.random().toString(36).substr(2, 9),
      message,
      type,
      timestamp: timeString
    }]);
  };

  const handleDeploy = async () => {
    if (!prompt.trim()) return;
    
    setIsDeploying(true);
    setLogs([]);
    setDeployedUrl(null);
    
    // Simulation of the agent workflow
    const steps = [
      { msg: `Initializing agent for: "${prompt}"`, delay: 800, type: 'info' },
      { msg: 'Analyzing requirements...', delay: 1500, type: 'process' },
      { msg: 'Generating component structure...', delay: 1200, type: 'process' },
      { msg: 'Writing src/App.tsx...', delay: 800, type: 'info' },
      { msg: 'Writing src/components/Dashboard.tsx...', delay: 600, type: 'info' },
      { msg: 'Optimizing assets...', delay: 1000, type: 'process' },
      { msg: 'Running build process...', delay: 2000, type: 'process' },
      { msg: 'Build successful. Size: 45.2kb', delay: 500, type: 'success' },
      { msg: 'Deploying to Vercel Edge Network...', delay: 1500, type: 'process' },
      { msg: 'Verifying deployment...', delay: 1000, type: 'info' },
      { msg: 'Deployment Complete!', delay: 500, type: 'success' }
    ];

    let currentDelay = 0;

    for (const step of steps) {
      await new Promise(resolve => setTimeout(resolve, step.delay));
      // @ts-ignore
      addLog(step.msg, step.type);
    }

    setDeployedUrl(`https://${prompt.toLowerCase().replace(/\s+/g, '-')}.vercel.app`);
    setIsDeploying(false);
  };

  return (
    <div className="min-h-screen bg-deploy-dark text-white p-4 md:p-8 font-sans selection:bg-deploy-accent selection:text-white">
      <div className="max-w-5xl mx-auto space-y-6">
        
        {/* Header */}
        <header className="flex items-center justify-between pb-6 border-b border-deploy-border">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-deploy-accent/10 rounded-lg border border-deploy-accent/20">
              <Cpu className="w-6 h-6 text-deploy-accent" />
            </div>
            <div>
              <h1 className="text-xl font-bold tracking-tight">AutoDeploy Agent</h1>
              <p className="text-xs text-gray-500 font-mono">v2.4.0-stable</p>
            </div>
          </div>
          <div className="flex items-center gap-2 text-xs font-mono text-gray-500">
            <span className="flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-deploy-success animate-pulse"></span>
              SYSTEM ONLINE
            </span>
          </div>
        </header>

        {/* Main Input Area */}
        <div className="glass-panel rounded-xl p-1">
          <div className="bg-deploy-card rounded-lg p-6 space-y-4">
            <label className="block text-sm font-medium text-gray-400">
              Describe your application
            </label>
            <div className="relative">
              <textarea
                value={prompt}
                onChange={(e) => setPrompt(e.target.value)}
                disabled={isDeploying}
                placeholder="e.g., A minimalist todo app with dark mode and local storage persistence..."
                className="w-full bg-black/50 border border-deploy-border rounded-lg p-4 text-sm focus:ring-2 focus:ring-deploy-accent focus:border-transparent outline-none transition-all resize-none h-32 font-mono"
              />
              <div className="absolute bottom-3 right-3">
                <button
                  onClick={handleDeploy}
                  disabled={isDeploying || !prompt.trim()}
                  className={`flex items-center gap-2 px-4 py-2 rounded-md text-sm font-semibold transition-all ${isDeploying ? 'bg-deploy-border text-gray-400 cursor-not-allowed' : 'bg-white text-black hover:bg-gray-200'}`}
                >
                  {isDeploying ? (
                    <><Loader2 className="w-4 h-4 animate-spin" /> Processing</>
                  ) : (
                    <><Zap className="w-4 h-4" /> Generate & Deploy</>
                  )}
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Grid: Logs & Preview */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          
          {/* Terminal */}
          <div className="glass-panel rounded-xl overflow-hidden flex flex-col h-[400px]">
            <div className="bg-deploy-card border-b border-deploy-border p-3 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Terminal className="w-4 h-4 text-gray-400" />
                <span className="text-xs font-mono text-gray-400">Build Logs</span>
              </div>
              <div className="flex gap-1.5">
                <div className="w-2.5 h-2.5 rounded-full bg-red-500/20 border border-red-500/50"></div>
                <div className="w-2.5 h-2.5 rounded-full bg-yellow-500/20 border border-yellow-500/50"></div>
                <div className="w-2.5 h-2.5 rounded-full bg-green-500/20 border border-green-500/50"></div>
              </div>
            </div>
            <div className="flex-1 bg-black p-4 overflow-y-auto font-mono text-xs space-y-2">
              {logs.length === 0 && (
                <div className="text-gray-600 italic">Waiting for input...</div>
              )}
              {logs.map((log) => (
                <div key={log.id} className="flex gap-3 animate-in fade-in slide-in-from-left-2 duration-300">
                  <span className="text-gray-600 shrink-0">{log.timestamp}</span>
                  <span className={`
                    ${log.type === 'error' ? 'text-deploy-error' : ''}
                    ${log.type === 'success' ? 'text-deploy-success' : ''}
                    ${log.type === 'process' ? 'text-blue-400' : ''}
                    ${log.type === 'info' ? 'text-gray-300' : ''}
                  `}>
                    {log.type === 'process' && <span className="inline-block w-2 h-2 border-t-2 border-r-2 border-blue-400 rounded-full animate-spin mr-2"></span>}
                    {log.type === 'success' && <CheckCircle2 className="inline w-3 h-3 mr-2" />}
                    {log.message}
                  </span>
                </div>
              ))}
              <div ref={logsEndRef} />
            </div>
          </div>

          {/* Preview / Status */}
          <div className="glass-panel rounded-xl overflow-hidden flex flex-col h-[400px]">
             <div className="bg-deploy-card border-b border-deploy-border p-3 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Globe className="w-4 h-4 text-gray-400" />
                <span className="text-xs font-mono text-gray-400">Deployment Status</span>
              </div>
            </div>
            <div className="flex-1 bg-deploy-card/50 flex flex-col items-center justify-center p-8 text-center">
              {!deployedUrl ? (
                <div className="space-y-4">
                  <div className="w-16 h-16 rounded-2xl bg-deploy-border/30 flex items-center justify-center mx-auto">
                    <Code2 className="w-8 h-8 text-gray-600" />
                  </div>
                  <p className="text-sm text-gray-500">No active deployment</p>
                </div>
              ) : (
                <div className="space-y-6 w-full max-w-xs animate-in zoom-in duration-500">
                  <div className="w-20 h-20 rounded-full bg-deploy-success/10 border border-deploy-success/20 flex items-center justify-center mx-auto">
                    <CheckCircle2 className="w-10 h-10 text-deploy-success" />
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-white">Deployment Ready</h3>
                    <p className="text-sm text-gray-400 mt-1">Your application is live worldwide.</p>
                  </div>
                  
                  <div className="bg-black/40 rounded-lg p-3 border border-deploy-border flex items-center justify-between gap-2">
                    <code className="text-xs text-deploy-accent truncate">{deployedUrl}</code>
                  </div>

                  <a 
                    href="#" 
                    onClick={(e) => e.preventDefault()} 
                    className="flex items-center justify-center gap-2 w-full bg-white text-black py-2.5 rounded-lg text-sm font-semibold hover:bg-gray-200 transition-colors"
                  >
                    <Play className="w-4 h-4" /> Launch App
                  </a>
                </div>
              )}
            </div>
          </div>

        </div>
      </div>
    </div>
  );
};

export default App;