# Local Publish Ten-Platform Mapping Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Make all ten Kali Publish platforms visible and browser-login capable in Publish settings, including platform 10 as Alipay Life Account.

**Architecture:** Keep the canonical platform mapping and login allowlist in `src/publish.js`, which already feeds the React settings UI. Extend the existing platform-chip style system for type 10 and protect the contract with focused Node tests before running the full verification suite.

**Tech Stack:** React 19, Astro 7, JavaScript ES modules, Node test runner, CSS.

---

### Task 1: Lock the ten-platform contract with failing tests

**Files:**
- Modify: `tests/publish-payload.test.mjs`
- Test: `tests/publish-payload.test.mjs`

- [ ] **Step 1: Import `LOCAL_PUBLISH_PLATFORMS` and `LOCAL_PUBLISH_LOGIN_TYPES` and assert that the mapping contains types 1 through 10, with type 10 named `支付宝生活号`.**
- [ ] **Step 2: Change the login URL test so types 7, 8, 9, and 10 all return `/login` URLs instead of throwing.**
- [ ] **Step 3: Run `node --test tests/publish-payload.test.mjs` and verify failure is caused by the missing type-10 mapping and login support.**

### Task 2: Implement the canonical mapping and visual label

**Files:**
- Modify: `src/publish.js`
- Modify: `src/styles.css`

- [ ] **Step 1: Add `10: '支付宝生活号'` to `LOCAL_PUBLISH_PLATFORMS`.**
- [ ] **Step 2: Set `LOCAL_PUBLISH_LOGIN_TYPES` to types 1 through 10 and remove the obsolete API-account comment.**
- [ ] **Step 3: Add `.is-platform-10` color variables for the Alipay Life Account chip.**
- [ ] **Step 4: Re-run `node --test tests/publish-payload.test.mjs` and verify every focused test passes.**

### Task 3: Correct durable project memory and verify the release

**Files:**
- Modify: `MEMORY.md`

- [ ] **Step 1: Replace the superseded nine-platform/API-account note with the ten-platform, all-browser-login contract.**
- [ ] **Step 2: Run `node --test tests/*.test.mjs` and verify zero failures.**
- [ ] **Step 3: Run `npm run verify` and verify Astro diagnostics, production build, locale boundaries, and SEO output checks pass.**
- [ ] **Step 4: Inspect `git diff --check`, stage only task files, commit, and push `main` according to the repository's established direct-push rule.**
