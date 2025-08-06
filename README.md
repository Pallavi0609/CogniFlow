# CogniFlow - Adaptive E-Learning Platform

A privacy-first, neurodivergent-friendly learning platform with 5 AI agents for personalized education.

## Architecture

- **ProfileAgent**: Builds learner profiles from onboarding data
- **ContentAdapterAgent**: Adapts content to learning preferences  
- **FocusTrackerAgent**: Monitors attention (local processing only)
- **NudgeAgent**: Provides contextual learning interventions
- **RetentionAgent**: Manages spaced repetition scheduling

## Privacy & Ethics

- **Camera inference**: Opt-in, local-only processing with TensorFlow.js
- **No raw video uploads**: Only aggregated focus events sent to server
- **PII protection**: Logs omit personally identifiable information
- **Data export**: Admin endpoint for user profile summaries (not raw telemetry)

## Quick Start

### Backend Setup
\`\`\`bash
cd backend
python -m venv venv
source venv/bin/activate  # or `venv\Scripts\activate` on Windows
pip install -r requirements.txt
python scripts/bootstrap_db.py
uvicorn app.main:app --reload
\`\`\`

### Frontend Setup
\`\`\`bash
cd frontend
npm install
npm start
\`\`\`

### Optional: Full Stack with Docker
\`\`\`bash
docker-compose up -d
\`\`\`

## API Endpoints

- `POST /agents/profile/build` - Create learner profile
- `POST /agents/content/convert` - Adapt content to profile
- `POST /agents/focus/events` - Log focus events (from client)
- `POST /agents/nudge/act` - Generate contextual nudges
- `POST /agents/retention/report` - Update SRS schedule
- `POST /session/{id}/step` - Orchestrated learning session

## Testing

\`\`\`bash
cd backend
pytest tests/ -v
\`\`\`

## Developer Tasks

1. **LLM Integration**: Replace `LocalStubClient` with OpenAI or local LLM
2. **Persistence**: Add Redis/PostgreSQL for profiles and SRS data
3. **Vector DB**: Implement semantic content matching with Milvus/Pinecone
4. **ML Evaluation**: Add metrics and human-in-loop moderation for nudges
5. **Focus Tracking**: Integrate real TensorFlow.js attention models
6. **Accessibility**: Add WCAG compliance testing and screen reader support

##demo Video
https://drive.google.com/file/d/1rBHpgngHn-nBIy-489C9HqsmLDc69hho/view?usp=drive_link
