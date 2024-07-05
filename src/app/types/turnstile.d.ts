/// <reference types="turnstile-types" />

declare global {
    interface Window {
      turnstile?: Turnstile.Turnstile;
    }
  }
  
  declare const turnstile: Turnstile.Turnstile;