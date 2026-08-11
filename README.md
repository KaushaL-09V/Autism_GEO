# Autism GEO — Project Readme

## Overview
Autism GEO is a web-based project for autism screening, prediction, and informational resources. It includes a Python backend (ML model + API) and a React/Vite frontend with UI for doctors and patients. Full project details, design decisions, datasets, and implementation notes are available in the internship report.

**Report:** [ProjectReport/Kaushal_internship_report (1).pdf](ProjectReport/Kaushal_internship_report%20(1).pdf)

## Features
- Autism screening and prediction using trained models
- Doctor dashboard with patient analysis and appointment management
- Patient dashboard showing results and appointments
- Informational pages and resources

## Tech Stack
- Backend: Python (Flask/FastAPI) — see `backend/`
- Frontend: React + Vite — see `frontend/`
- Model files: `model/` and `backend/model/` (pretrained .h5 included)

## Installation
Backend

```bash
python -m venv venv
# Windows PowerShell
venv\Scripts\Activate.ps1
pip install -r requirements.txt
# Run the backend (example)
python backend/app.py
```

Frontend

```bash
cd frontend
npm install
npm run dev
```

Adjust commands if you use a different environment or package manager.

## Project Structure (selected)
- `backend/` — API server, model loading, utils
- `frontend/` — React/Vite application and components
- `model/` — notebooks and saved model artifacts
- `ProjectReport/Kaushal_internship_report (1).pdf` — Full internship report
- `AutismSite Screenshot/` — screenshots used below

## Screenshots
Below are the site screenshots included in the project (from the `AutismSite Screenshot` folder). Open the images directly in the repo or view them in markdown-capable viewers.

1. Doctor Dashboard

![Doctor Dashboard](AutismSite%20Screenshot/1_DoctorDashBoard.png)

2. Doctor - Patient Dashboard (view)

![Doctor Patient Dashboard](AutismSite%20Screenshot/2_DoctorPatitentDashBoard.png)

3. Doctor - Patient Dashboard (alternate)

![Doctor Patient Dashboard 2](AutismSite%20Screenshot/3_DoctorPatitentDahBoard2.png)

4. Doctor - Patient Analysis

![Doctor Patient Analysis](AutismSite%20Screenshot/4_DoctorPatientAnalysis.png)

5. Doctor - About Page

![Doctor About Page](AutismSite%20Screenshot/5_DoctorAboutPage.png)

6. Doctor - Behaviour Screening

![Behaviour Screening](AutismSite%20Screenshot/6_DoctorBehaviourScreening.png)

7. Patient Dashboard

![Patient Dashboard](AutismSite%20Screenshot/7_PatitentDashboard.png)

8. Patient Appointment Page

![Patient Appointment](AutismSite%20Screenshot/8_PatientAppointmentPage.png)

9. Patient Result Page

![Patient Result Page](AutismSite%20Screenshot/9_PatientResultPage.png)

10. Patient Insight

![Patient Insight](AutismSite%20Screenshot/10_PatientInsight.png)


## Usage
- Start backend and frontend, then open the frontend dev server (usually `http://localhost:3000` or as Vite reports).
- The frontend communicates with the backend API endpoints under `backend/app.py` (inspect and change the base URL in `frontend/src/services/api.ts` if needed).

## Notes
- For implementation details, dataset explanation, model training logs, and screenshots context see the internship report: [ProjectReport/Kaushal_internship_report (1).pdf](ProjectReport/Kaushal_internship_report%20(1).pdf).
- Screenshots included in `AutismSite Screenshot/` were captured from the deployed or local UI; they illustrate doctor and patient workflows.

## Contact
Maintainer: Kaushal (see the internship report for full author/contact details)

---
README generated programmatically to reference the project report and the included screenshots. If you want alternate formatting (gallery grid, smaller images, or external hosting), tell me which style you prefer.
