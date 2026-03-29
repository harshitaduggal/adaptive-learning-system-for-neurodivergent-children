This project implements a behavior-driven adaptive learning system designed for neurodivergent learners. The system dynamically personalizes educational content using a Multi-Armed Bandit reinforcement learning framework, without relying on pre-labeled datasets.
Instead of requiring verbal responses, the system adapts based on interaction behavior such as engagement, response time, and accuracy.
At each step, the system selects the next learning activity by balancing:
Exploration (trying new strategies)
Exploitation (using what works best)

Features
1.Behavior-driven learning
Uses interaction signals: response time, completion time, engagement
No pre-trained dataset required
2.Adaptive content selection
Dynamically chooses next activity or modality
3.Reinforcement Learning (MAB)
Multi-Armed Bandit framework for decision-making
4.Exploration strategies
ε-greedy
Softmax (Boltzmann)
5.Strategy comparison
Evaluates performance based on engagement and reward trends
6.Multimodal learning modules
Visual
Audio
Interaction-based tasks

System Architecture
User Interaction → Feature Extraction → Reward Computation
        ↓
 Multi-Armed Bandit Agent
        ↓
 Action Selection (ε-greedy / Softmax)
        ↓
 Next Learning Activity

Data & Inputs

The system does not use pre-labeled datasets.

Instead, it collects:

Response correctness
Completion time
Engagement duration
Interaction patterns
These are used to:
Update the model in real-time
Compare exploration strategies

 Research Contribution
Behavior-driven adaptation without speech dependency
Comparison of exploration strategies in educational context
Lightweight RL approach suitable for low-data environments

## ⚙️ Installation & Setup

### Prerequisites
- Node.js (v16+)
- npm or yarn
- Python (v3.8+)
- Expo CLI 

### 1. Clone the repository
```bash
git clone https://github.com/harshitaduggal/adaptive-learning-system-for-neurodivergent-children.git
cd adaptive-learning-system-for-neurodivergent-children
```
Frontend Setup (React Native):
```bash
cd frontend
npm install
```
-Run the app:
```bash
npx expo start
```

Backend / RL Module Setup
```bash
cd backend
pip install -r requirements.txt
```
-Run the model:
```bash
python main.py
```


