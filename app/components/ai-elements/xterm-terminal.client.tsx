'use client';

import { useEffect, useRef } from 'react';
import { Terminal } from '@xterm/xterm';
import { FitAddon } from '@xterm/addon-fit';

type Props = {
  wsUrl: string;
  platform?: string;
  onClose?: () => void;
};

export function XtermTerminal({ wsUrl, platform = 'claude-code', onClose }: Props) {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!containerRef.current) return;

    const term = new Terminal({
      theme: {
        background: '#09090b',
        foreground: '#e4e4e7',
        cursor: '#a1a1aa',
        selectionBackground: '#3f3f46',
      },
      fontSize: 13,
      fontFamily: 'ui-monospace, "Cascadia Code", "Source Code Pro", Menlo, monospace',
      cursorBlink: true,
      convertEol: true,
      scrollback: 5000,
    });

    const fitAddon = new FitAddon();
    term.loadAddon(fitAddon);
    term.open(containerRef.current);

    // Delay fit to allow DOM to render container with proper dimensions
    requestAnimationFrame(() => {
      fitAddon.fit();
    });

    const ws = new WebSocket(wsUrl);

    ws.onopen = () => {
      requestAnimationFrame(() => {
        fitAddon.fit();
        ws.send(JSON.stringify({ type: 'init', platform }));
        ws.send(JSON.stringify({ type: 'resize', cols: term.cols, rows: term.rows }));
      });
    };

    ws.onmessage = (e) => {
      if (typeof e.data === 'string') {
        term.write(e.data);
      } else {
        e.data.arrayBuffer().then((buf: ArrayBuffer) => term.write(new Uint8Array(buf)));
      }
    };

    ws.onclose = () => {
      term.write('\r\n\x1b[90m[disconnected]\x1b[0m\r\n');
    };

    ws.onerror = () => {
      term.write('\r\n\x1b[31m[connection error — is bridge running on :3201?]\x1b[0m\r\n');
    };

    term.onData((data) => {
      if (ws.readyState === ws.OPEN) {
        ws.send(JSON.stringify({ type: 'stdin', data }));
      }
    });

    const ro = new ResizeObserver(() => {
      fitAddon.fit();
      if (ws.readyState === ws.OPEN) {
        ws.send(JSON.stringify({ type: 'resize', cols: term.cols, rows: term.rows }));
      }
    });
    ro.observe(containerRef.current);

    return () => {
      ro.disconnect();
      try { ws.close(); } catch {}
      term.dispose();
    };
  }, [wsUrl]);

  return <div ref={containerRef} className="h-full w-full overflow-hidden" />;
}
