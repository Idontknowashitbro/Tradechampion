
declare namespace AOS {
  interface AOSSettings {
    offset?: number;
    delay?: number;
    duration?: number;
    easing?: string;
    once?: boolean;
    mirror?: boolean;
    anchorPlacement?: string;
    startEvent?: string;
  }

  function init(settings?: AOSSettings): void;
  function refresh(): void;
  function refreshHard(): void;
}

interface Window {
  AOS: typeof AOS;
}
