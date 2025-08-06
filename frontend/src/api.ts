/**
 * API client for CogniFlow backend services.
 * Provides typed interfaces for all agent endpoints.
 */

const API_BASE = process.env.REACT_APP_API_URL || 'http://localhost:8000/api';

export interface Profile {
  user_id: string;
  attention_span_minutes: number;
  preferred_modalities: string[];
  working_memory_index: number;
  anxiety_triggers: string[];
  best_time_of_day: string;
  suggestions: string[];
  embedding: number[];
  created_at: string;
}

export interface ContentVariant {
  simplified: string;
  bullets: string;
  micro_tasks: string;
}

export interface FocusEvent {
  session_id: string;
  event_type: string;
  confidence: number;
  timestamp: string;
  metadata?: Record<string, any>;
}

export interface NudgeAction {
  type: string;
  payload: Record<string, any>;
  message: string;
  priority: number;
}

class CogniFlowAPI {
  private async request<T>(endpoint: string, options: RequestInit = {}): Promise<T> {
    const response = await fetch(`${API_BASE}${endpoint}`, {
      headers: {
        'Content-Type': 'application/json',
        ...options.headers,
      },
      ...options,
    });

    if (!response.ok) {
      throw new Error(`API Error: ${response.status} ${response.statusText}`);
    }

    return response.json();
  }

  // Profile Agent
  async buildProfile(userId: string, onboardingData: any): Promise<Profile> {
    return this.request<Profile>('/agents/profile/build', {
      method: 'POST',
      body: JSON.stringify({ user_id: userId, ...onboardingData }),
    });
  }

  // Content Adapter
  async convertContent(rawText: string, profile: Profile, subject?: string): Promise<ContentVariant> {
    return this.request<ContentVariant>('/agents/content/convert', {
      method: 'POST',
      body: JSON.stringify({
        raw_text: rawText,
        profile,
        subject,
      }),
    });
  }

  // Focus Tracker
  async logFocusEvent(event: FocusEvent): Promise<any> {
    return this.request('/agents/focus/events', {
      method: 'POST',
      body: JSON.stringify(event),
    });
  }

  async getFocusSummary(sessionId: string): Promise<any> {
    return this.request(`/agents/focus/session/${sessionId}/summary`);
  }

  // Nudge Agent
  async generateNudge(focusEvent: FocusEvent, profile: Profile, context: Record<string, any> = {}): Promise<NudgeAction> {
    return this.request<NudgeAction>('/agents/nudge/act', {
      method: 'POST',
      body: JSON.stringify({
        focus_event: focusEvent,
        profile,
        context,
      }),
    });
  }

  // Retention Agent
  async reportQuizResult(result: any): Promise<any> {
    return this.request('/agents/retention/report', {
      method: 'POST',
      body: JSON.stringify(result),
    });
  }

  async getDueItems(userId: string, limit: number = 10): Promise<any> {
    return this.request(`/agents/retention/due/${userId}?limit=${limit}`);
  }

  // Session Orchestration
  async processSessionStep(sessionId: string, step: any): Promise<any> {
    return this.request(`/session/${sessionId}/step`, {
      method: 'POST',
      body: JSON.stringify(step),
    });
  }

  async getSessionState(sessionId: string): Promise<any> {
    return this.request(`/session/${sessionId}`);
  }
}

export const api = new CogniFlowAPI();
