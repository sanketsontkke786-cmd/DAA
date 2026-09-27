# Longest Common Subsequence (LCS) — Interactive Educational Website

> **Academic Project: Dynamic Programming Approach**  
> **Institution:** S.B. Jain Institute of Technology, Management & Research, Nagpur  
> **Department:** Department of Computer Science and Engineering (Data Science)  
> **Student:** Sanket Sontakke  
> **USN:** `CD24044`  

---

## 📌 Project Overview

This project is a modern, responsive, and interactive educational web application that visually explains and calculates the **Longest Common Subsequence (LCS)** using the **Dynamic Programming (DP)** paradigm.

Unlike basic assignments, this platform features an interactive DP matrix visualizer, backtrack path tracing, step-by-step playback with plain-English narration, a complexity calculator, and real-time substring vs. subsequence comparison.

---

## ✨ Features

- 🌟 **Canonical Textbook Example:** Visual breakdown of `ABCBDAB` vs `BDCABA` $\rightarrow$ `BCBA` (Length: 4).
- 🧪 **Interactive LCS Solver:**
  - Real-time sequence computation with instant results.
  - Complete 2D Dynamic Programming matrix $(m+1) \times (n+1)$.
  - Highlighted backtracking path with directional arrows ($\nwarrow$ Match, $\uparrow$ Top, $\leftarrow$ Left).
  - Cell inspector showing exact mathematical formula on click/hover.
- ⏯️ **Step-by-Step Playback Controller:** Automated step walkthrough with play/pause, next/back, and speed controls.
- 🔬 **Subsequence vs. Substring Playground:** Real-time validator testing contiguous vs. non-contiguous sequence properties.
- 📊 **Interactive Complexity Comparator:** Dynamic slider comparing $O(2^{\min(m, n)})$ brute-force explosion against polynomial $O(m \times n)$ DP.
- 🎓 **Viva / Presentation Mode:** High-contrast presentation view tailored for college viva and project demonstrations.
- 💻 **Polyglot Implementations:** Reference code tabs for Python 3, C++ 20, and JavaScript.

---

## 🚀 Getting Started

### Local Execution (No dependencies required)
1. Clone or download this repository:
   ```bash
   git clone https://github.com/YOUR_USERNAME/longest-common-subsequence.git
   cd longest-common-subsequence
   ```
2. Simply double-click **`index.html`** to open it directly in any modern browser (Chrome, Edge, Firefox, Opera).
3. Or run a lightweight local HTTP server using Python:
   ```bash
   python -m http.server 8080
   ```
   Then visit: `http://localhost:8080`

---

## 📁 Repository Structure

```text
├── index.html            # Main semantic HTML5 webpage with all 12 sections
├── styles.css            # Dark cyber theme, glassmorphism, and responsive layout
├── app.js                # LCS dynamic programming engine and visualizer
├── README.md             # Project documentation and academic details
└── lcs-project-files.zip # Compressed archive of all project assets
```

---

## 📚 References

1. **Thomas H. Cormen, Charles E. Leiserson, Ronald L. Rivest, Clifford Stein (CLRS)** — *Introduction to Algorithms*, MIT Press.
2. **Anany Levitin** — *Introduction to the Design and Analysis of Algorithms*, Pearson Education.
3. **Jon Kleinberg and Éva Tardos** — *Algorithm Design*, Addison-Wesley.
4. **Steven S. Skiena** — *The Algorithm Design Manual*, Springer.
5. **W3Schools** — Programming and Algorithm Resources.

---

## 👤 Author & Academic Details

* **Student:** Sanket Sontakke
* **USN:** `CD24044`
* **Department:** Computer Science and Engineering (Data Science)
* **College:** S.B. Jain Institute of Technology, Management & Research, Nagpur
* **Year:** 2026
