# Trafficking Operation Intelligence Platform

> **Don't just detect the ad. Find the operation behind it.**

An AI-assisted investigation intelligence prototype designed to help authorized investigators connect fragmented digital records into **candidate operational clusters**.

Digital records associated with the same underlying operation can change over time — phone numbers, usernames, images, wording, locations, and posting patterns may all vary. Simple matching can therefore miss relationships between records.

This prototype combines **text, visual, identifier, temporal, behavioral, and graph signals** to identify potentially meaningful relationships and present the supporting evidence to a human investigator.

---

## What the Prototype Does

```text
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
```

### Key Capabilities

**Operation Graph**  
Explores connections between records and entities to reveal relationships that may not be obvious when records are viewed individually.

**Change-Aware Attribution**  
Tests whether relationships remain useful when visible attributes change.

**Evidence & Explainability**  
Shows why a relationship was suggested and which signals contributed to it.

**Evaluation**  
Compares the proposed multi-signal approach against simpler baselines.

---

## The Problem

Investigative teams may encounter large numbers of fragmented digital records that appear unrelated when viewed individually.

Records associated with the same underlying operation may:

- use different phone numbers
- contain rewritten descriptions
- use modified versions of images
- appear in different locations
- be posted at different times
- use different usernames or accounts

A system based only on exact identifiers can therefore miss relationships that may still be useful for investigation.

> **Core Research Question:**  
> Can useful operational relationships still be recovered when visible identifiers are deliberately changed?

---

## How the Intelligence Works

The prototype combines multiple signals when evaluating whether two records may be related.

```text
Text Similarity
      +
Visual Similarity
      +
Identifier Similarity
      +
Temporal Similarity
      +
Behavioral Similarity
      +
Graph Context
      │
      ▼
Candidate Relationship
```

### Current Experimental Weighting

| Signal | Weight |
|---|---:|
| Text | 25% |
| Visual | 20% |
| Identifier | 15% |
| Temporal | 15% |
| Behaviour | 15% |
| Graph Context | 10% |

These weights are experimental and are not presented as scientifically optimal values.

---

## Candidate Operations

Strongly connected records are grouped into **candidate operations**.

```text
Candidate Operation
       │
       ├── Advertisement
       ├── Advertisement
       ├── Phone / Identifier
       ├── Username / Account
       ├── Image
       ├── Location
       └── Supporting Relationships
```

The graph allows an investigator to move from an individual record into its surrounding context.

The system presents these as **candidate relationships**, not confirmed conclusions.

---

## Evidence & Explainability

Every suggested relationship can be inspected through its contributing signals.

```text
Relationship Score

Text Similarity        ████████░░
Visual Similarity      █████████░
Identifier Similarity  ██████░░░░
Temporal Similarity    ████████░░
Behaviour Similarity   ███████░░░
Graph Context          ████████░░
```

The goal is not simply to say:

> "These records are related."

It is to show:

> **"These records were suggested as potentially related because of these observable signals."**

This keeps the investigator in the decision-making loop.

---

## Change-Aware Evaluation

A central part of the prototype is the **Change-Aware Attribution Test**.

The experiment compares system performance before and after controlled changes to visible record attributes.

Three approaches are evaluated:

1. **Exact Identifier Matching**
2. **Text-Only Matching**
3. **Proposed Combined Approach**

### Original Dataset

| Approach | Precision | Recall | F1 |
|---|---:|---:|---:|
| Exact Identifier | 1.0000 | 0.0178 | 0.0349 |
| Text Only | 0.1386 | 0.0828 | 0.1037 |
| **Proposed Combined** | **0.8580** | **0.8935** | **0.8754** |

### After Controlled Changes

| Approach | Precision | Recall | F1 |
|---|---:|---:|---:|
| Exact Identifier | 1.0000 | 0.0178 | 0.0349 |
| Text Only | 0.0375 | 0.0178 | 0.0241 |
| **Proposed Combined** | **0.7553** | **0.4201** | **0.5399** |

> **These are proof-of-concept measurements from a synthetic benchmark, not production performance claims.**

The experiment demonstrates that combining multiple signals can preserve more useful relationships than relying on a single visible identifier, even after controlled changes.

---

## Synthetic Dataset

The current prototype uses a controlled synthetic dataset.

The dataset contains:

- **50 records**
- multiple candidate operations
- recurring and changed identifiers
- modified image representations
- rewritten text
- temporal relationships
- location and behavioral patterns

The primary demonstration operation is **OP-031**.

The prototype intentionally does not use real victim, suspect, or other sensitive personal information.

---

## Investigator Workflow

