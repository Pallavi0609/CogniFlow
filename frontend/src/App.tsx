/**
 * Main CogniFlow React application.
 * Demonstrates integration with backend agents and adaptive content display.
 */

import React, { useState, useEffect } from 'react';
import { api, Profile, ContentVariant } from './api';
import AdaptedContent from './components/AdaptedContent';
import './App.css';

function App() {
  const [profile, setProfile] = useState<Profile | null>(null);
  const [content, setContent] = useState<ContentVariant | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Sample onboarding data for demo
  const sampleOnboarding = {
    age_range: "18-25",
    learning_goals: ["improve focus", "better retention"],
    previous_experience: "some online courses",
    attention_challenges: ["easily distracted", "short attention span"],
    preferred_pace: "moderate",
    accessibility_needs: ["clear instructions"]
  };

  // Sample educational content
  const sampleContent = `
    Photosynthesis is the process by which plants convert light energy, usually from the sun, 
    into chemical energy that can be later released to fuel the plant's activities. This process 
    involves chlorophyll, which is found in the chloroplasts of plant cells. The overall equation 
    for photosynthesis is: 6CO2 + 6H2O + light energy → C6H12O6 + 6O2. This means that carbon 
    dioxide and water, in the presence of light energy, produce glucose and oxygen.
  `;

  const handleCreateProfile = async () => {
    setLoading(true);
    setError(null);
    
    try {
      const newProfile = await api.buildProfile('demo_user', sampleOnboarding);
      setProfile(newProfile);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to create profile');
    } finally {
      setLoading(false);
    }
  };

  const handleAdaptContent = async () => {
    if (!profile) return;
    
    setLoading(true);
    setError(null);
    
    try {
      const adaptedContent = await api.convertContent(sampleContent, profile, 'biology');
      setContent(adaptedContent);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to adapt content');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="App">
      <header className="App-header">
        <h1>CogniFlow - Adaptive Learning Platform</h1>
        <p>Privacy-first, neurodivergent-friendly education</p>
      </header>

      <main className="App-main">
        {error && (
          <div className="error-message">
            <strong>Error:</strong> {error}
          </div>
        )}

        <section className="profile-section">
          <h2>1. Create Learner Profile</h2>
          <button 
            onClick={handleCreateProfile} 
            disabled={loading}
            className="primary-button"
          >
            {loading ? 'Creating Profile...' : 'Create Demo Profile'}
          </button>
          
          {profile && (
            <div className="profile-display">
              <h3>Profile Created!</h3>
              <ul>
                <li><strong>Attention Span:</strong> {profile.attention_span_minutes} minutes</li>
                <li><strong>Preferred Modalities:</strong> {profile.preferred_modalities.join(', ')}</li>
                <li><strong>Working Memory:</strong> {Math.round(profile.working_memory_index * 100)}%</li>
                <li><strong>Best Time:</strong> {profile.best_time_of_day}</li>
              </ul>
            </div>
          )}
        </section>

        <section className="content-section">
          <h2>2. Adapt Educational Content</h2>
          <button 
            onClick={handleAdaptContent} 
            disabled={loading || !profile}
            className="primary-button"
          >
            {loading ? 'Adapting Content...' : 'Adapt Sample Content'}
          </button>
          
          {content && <AdaptedContent content={content} />}
        </section>

        <section className="demo-info">
          <h2>Demo Features</h2>
          <ul>
            <li>✅ Profile creation from onboarding data</li>
            <li>✅ Content adaptation with multiple variants</li>
            <li>🔄 Focus tracking (client-side TensorFlow.js)</li>
            <li>🔄 Contextual nudges and interventions</li>
            <li>🔄 Spaced repetition scheduling</li>
          </ul>
        </section>
      </main>
    </div>
  );
}

export default App;
