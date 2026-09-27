/**
 * Longest Common Subsequence (LCS) Educational Engine
 * S.B. Jain Institute of Technology, Management & Research, Nagpur
 * Department of Computer Science & Engineering (Data Science)
 * Student: Sanket Sontakke | USN: CD24044
 */

(function () {
  'use strict';

  // State Management
  const state = {
    seq1: 'ABCBDAB',
    seq2: 'BDCABA',
    dpTable: [],
    directions: [],
    lcsString: '',
    lcsLength: 0,
    tracePath: new Set(),
    traceMatches: new Set(),
    steps: [],
    currentStepIdx: -1,
    isPlaying: false,
    playInterval: null,
    playSpeed: 600,
    activeCodeTab: 'python'
  };

  // DOM Elements cache
  const elements = {};

  function initElements() {
    elements.inputSeq1 = document.getElementById('inputSeq1');
    elements.inputSeq2 = document.getElementById('inputSeq2');
    elements.counterSeq1 = document.getElementById('counterSeq1');
    elements.counterSeq2 = document.getElementById('counterSeq2');
    elements.clearSeq1 = document.getElementById('clearSeq1');
    elements.clearSeq2 = document.getElementById('clearSeq2');
    elements.btnFindLCS = document.getElementById('btnFindLCS');
    elements.btnClearAll = document.getElementById('btnClearAll');
    elements.btnStartWalkthrough = document.getElementById('btnStartWalkthrough');
    
    // Result displays
    elements.solverResults = document.getElementById('solverResults');
    elements.solverAlert = document.getElementById('solverAlert');
    elements.lcsResultStr = document.getElementById('lcsResultStr');
    elements.lcsResultLen = document.getElementById('lcsResultLen');
    elements.lcsGridDim = document.getElementById('lcsGridDim');
    elements.lcsOpsCount = document.getElementById('lcsOpsCount');
    elements.btnCopyLCS = document.getElementById('btnCopyLCS');
    
    // Alignment & Table
    elements.alignSeq1 = document.getElementById('alignSeq1');
    elements.alignSeq2 = document.getElementById('alignSeq2');
    elements.dpTableWrapper = document.getElementById('dpTableWrapper');
    elements.cellDetailsCard = document.getElementById('cellDetailsCard');
    
    // Walkthrough controls
    elements.walkthroughSection = document.getElementById('walkthroughSection');
    elements.btnPlayPause = document.getElementById('btnPlayPause');
    elements.btnStepPrev = document.getElementById('btnStepPrev');
    elements.btnStepNext = document.getElementById('btnStepNext');
    elements.btnStepReset = document.getElementById('btnStepReset');
    elements.speedSlider = document.getElementById('speedSlider');
    elements.stepProgress = document.getElementById('stepProgress');
    elements.stepNarrative = document.getElementById('stepNarrative');
    
    // Playground: Subsequence vs Substring
    elements.playParent = document.getElementById('playParent');
    elements.playCandidate = document.getElementById('playCandidate');
    elements.subseqVerdict = document.getElementById('subseqVerdict');
    elements.substrVerdict = document.getElementById('substrVerdict');
    elements.playVisualWrap = document.getElementById('playVisualWrap');
    
    // Complexity Calculator
    elements.sliderM = document.getElementById('sliderM');
    elements.sliderN = document.getElementById('sliderN');
    elements.valM = document.getElementById('valM');
    elements.valN = document.getElementById('valN');
    elements.bruteOps = document.getElementById('bruteOps');
    elements.dpOps = document.getElementById('dpOps');
    
    // Navbar & Mobile
    elements.navbar = document.getElementById('mainNavbar');
    elements.mobileToggle = document.getElementById('mobileToggle');
    elements.navMenu = document.getElementById('navMenu');
    elements.btnPresentation = document.getElementById('btnPresentation');
  }

  // ==========================================
  // Core LCS Dynamic Programming Algorithm
  // ==========================================
  function computeLCS(s1, s2) {
    const m = s1.length;
    const n = s2.length;
    
    // dp[i][j] stores length of LCS of s1[0..i-1] and s2[0..j-1]
    const dp = Array.from({ length: m + 1 }, () => Array(n + 1).fill(0));
    // directions: 'D' (diagonal match), 'U' (up), 'L' (left), '0' (base)
    const dirs = Array.from({ length: m + 1 }, () => Array(n + 1).fill('0'));
    
    const calculationSteps = [];

    // Step-by-step DP table computation
    for (let i = 1; i <= m; i++) {
      for (let j = 1; j <= n; j++) {
        const char1 = s1[i - 1];
        const char2 = s2[j - 1];
        
        let stepDetail = {
          i,
          j,
          char1,
          char2,
          type: 'cell-calc'
        };

        if (char1 === char2) {
          dp[i][j] = dp[i - 1][j - 1] + 1;
          dirs[i][j] = 'D'; // Diagonal match
          stepDetail.isMatch = true;
          stepDetail.val = dp[i][j];
          stepDetail.explanation = `Match found! String 1[${i - 1}] ('${char1}') equals String 2[${j - 1}] ('${char2}'). Taking diagonal value ${dp[i - 1][j - 1]} + 1 = ${dp[i][j]}.`;
        } else {
          stepDetail.isMatch = false;
          if (dp[i - 1][j] >= dp[i][j - 1]) {
            dp[i][j] = dp[i - 1][j];
            dirs[i][j] = 'U'; // Up
            stepDetail.val = dp[i][j];
            stepDetail.explanation = `Mismatch ('${char1}' ≠ '${char2}'). Taking max of Top cell (${dp[i - 1][j]}) and Left cell (${dp[i][j - 1]}) -> ${dp[i][j]} from Top.`;
          } else {
            dp[i][j] = dp[i][j - 1];
            dirs[i][j] = 'L'; // Left
            stepDetail.val = dp[i][j];
            stepDetail.explanation = `Mismatch ('${char1}' ≠ '${char2}'). Taking max of Top cell (${dp[i - 1][j]}) and Left cell (${dp[i][j - 1]}) -> ${dp[i][j]} from Left.`;
          }
        }
        calculationSteps.push(stepDetail);
      }
    }

    // Backtrack to reconstruct LCS and find trace path
    const path = new Set();
    const matchCells = new Set();
    let lcsChars = [];
    let currI = m;
    let currJ = n;

    while (currI > 0 && currJ > 0) {
      path.add(`${currI},${currJ}`);
      
      if (s1[currI - 1] === s2[currJ - 1]) {
        matchCells.add(`${currI},${currJ}`);
        lcsChars.unshift(s1[currI - 1]);
        currI--;
        currJ--;
      } else if (dp[currI - 1][currJ] >= dp[currI][currJ - 1]) {
        currI--;
      } else {
        currJ--;
      }
    }
    // Also include (0,0) in trace path visualization
    path.add(`${currI},${currJ}`);

    return {
      dp,
      dirs,
      lcsString: lcsChars.join(''),
      lcsLength: dp[m][n],
      tracePath: path,
      traceMatches: matchCells,
      steps: calculationSteps
    };
  }

  // ==========================================
  // Render Dynamic DP Table
  // ==========================================
  function renderDPTable(s1, s2, dp, dirs, tracePath, traceMatches, activeCell = null) {
    const m = s1.length;
    const n = s2.length;
    
    let html = '<table class="dp-table">';
    
    // Header Row 1: Column indexes & String 2 characters
    html += '<thead><tr>';
    html += '<th>i \\ j</th>';
    html += '<th class="char-header">Ø<br><span style="font-size:0.6rem;color:var(--text-dim);">0</span></th>';
    
    for (let j = 0; j < n; j++) {
      html += `<th class="char-header">${s2[j]}<br><span style="font-size:0.65rem;color:var(--cyan-muted);">${j + 1}</span></th>`;
    }
    html += '</tr></thead>';

    // Table Body
    html += '<tbody>';
    for (let i = 0; i <= m; i++) {
      html += '<tr>';
      
      // Row Header
      if (i === 0) {
        html += '<th class="char-header">Ø<br><span style="font-size:0.65rem;color:var(--text-dim);">0</span></th>';
      } else {
        html += `<th class="char-header">${s1[i - 1]}<br><span style="font-size:0.65rem;color:var(--cyan-muted);">${i}</span></th>`;
      }

      // Cell entries
      for (let j = 0; j <= n; j++) {
        const cellKey = `${i},${j}`;
        const isTrace = tracePath.has(cellKey);
        const isMatch = traceMatches.has(cellKey);
        const isCurrent = activeCell && activeCell.i === i && activeCell.j === j;
        
        let cellClasses = [];
        if (isMatch) cellClasses.push('trace-match-cell');
        else if (isTrace) cellClasses.push('trace-cell');
        if (isCurrent) cellClasses.push('current-step-cell');
        
        let arrowHtml = '';
        if (i > 0 && j > 0) {
          const d = dirs[i][j];
          if (d === 'D') arrowHtml = '<span class="cell-arrow">↖</span>';
          else if (d === 'U') arrowHtml = '<span class="cell-arrow">↑</span>';
          else if (d === 'L') arrowHtml = '<span class="cell-arrow">←</span>';
        }

        const cellVal = dp[i][j];
        
        html += `<td class="${cellClasses.join(' ')}" 
                     data-row="${i}" 
                     data-col="${j}" 
                     title="Cell (${i}, ${j}) - Click to inspect formula">
                   ${arrowHtml}
                   <span>${cellVal}</span>
                 </td>`;
      }
      html += '</tr>';
    }
    html += '</tbody></table>';

    elements.dpTableWrapper.innerHTML = html;

    // Attach click events on cells for deep inspection
    const cells = elements.dpTableWrapper.querySelectorAll('td');
    cells.forEach(td => {
      td.addEventListener('click', () => {
        const row = parseInt(td.getAttribute('data-row'));
        const col = parseInt(td.getAttribute('data-col'));
        inspectCellDetails(row, col, s1, s2, dp, dirs);
      });
    });
  }

  // ==========================================
  // Inspect Individual Cell Formula
  // ==========================================
  function inspectCellDetails(i, j, s1, s2, dp, dirs) {
    if (i === 0 || j === 0) {
      elements.cellDetailsCard.innerHTML = `
        <div style="font-size:0.85rem; color:var(--cyan-muted); text-transform:uppercase; font-weight:700; margin-bottom:0.3rem;">Base Case Cell</div>
        <p style="color:#ffffff; font-family:var(--font-mono); font-size:1.05rem;">L[${i}][${j}] = 0</p>
        <p style="color:var(--text-muted); font-size:0.85rem; margin-top:0.25rem;">Empty sequence prefix base condition. When either sequence has length 0, the LCS length is strictly 0.</p>
      `;
      return;
    }

    const char1 = s1[i - 1];
    const char2 = s2[j - 1];
    const isMatch = char1 === char2;
    const dir = dirs[i][j];

    let formulaText = '';
    let explanation = '';

    if (isMatch) {
      formulaText = `L[${i}][${j}] = 1 + L[${i - 1}][${j - 1}] = 1 + ${dp[i - 1][j - 1]} = ${dp[i][j]}`;
      explanation = `Characters Match: String 1 index ${i - 1} ('${char1}') == String 2 index ${j - 1} ('${char2}'). Value is obtained by adding 1 to the diagonal cell L[${i - 1}][${j - 1}].`;
    } else {
      formulaText = `L[${i}][${j}] = max(L[${i - 1}][${j}], L[${i}][${j - 1}]) = max(${dp[i - 1][j]}, ${dp[i][j - 1]}) = ${dp[i][j]}`;
      explanation = `Characters Differ: String 1 index ${i - 1} ('${char1}') ≠ String 2 index ${j - 1} ('${char2}'). Value takes the maximum of Top L[${i - 1}][${j}] (${dp[i - 1][j]}) and Left L[${i}][${j - 1}] (${dp[i][j - 1]}).`;
    }

    elements.cellDetailsCard.innerHTML = `
      <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:0.4rem;">
        <span style="font-size:0.8rem; color:var(--cyan-muted); text-transform:uppercase; font-weight:700;">Inspecting Cell (${i}, ${j})</span>
        <span class="verdict-badge ${isMatch ? 'yes' : 'no'}">${isMatch ? 'MATCH' : 'MISMATCH'}</span>
      </div>
      <div style="font-family:var(--font-mono); font-size:1.1rem; color:#ffffff; font-weight:700; margin-bottom:0.4rem; background:rgba(0,0,0,0.3); padding:0.5rem 0.75rem; border-radius:8px;">
        ${formulaText}
      </div>
      <p style="color:var(--text-muted); font-size:0.85rem; line-height:1.5;">${explanation}</p>
    `;
  }

  // ==========================================
  // Render Alignment Visualizer Strip
  // ==========================================
  function renderAlignment(s1, s2, lcsStr) {
    // Find matching positions in s1 and s2
    const matches1 = new Set();
    let lcsIdx = 0;
    for (let i = 0; i < s1.length && lcsIdx < lcsStr.length; i++) {
      if (s1[i] === lcsStr[lcsIdx]) {
        matches1.add(i);
        lcsIdx++;
      }
    }

    const matches2 = new Set();
    lcsIdx = 0;
    for (let j = 0; j < s2.length && lcsIdx < lcsStr.length; j++) {
      if (s2[j] === lcsStr[lcsIdx]) {
        matches2.add(j);
        lcsIdx++;
      }
    }

    // Render Sequence 1 strip
    let html1 = '';
    for (let i = 0; i < s1.length; i++) {
      const isM = matches1.has(i);
      html1 += `<div class="char-box ${isM ? 'matched' : ''}">
                  <span>${s1[i]}</span>
                  <span class="char-idx">${i}</span>
                </div>`;
    }
    elements.alignSeq1.innerHTML = html1;

    // Render Sequence 2 strip
    let html2 = '';
    for (let j = 0; j < s2.length; j++) {
      const isM = matches2.has(j);
      html2 += `<div class="char-box ${isM ? 'matched' : ''}">
                  <span>${s2[j]}</span>
                  <span class="char-idx">${j}</span>
                </div>`;
    }
    elements.alignSeq2.innerHTML = html2;
  }

  // ==========================================
  // Execute LCS Solver
  // ==========================================
  function runLCSSolver() {
    const s1 = elements.inputSeq1.value.trim().toUpperCase();
    const s2 = elements.inputSeq2.value.trim().toUpperCase();

    // Validation
    if (!s1 || !s2) {
      elements.solverAlert.style.display = 'flex';
      elements.solverAlert.className = 'alert-message alert-warning';
      elements.solverAlert.innerHTML = `
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="m21.73 18-8-14a2 2 0 0 0-3.48 0l-8 14A2 2 0 0 0 4 21h16a2 2 0 0 0 1.73-3Z"/><line x1="12" y1="9" x2="12" y2="13"/><line x1="12" y1="17" x2="12.01" y2="17"/></svg>
        <span>Please enter both sequences to compute the Longest Common Subsequence.</span>
      `;
      elements.solverResults.style.display = 'none';
      return;
    }

    if (s1.length > 25 || s2.length > 25) {
      elements.solverAlert.style.display = 'flex';
      elements.solverAlert.className = 'alert-message alert-warning';
      elements.solverAlert.innerHTML = `
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg>
        <span>For optimal browser performance & visual clarity in the DP table, sequence lengths up to 25 characters are recommended.</span>
      `;
    } else {
      elements.solverAlert.style.display = 'none';
    }

    state.seq1 = s1;
    state.seq2 = s2;

    const result = computeLCS(s1, s2);
    state.dpTable = result.dp;
    state.directions = result.dirs;
    state.lcsString = result.lcsString;
    state.lcsLength = result.lcsLength;
    state.tracePath = result.tracePath;
    state.traceMatches = result.traceMatches;
    state.steps = result.steps;
    state.currentStepIdx = -1;

    // Display summary metrics
    elements.lcsResultStr.textContent = result.lcsString || '(None)';
    elements.lcsResultLen.textContent = result.lcsLength;
    elements.lcsGridDim.textContent = `${s1.length + 1} × ${s2.length + 1}`;
    elements.lcsOpsCount.textContent = `${s1.length * s2.length} cells`;

    // Render visualization components
    renderAlignment(s1, s2, result.lcsString);
    renderDPTable(s1, s2, result.dp, result.dirs, result.tracePath, result.traceMatches);

    // Initial inspection on bottom-right cell
    inspectCellDetails(s1.length, s2.length, s1, s2, result.dp, result.dirs);

    // Show results
    elements.solverResults.style.display = 'block';

    // Stop any ongoing walkthrough
    stopWalkthrough();
  }

  // ==========================================
  // Walkthrough & Step-by-Step Playback
  // ==========================================
  function startWalkthrough() {
    runLCSSolver();
    elements.walkthroughSection.style.display = 'block';
    state.currentStepIdx = 0;
    showCurrentStep();
  }

  function showCurrentStep() {
    if (state.currentStepIdx < 0 || state.currentStepIdx >= state.steps.length) return;

    const step = state.steps[state.currentStepIdx];
    elements.stepProgress.textContent = `Step ${state.currentStepIdx + 1} of ${state.steps.length}`;
    elements.stepNarrative.innerHTML = `<strong>Cell [${step.i}, ${step.j}]</strong>: ${step.explanation}`;

    // Render table highlighting only calculated cells up to current step
    renderDPTable(state.seq1, state.seq2, state.dpTable, state.directions, state.tracePath, state.traceMatches, {
      i: step.i,
      j: step.j
    });
  }

  function stepNext() {
    if (state.currentStepIdx < state.steps.length - 1) {
      state.currentStepIdx++;
      showCurrentStep();
    } else {
      stopWalkthrough();
    }
  }

  function stepPrev() {
    if (state.currentStepIdx > 0) {
      state.currentStepIdx--;
      showCurrentStep();
    }
  }

  function stepReset() {
    state.currentStepIdx = 0;
    showCurrentStep();
  }

  function togglePlayPause() {
    if (state.isPlaying) {
      stopWalkthrough();
    } else {
      state.isPlaying = true;
      elements.btnPlayPause.innerHTML = `
        <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor"><rect x="6" y="4" width="4" height="16"/><rect x="14" y="4" width="4" height="16"/></svg>
        <span>Pause</span>
      `;
      state.playInterval = setInterval(() => {
        if (state.currentStepIdx < state.steps.length - 1) {
          stepNext();
        } else {
          stopWalkthrough();
        }
      }, state.playSpeed);
    }
  }

  function stopWalkthrough() {
    state.isPlaying = false;
    if (state.playInterval) {
      clearInterval(state.playInterval);
      state.playInterval = null;
    }
    if (elements.btnPlayPause) {
      elements.btnPlayPause.innerHTML = `
        <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor"><polygon points="5 3 19 12 5 21 5 3"/></svg>
        <span>Play</span>
      `;
    }
  }

  // ==========================================
  // Subsequence vs Substring Playground
  // ==========================================
  function testSubsequence(parent, candidate) {
    let pIdx = 0;
    let cIdx = 0;
    const matchIndices = [];

    while (pIdx < parent.length && cIdx < candidate.length) {
      if (parent[pIdx] === candidate[cIdx]) {
        matchIndices.push(pIdx);
        cIdx++;
      }
      pIdx++;
    }
    return {
      isSubseq: cIdx === candidate.length,
      matchIndices
    };
  }

  function updatePlayground() {
    const parent = elements.playParent.value.trim().toUpperCase();
    const candidate = elements.playCandidate.value.trim().toUpperCase();

    if (!parent || !candidate) {
      elements.subseqVerdict.className = 'verdict-badge no';
      elements.subseqVerdict.textContent = 'Awaiting Input';
      elements.substrVerdict.className = 'verdict-badge no';
      elements.substrVerdict.textContent = 'Awaiting Input';
      elements.playVisualWrap.innerHTML = '';
      return;
    }

    // Check Substring
    const isSubstr = parent.includes(candidate);
    elements.substrVerdict.className = `verdict-badge ${isSubstr ? 'yes' : 'no'}`;
    elements.substrVerdict.textContent = isSubstr ? 'YES (Contiguous)' : 'NO';

    // Check Subsequence
    const subseqResult = testSubsequence(parent, candidate);
    elements.subseqVerdict.className = `verdict-badge ${subseqResult.isSubseq ? 'yes' : 'no'}`;
    elements.subseqVerdict.textContent = subseqResult.isSubseq ? 'YES (Preserves Order)' : 'NO';

    // Highlight characters in parent string
    const matchSet = new Set(subseqResult.matchIndices);
    let visualHtml = '';
    for (let i = 0; i < parent.length; i++) {
      const isM = subseqResult.isSubseq && matchSet.has(i);
      visualHtml += `<div class="char-box ${isM ? 'matched' : ''}">
                       <span>${parent[i]}</span>
                       <span class="char-idx">${i}</span>
                     </div>`;
    }
    elements.playVisualWrap.innerHTML = visualHtml;
  }

  // ==========================================
  // Interactive Complexity Calculator
  // ==========================================
  function updateComplexityCalculator() {
    const m = parseInt(elements.sliderM.value);
    const n = parseInt(elements.sliderN.value);
    
    elements.valM.textContent = m;
    elements.valN.textContent = n;

    // DP: m * n operations
    const dpVal = m * n;
    elements.dpOps.textContent = `${dpVal.toLocaleString()} ops`;

    // Brute Force: 2^(min(m, n))
    const minLen = Math.min(m, n);
    if (minLen > 30) {
      elements.bruteOps.textContent = `> 1.07 × 10⁹ ops (Overflow)`;
    } else {
      const bruteVal = Math.pow(2, minLen);
      elements.bruteOps.textContent = `${bruteVal.toLocaleString()} ops`;
    }
  }

  // ==========================================
  // Presets and Handlers
  // ==========================================
  function setupPresets() {
    const presetButtons = document.querySelectorAll('.preset-btn');
    presetButtons.forEach(btn => {
      btn.addEventListener('click', () => {
        const s1 = btn.getAttribute('data-s1');
        const s2 = btn.getAttribute('data-s2');
        if (s1 && s2) {
          elements.inputSeq1.value = s1;
          elements.inputSeq2.value = s2;
          elements.counterSeq1.textContent = `${s1.length} chars`;
          elements.counterSeq2.textContent = `${s2.length} chars`;
          runLCSSolver();
        }
      });
    });

    const playgroundPresets = document.querySelectorAll('.play-candidates-list .preset-chip');
    playgroundPresets.forEach(chip => {
      chip.addEventListener('click', () => {
        elements.playCandidate.value = chip.getAttribute('data-val');
        updatePlayground();
      });
    });
  }

  // ==========================================
  // Code Tabs Toggle (Python / C++ / JS)
  // ==========================================
  function setupCodeTabs() {
    const tabs = document.querySelectorAll('.code-tab-btn');
    const codeBlocks = {
      python: `def longest_common_subsequence(X: str, Y: str) -> str:
    m, n = len(X), len(Y)
    # Initialize DP table of size (m+1) x (n+1)
    dp = [[0] * (n + 1) for _ in range(m + 1)]

    # Fill DP Table row by row
    for i in range(1, m + 1):
        for j in range(1, n + 1):
            if X[i - 1] == Y[j - 1]:
                dp[i][j] = dp[i - 1][j - 1] + 1
            else:
                dp[i][j] = max(dp[i - 1][j], dp[i][j - 1])

    # Backtracking to reconstruct the canonical LCS string
    lcs = []
    i, j = m, n
    while i > 0 and j > 0:
        if X[i - 1] == Y[j - 1]:
            lcs.append(X[i - 1])
            i -= 1
            j -= 1
        elif dp[i - 1][j] >= dp[i][j - 1]:
            i -= 1
        else:
            j -= 1

    return "".join(reversed(lcs))

# Example invocation:
print(longest_common_subsequence("ABCBDAB", "BDCABA"))  # Output: BCBA`,

      cpp: `#include <iostream>
#include <vector>
#include <string>
#include <algorithm>

std::string findLCS(const std::string& X, const std::string& Y) {
    int m = X.length();
    int n = Y.length();
    std::vector<std::vector<int>> dp(m + 1, std::vector<int>(n + 1, 0));

    // Tabulation Phase
    for (int i = 1; i <= m; i++) {
        for (int j = 1; j <= n; j++) {
            if (X[i - 1] == Y[j - 1]) {
                dp[i][j] = dp[i - 1][j - 1] + 1;
            } else {
                dp[i][j] = std::max(dp[i - 1][j], dp[i][j - 1]);
            }
        }
    }

    // Reconstruct LCS via Backtracking
    std::string lcs = "";
    int i = m, j = n;
    while (i > 0 && j > 0) {
        if (X[i - 1] == Y[j - 1]) {
            lcs.push_back(X[i - 1]);
            i--; j--;
        } else if (dp[i - 1][j] >= dp[i][j - 1]) {
            i--;
        } else {
            j--;
        }
    }
    std::reverse(lcs.begin(), lcs.end());
    return lcs;
}`,

      javascript: `function longestCommonSubsequence(X, Y) {
  const m = X.length;
  const n = Y.length;
  const dp = Array.from({ length: m + 1 }, () => Array(n + 1).fill(0));

  for (let i = 1; i <= m; i++) {
    for (let j = 1; j <= n; j++) {
      if (X[i - 1] === Y[j - 1]) {
        dp[i][j] = dp[i - 1][j - 1] + 1;
      } else {
        dp[i][j] = Math.max(dp[i - 1][j], dp[i][j - 1]);
      }
    }
  }

  // Backtracking to find LCS string
  const lcs = [];
  let i = m, j = n;
  while (i > 0 && j > 0) {
    if (X[i - 1] === Y[j - 1]) {
      lcs.unshift(X[i - 1]);
      i--; j--;
    } else if (dp[i - 1][j] >= dp[i][j - 1]) {
      i--;
    } else {
      j--;
    }
  }
  return lcs.join('');
}`
    };

    const codeContainer = document.getElementById('codeDisplay');

    tabs.forEach(tab => {
      tab.addEventListener('click', () => {
        tabs.forEach(t => t.classList.remove('active'));
        tab.classList.add('active');
        const lang = tab.getAttribute('data-lang');
        if (codeBlocks[lang] && codeContainer) {
          codeContainer.textContent = codeBlocks[lang];
        }
      });
    });
  }

  // ==========================================
  // Scrollspy & Presentation Mode
  // ==========================================
  function setupScrollspy() {
    const sections = document.querySelectorAll('section[id]');
    const navLinks = document.querySelectorAll('.nav-link');

    window.addEventListener('scroll', () => {
      const scrollY = window.pageYOffset;

      if (elements.navbar) {
        if (scrollY > 50) {
          elements.navbar.classList.add('scrolled');
        } else {
          elements.navbar.classList.remove('scrolled');
        }
      }

      sections.forEach(current => {
        const sectionHeight = current.offsetHeight;
        const sectionTop = current.offsetTop - 120;
        const sectionId = current.getAttribute('id');

        if (scrollY > sectionTop && scrollY <= sectionTop + sectionHeight) {
          navLinks.forEach(link => {
            link.classList.remove('active');
            if (link.getAttribute('href') === `#${sectionId}`) {
              link.classList.add('active');
            }
          });
        }
      });
    });
  }

  // ==========================================
  // Initialization
  // ==========================================
  document.addEventListener('DOMContentLoaded', () => {
    initElements();
    setupPresets();
    setupCodeTabs();
    setupScrollspy();

    // Input listeners
    elements.inputSeq1.addEventListener('input', (e) => {
      elements.counterSeq1.textContent = `${e.target.value.length} chars`;
    });
    elements.inputSeq2.addEventListener('input', (e) => {
      elements.counterSeq2.textContent = `${e.target.value.length} chars`;
    });

    elements.clearSeq1.addEventListener('click', () => {
      elements.inputSeq1.value = '';
      elements.counterSeq1.textContent = '0 chars';
      elements.inputSeq1.focus();
    });

    elements.clearSeq2.addEventListener('click', () => {
      elements.inputSeq2.value = '';
      elements.counterSeq2.textContent = '0 chars';
      elements.inputSeq2.focus();
    });

    elements.btnClearAll.addEventListener('click', () => {
      elements.inputSeq1.value = '';
      elements.inputSeq2.value = '';
      elements.counterSeq1.textContent = '0 chars';
      elements.counterSeq2.textContent = '0 chars';
      elements.solverResults.style.display = 'none';
      elements.solverAlert.style.display = 'none';
      stopWalkthrough();
      elements.walkthroughSection.style.display = 'none';
    });

    elements.btnFindLCS.addEventListener('click', runLCSSolver);
    elements.btnStartWalkthrough.addEventListener('click', startWalkthrough);

    // Walkthrough controls
    elements.btnPlayPause.addEventListener('click', togglePlayPause);
    elements.btnStepNext.addEventListener('click', stepNext);
    elements.btnStepPrev.addEventListener('click', stepPrev);
    elements.btnStepReset.addEventListener('click', stepReset);
    elements.speedSlider.addEventListener('input', (e) => {
      state.playSpeed = parseInt(e.target.value);
      if (state.isPlaying) {
        stopWalkthrough();
        togglePlayPause();
      }
    });

    // Copy to clipboard
    elements.btnCopyLCS.addEventListener('click', () => {
      if (state.lcsString) {
        navigator.clipboard.writeText(state.lcsString).then(() => {
          const original = elements.btnCopyLCS.innerHTML;
          elements.btnCopyLCS.innerHTML = `
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#10b981" stroke-width="2"><polyline points="20 6 9 17 4 12"/></svg>
            <span style="color:#10b981;">Copied!</span>
          `;
          setTimeout(() => {
            elements.btnCopyLCS.innerHTML = original;
          }, 2000);
        });
      }
    });

    // Playground listeners
    elements.playParent.addEventListener('input', updatePlayground);
    elements.playCandidate.addEventListener('input', updatePlayground);

    // Complexity Sliders
    elements.sliderM.addEventListener('input', updateComplexityCalculator);
    elements.sliderN.addEventListener('input', updateComplexityCalculator);

    // Mobile Navbar toggle
    if (elements.mobileToggle && elements.navMenu) {
      elements.mobileToggle.addEventListener('click', () => {
        elements.navMenu.classList.toggle('show');
      });
      // Close menu on link click
      const links = elements.navMenu.querySelectorAll('.nav-link');
      links.forEach(l => {
        l.addEventListener('click', () => elements.navMenu.classList.remove('show'));
      });
    }

    // Presentation Mode toggle
    if (elements.btnPresentation) {
      elements.btnPresentation.addEventListener('click', () => {
        document.body.classList.toggle('presentation-mode');
        const isPres = document.body.classList.contains('presentation-mode');
        elements.btnPresentation.innerHTML = isPres
          ? `<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="3" y="3" width="18" height="18" rx="2"/><line x1="9" y1="9" x2="15" y2="15"/><line x1="15" y1="9" x2="9" y2="15"/></svg><span>Exit Viva Mode</span>`
          : `<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z"/><path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z"/></svg><span>Viva / Presentation Mode</span>`;
      });
    }

    // Run initial calculations
    runLCSSolver();
    updatePlayground();
    updateComplexityCalculator();
  });
})();