```text
LOAD DATA
     ↓
ANALYZE
     ↓
DISCOVER CANDIDATE CLUSTERS
     ↓
PRIORITIZE
     ↓
OPEN OPERATION
     ↓
INSPECT GRAPH
     ↓
INSPECT TIMELINE
     ↓
REVIEW EVIDENCE
     ↓
TEST CHANGES
     ↓
HUMAN DECISION
```

The system is designed to support investigators rather than replace investigative judgment.

---

## Technology

### Frontend

`React` · `TypeScript` · `Vite` · `Tailwind CSS`

### Intelligence Engine

`Python` · `scikit-learn` · `NetworkX`

### Data

Controlled synthetic investigation dataset with JSON-based intermediate results.

---

## Project Structure

```text
TOI_Prototype/
│
├── Frontend/
│   ├── src/
│   │   ├── components/
│   │   ├── data/
│   │   └── pages/
│   ├── package.json
│   └── README.md
│
├── Intelligence/
│   ├── src/
│   │   ├── config.py
│   │   ├── data_loader.py
│   │   ├── features.py
│   │   ├── scoring.py
│   │   ├── graph.py
│   │   ├── evidence.py
│   │   ├── evaluate.py
│   │   ├── generate_dataset.py
│   │   └── change_experiment.py
│   │
│   ├── data/
│   ├── results/
│   ├── requirements.txt
│   ├── run.py
│   └── README.md
│
└── README.md
```

---

## Running the Prototype

### Intelligence Engine

```bash
cd Intelligence
pip install -r requirements.txt
python run.py
```

### Frontend

```bash
cd Frontend
npm install
npm run dev
```

The frontend will normally be available at:

```text
http://localhost:5173
```

---

## Frontend

The investigator-facing interface provides:

- **Command Center** — overview of the analytical dataset
- **Operation Overview** — inspect candidate operations
- **Operation Graph** — explore relationships
- **Timeline** — view activity chronologically
- **Candidate Relationships** — review individual relationship hypotheses
- **Evidence & Explainability** — inspect supporting signals
- **Change-Aware Test** — evaluate robustness to controlled changes
- **Evaluation** — review benchmark results
- **Methodology** — understand the analytical approach

The frontend consumes the intelligence engine's generated results and presents them through an investigator-oriented interface.

---

## Responsible Use

This system is designed as **investigation support, not autonomous decision-making**.

It does not:

- determine guilt
- determine victim status
- autonomously identify individuals
- perform facial recognition
- make autonomous enforcement decisions
- submit autonomous police reports

All demonstration data is **synthetic**.

A production implementation would require appropriate:

- authorization
- privacy controls
- access control
- audit logging
- evidence provenance
- human review
- security testing
- legal and organizational governance

---

## Current Limitations

This is a **proof-of-concept**, not a production system.

Current limitations include:

- synthetic dataset
- simplified visual representations
- experimentally selected scoring weights
- simplified behavioral features
- rule-based evidence generation
- JSON-based result storage
- no production database
- no live investigation data
- no external intelligence integrations
- no production-grade authentication or authorization

These limitations define the next stage of development rather than being hidden from evaluation.

---

## Future Development

### Intelligence

- stronger multimodal embeddings
- improved entity resolution
- learned relationship scoring
- temporal graph modeling
- adversarial robustness evaluation
- uncertainty calibration
- investigator feedback loops

### Platform

- PostgreSQL
- graph database such as Neo4j
- FastAPI service layer
- secure object storage
- role-based access control
- audit logging
- secure deployment

### Evaluation

- larger controlled benchmarks
- cross-operation validation
- temporal generalization
- false-positive analysis
- human-review utility
- investigation time saved

### Enterprise Deployment

- secure data ingestion
- case-management integrations
- evidence provenance
- private-cloud deployment
- on-premise deployment
- organization-specific models and policies

---

## Prototype Status

> **End-to-end proof of concept completed.**

The current prototype integrates:

```text
Synthetic Dataset
        ↓
Multi-Signal Analysis
        ↓
Candidate Operations
        ↓
Operation Graph
        ↓
Timeline
        ↓
Evidence Generation
        ↓
Change-Aware Testing
        ↓
Evaluation
        ↓
Investigator-Facing Interface
```

The prototype demonstrates an integrated approach to connecting fragmented digital records, evaluating relationships across multiple signals, and presenting the resulting intelligence in a human-review workflow.

---

## Disclaimer

This repository contains a **research and product proof-of-concept**.

All investigative examples and benchmark data are synthetic and are intended solely for demonstrating system architecture, AI experimentation, evaluation methodology, and investigator-oriented workflows.

The system should not be used to make real-world determinations about individuals without appropriate legal authority, human review, validation, and organizational safeguards.
