# Versioning Policy

## First Principle

The scarce resource is credible demo traceability.

Every meaningful change must answer:

```text
Which demo version did we show?
What changed from the previous version?
What safety boundary applied?
Which verification commands passed?
```

The version is not only an engineering label. It is the evidence label for hospital-facing rehearsal, backup recording, stakeholder review, and post-demo decision capture.

## Version Format

Use semantic product versions:

```text
vMAJOR.MINOR.PATCH
```

Example:

```text
v2.0.0
v2.1.0
v2.1.1
```

`package.json` stores the same version without the leading `v`.

## What Counts as a Versioned Change

Every meaningful change must update the version files:

```text
VERSION.json
core/version/index.js
docs/CHANGELOG.md
package.json
```

Meaningful changes include:

- runtime behavior
- question-bank content or metadata
- scoring or ranking logic
- safety boundary wording
- demo route behavior
- UI changes that affect demo interpretation
- docs used for hospital-facing explanation
- acceptance tests or freeze gates
- post-demo decision templates

Tiny local-only artifacts, generated logs, temporary screenshots, and ignored scratch files do not need a version bump.

## Bump Rules

### MAJOR

Use `major` when the product claim, safety boundary, route contract, or clinical workflow meaning changes.

Examples:

- V1 fixed questionnaire becomes V2 adaptive question navigation.
- The system starts using a new runtime architecture that changes the safety explanation.
- A route or output contract breaks previous demo scripts.

### MINOR

Use `minor` when the demo gains a meaningful capability without breaking the safety boundary.

Examples:

- Add a new governed demo case.
- Add a new question category.
- Add ASR UI while typed fallback still works.
- Add a new explanation panel or freeze gate.

### PATCH

Use `patch` for bounded fixes that preserve the demo claim.

Examples:

- CSS or mobile layout fix.
- Wording cleanup that does not change the safety boundary.
- Test hardening.
- Scoring calibration that preserves the intended selected questions.

## Required Workflow

Before finishing any meaningful change, run:

```bash
npm run version:bump -- patch "Short change summary"
npm run demo:ready
```

Use `minor` or `major` instead of `patch` when the bump rules require it.

## Enforcement

`npm run version:check` verifies:

- `VERSION.json`, `core/version/index.js`, and `package.json` agree.
- `docs/CHANGELOG.md` contains the current version heading.
- `README.md` exposes the current version.
- The current working tree includes a version update whenever meaningful files changed.

The check is intentionally conservative. If it fails, either bump the version or move temporary generated files out of the repo.

## Demo Rule

Every live walkthrough, backup recording, and post-demo decision note must mention the version label.

Current rule:

```text
Start the demo by saying: "This is UroPrevisit Navigator vX.Y.Z."
```
