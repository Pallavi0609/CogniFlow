# Focus Tracker - Client-Side Implementation

This module provides privacy-first attention tracking using TensorFlow.js for local processing.

## Privacy & Security

- **Local Processing Only**: All video analysis happens in the browser
- **No Video Upload**: Raw video never leaves the user's device
- **Event-Only Transmission**: Only aggregated focus events are sent to server
- **Opt-In Required**: User must explicitly grant camera permission

## Implementation Overview

\`\`\`javascript
// Example TensorFlow.js integration (stub)
import * as tf from '@tensorflow/tfjs';

class FocusTracker {
  constructor() {
    this.model = null;
    this.isTracking = false;
    this.confidenceThreshold = 0.7;
  }

  async initialize() {
    // Load pre-trained attention detection model
    // this.model = await tf.loadLayersModel('/models/attention-model.json');
    console.log('Focus tracker initialized (stub)');
  }

  async startTracking(sessionId, onFocusEvent) {
    const stream = await navigator.mediaDevices.getUserMedia({ video: true });
    const video = document.createElement('video');
    video.srcObject = stream;
    video.play();

    this.isTracking = true;
    
    // Process frames every 2 seconds
    const processFrame = async () => {
      if (!this.isTracking) return;
      
      // Stub: Generate mock focus events
      const focusEvent = {
        session_id: sessionId,
        event_type: Math.random() > 0.8 ? 'distraction' : 'focus',
        confidence: 0.7 + Math.random() * 0.3,
        timestamp: new Date().toISOString(),
        metadata: {
          processing_version: '1.0.0',
          local_only: true
        }
      };
      
      onFocusEvent(focusEvent);
      
      setTimeout(processFrame, 2000);
    };
    
    processFrame();
  }

  stopTracking() {
    this.isTracking = false;
  }
}

export default FocusTracker;
\`\`\`

## Integration Steps

1. **Install Dependencies**
   \`\`\`bash
   npm install @tensorflow/tfjs @tensorflow/tfjs-backend-webgl
   \`\`\`

2. **Initialize Tracker**
   \`\`\`javascript
   const tracker = new FocusTracker();
   await tracker.initialize();
   \`\`\`

3. **Start Session**
   \`\`\`javascript
   tracker.startTracking('session_123', (event) => {
     // Send event to CogniFlow API
     api.logFocusEvent(event);
   });
   \`\`\`

## Model Requirements

For production deployment, you'll need:

- **Attention Detection Model**: Trained to detect eye gaze and head pose
- **Distraction Classification**: Identifies phone usage, looking away, etc.
- **Confidence Scoring**: Provides reliability metrics for each detection

## Browser Compatibility

- Chrome 60+
- Firefox 55+
- Safari 11+
- Edge 79+

## Performance Considerations

- Model size should be < 10MB for fast loading
- Processing should run at 0.5-1 FPS to conserve battery
- Use Web Workers for background processing
- Implement adaptive quality based on device performance

## Next Steps

1. Train or acquire attention detection models
2. Implement real TensorFlow.js processing pipeline
3. Add calibration for different users and setups
4. Optimize for mobile devices and low-end hardware
