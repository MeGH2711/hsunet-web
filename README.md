# HS-UNet Medical Results & Visual Inspection Dashboard

An interactive web application for multi-center ischemic stroke lesion segmentation analysis, evaluation metrics exploration, and 3D visual slice inspection. Built for the **HyperScale-UNet (HS-UNet)** framework on the ISLES-22 dataset.

Live deployment ready for **Vercel**.

---

## Key Features

- **Pure Black Aesthetic**: Sleek minimal `#000000` design with crisp typography (Montserrat) and shadcn-inspired components.
- **PACS-Grade 3D Volume Scrubber**: Smooth continuous axial depth slider (`Z = 0` to `Z = N - 1`), Cine-loop auto-play, keyboard controls (Left/Right arrows, Spacebar), and lesion depth profile timelines.
- **4-Way Synchronized Visual Comparison**:
  1. Raw CT / MRI Scan (contrast-stretched normalized grayscale)
  2. Ground Truth Lesion Mask (manual annotation)
  3. Ground Truth + Scan Overlay (semi-transparent emerald green overlay)
  4. Predicted Mask Overlay (semi-transparent cyan prediction overlay)
- **Confusion Error Diagnostic Map**:
  - **Green**: True Positive (correctly segmented lesion)
  - **Coral Red**: False Positive (over-segmented healthy tissue)
  - **Electric Blue**: False Negative (missed lesion tissue)
- **Comprehensive Quantitative Evaluation**:
  - Dice Similarity Coefficient (DSC) & IoU
  - 95th-percentile Hausdorff Distance (HD95 in mm)
  - Lesion Volumes (Reference vs Predicted volume in mL, Absolute difference)
  - Precision, Recall (Sensitivity), and Specificity
- **Global Training Curves & Dynamics**:
  - High-resolution training vs validation loss curves and validation pseudo Dice progression from nnU-Net.
- **Searchable Database of 1,453 Cases**:
  - Instant live filter by Subject ID, Case ID, Acquisition Site (`R001` - `R004`), Lesion Scale (`Small`, `Medium`, `Large`), or Dice score range.
  - CSV export for downstream clinical reporting.

---

## Getting Started Locally

```bash
# 1. Install dependencies
npm install

# 2. Run local development server
npm run dev

# 3. Build for production
npm run build
```

---

## Deployment on Vercel

This repository is pre-configured with `vercel.json` for zero-configuration 1-click deployment on [Vercel](https://vercel.com):

1. Import this repository (`MeGH2711/hsunet-web`) into Vercel.
2. Framework Preset: **Vite** (detected automatically).
3. Build Command: `npm run build`
4. Output Directory: `dist`
5. Click **Deploy**.
