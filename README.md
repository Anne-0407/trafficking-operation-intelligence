#Trafficking Operation Intelligence Platform

Don't just detect the ad. Find the operation behind it.

An AI-assisted investigation intelligence prototype designed to help authorized investigators connect fragmented digital records into candidate operational clusters.

Digital records associated with the same underlying operation can change over time — phone numbers, usernames, images, wording, locations, and posting patterns may all vary. Simple matching can therefore miss relationships between records.

This prototype combines text, visual, identifier, temporal, behavioral, and graph signals to identify potentially meaningful relationships and present the supporting evidence to a human investigator.

What the Prototype Does

Digital Records
      ↓
Multi-Signal Analysis
      ↓
Candidate Relationships
      ↓
Operation Graph
      ↓
Evidence & Timeline
      ↓
Human Review

Key capabilities:
Operation Graph — explores connections between records and entities.
Change-Aware Attribution — tests whether relationships remain useful when visible attributes change.
Evidence & Explainability — shows why a relationship was suggested.
Evaluation — compares the proposed approach against simpler baselines.
Technology

Frontend: React, TypeScript, Vite, Tailwind CSS
Intelligence Engine: Python, scikit-learn, NetworkX
Data: Controlled synthetic dataset

Evaluation
The prototype was evaluated using a synthetic benchmark.

Approach	Original F1	After Changes F1
Exact Identifier	0.0349	0.0349
Text Only	0.1037	0.0241
Proposed Combined	0.8754	0.5399

The results indicate that combining multiple signals can preserve more useful relationships than relying on a single visible identifier, even after controlled changes.

These results are proof-of-concept measurements, not production performance claims.

Responsible Use

This system is designed as investigation support, not autonomous decision-making. It does not determine guilt, victim status, or identity, and all demonstration data is synthetic.

A production implementation would require appropriate authorization, privacy controls, access control, auditability, evidence provenance, and human review.

Project Structure
TOI_Prototype/
├── Frontend/       # Investigator-facing web application
├── Intelligence/   # Data processing, scoring, graph & evaluation
└── README.md
Running the Prototype
Intelligence Engine
cd Intelligence
pip install -r requirements.txt
python run.py
Frontend
cd Frontend
npm install
npm run dev

The frontend will normally be available at: http://localhost:5173

Prototype status: End-to-end proof of concept with integrated intelligence engine, graph analysis, evidence generation, change-aware testing, and investigator-facing interface.
