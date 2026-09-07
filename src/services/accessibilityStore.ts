import { useState, useEffect } from 'react';

export interface AccessibilitySettings {
  highContrast: boolean;
  largeText: boolean;
  voiceEnabled: boolean;
  wheelchairOnly: boolean;
}

const STORAGE_KEY = 'sathaye_accessibility_settings';

class AccessibilityManager {
  private static instance: AccessibilityManager;
  private settings: AccessibilitySettings = {
    highContrast: false,
    largeText: false,
    voiceEnabled: false,
    wheelchairOnly: false
  };
  private listeners: Set<() => void> = new Set();

  private constructor() {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) {
        this.settings = JSON.parse(stored);
        this.applyDomClasses();
      }
    } catch (e) {
      console.error(e);
    }
  }

  public static getInstance(): AccessibilityManager {
    if (!AccessibilityManager.instance) {
      AccessibilityManager.instance = new AccessibilityManager();
    }
    return AccessibilityManager.instance;
  }

  public getSettings(): AccessibilitySettings {
    return { ...this.settings };
  }

  public update(newSettings: Partial<AccessibilitySettings>): void {
    this.settings = { ...this.settings, ...newSettings };
    localStorage.setItem(STORAGE_KEY, JSON.stringify(this.settings));
    this.applyDomClasses();
    this.listeners.forEach(l => l());

    if (newSettings.voiceEnabled && 'speechSynthesis' in window) {
      this.speak('Voice assistance enabled for Sathaye Smart Campus');
    }
  }

  public speak(text: string): void {
    if ('speechSynthesis' in window && this.settings.voiceEnabled) {
      window.speechSynthesis.cancel();
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.rate = 1.0;
      utterance.pitch = 1.0;
      window.speechSynthesis.speak(utterance);
    }
  }

  public subscribe(listener: () => void): () => void {
    this.listeners.add(listener);
    return () => this.listeners.delete(listener);
  }

  private applyDomClasses(): void {
    const root = document.documentElement;
    if (this.settings.highContrast) {
      root.classList.add('high-contrast-mode');
    } else {
      root.classList.remove('high-contrast-mode');
    }

    if (this.settings.largeText) {
      root.classList.add('large-text-mode');
    } else {
      root.classList.remove('large-text-mode');
    }
  }
}

export const accessibilityManager = AccessibilityManager.getInstance();

export function useAccessibility() {
  const [settings, setSettings] = useState<AccessibilitySettings>(accessibilityManager.getSettings());

  useEffect(() => {
    return accessibilityManager.subscribe(() => {
      setSettings(accessibilityManager.getSettings());
    });
  }, []);

  return {
    ...settings,
    update: (opts: Partial<AccessibilitySettings>) => accessibilityManager.update(opts),
    speak: (text: string) => accessibilityManager.speak(text)
  };
}
