# Tooling Modes Guide

## Overview

This project supports three different execution modes for generating Lightning Web Components with SLDS styling. Each mode provides different levels of tooling support, which directly impacts the quality and compliance of the generated components.

## Execution Modes

### 1. Baseline Mode (Minimal Tooling)

**Purpose:** Generates components with minimal SLDS tooling support, serving as a baseline for comparison.

**Available Tools (2):**
- `create_lwc_component_from_prd` - Creates the initial component structure
- `orchestrate_lwc_component_optimization` - Applies basic optimizations

**Characteristics:**
- Most lightweight mode
- Limited SLDS guidance during generation
- Components require more manual refinement
- Useful for benchmarking and comparison

**How to Enable:**
```bash
ENABLE_SLDS_SKILLS=false \
TEST_MODEL=claude-4-5-sonnet \
TEST_CSV_UTTERANCES="C09:Simple" \
npm test -- createLwcFromCsvUtterances
```

**Metadata Identification:**
```json
{
  "baseline_slds": true,
  "sldsToolsEnabled": false,
  "testMode": "baseline"
}
```

### 2. MCP Default Mode (Enhanced Tooling)

**Purpose:** Uses Model Context Protocol (MCP) with expanded SLDS tooling for improved component quality.

**Available Tools (5):**
- `create_lwc_component_from_prd` - Creates the initial component structure
- `orchestrate_lwc_component_optimization` - Applies optimizations
- `guide_slds_styling` - Provides SLDS styling guidance
- `explore_slds_styling` - Explores SLDS patterns and examples
- `guide_design_general` - Offers general design system guidance

**Characteristics:**
- Moderate tooling support
- Better SLDS compliance than baseline
- More comprehensive styling guidance
- Direct tool invocation via MCP

**How to Enable:**
```bash
ENABLE_SLDS_SKILLS=false \
ENABLE_MCP_TOOLS=true \
TEST_MODEL=claude-4-5-sonnet \
TEST_CSV_UTTERANCES="C09:Simple" \
npm test -- createLwcFromCsvUtterances
```

**Metadata Identification:**
```json
{
  "baseline_slds": false,
  "sldsToolsEnabled": false,
  "testMode": "mcp",
  "executionMode": "mcp"
}
```

### 3. Skills Mode (Optimal Tooling)

**Purpose:** Uses Claude's Skills system with embedded SLDS knowledge for the highest quality components.

**Available Tools (3):**
- `create_lwc_component_from_prd` - Creates the initial component structure
- `orchestrate_lwc_component_optimization` - Applies optimizations
- `Skill` tool → invokes `applying-slds` skill with embedded knowledge

**Characteristics:**
- Highest SLDS compliance scores
- Integrated SLDS knowledge base
- Optimized workflow via Skills system
- Best production-readiness results

**How to Enable:**
```bash
ENABLE_SLDS_SKILLS=true \
TEST_MODEL=claude-4-5-sonnet \
TEST_CSV_UTTERANCES="C09:Simple" \
npm test -- createLwcFromCsvUtterances
```

**Metadata Identification:**
```json
{
  "baseline_slds": false,
  "sldsToolsEnabled": true,
  "skillsModeEnabled": true,
  "testMode": "skills",
  "executionMode": "skills"
}
```

## Performance Comparison

The performance differences between modes are driven by the specific tools and knowledge they access:

| Mode | Tools Count | SLDS Tooling | Avg. Compliance | Best Use Case |
|------|-------------|--------------|-----------------|---------------|
| **Baseline** | 2 | None | Lower | Benchmarking, minimal setup |
| **MCP Default** | 5 | Multiple guides | Medium | Balanced approach |
| **Skills** | 3 (+ embedded knowledge) | Integrated skill | Highest | Production components |

## Filtering Components by Mode

The dashboard includes filters to view components by execution mode:

### Baseline SLDS Filter
Shows only components generated with baseline mode (`baseline_slds: true`)

### Skills Mode Filter
Shows only components generated with Skills mode, identified by:
- `testMode === 'skills'` OR
- `executionMode === 'skills'` OR
- `skillsModeEnabled === true`

## Understanding Execution Traces

Each component's metadata includes an `executionTrace` object showing exactly which tools and knowledge were used:

### Baseline Mode Example:
```json
{
  "executionTrace": {
    "executedTools": [
      "ToolSearch",
      "create_lwc_component_from_prd",
      "orchestrate_lwc_component_optimization",
      "Write"
    ],
    "executedSkills": [],
    "embeddedKnowledge": [],
    "targetTools": [
      "create_lwc_component_from_prd",
      "orchestrate_lwc_component_optimization"
    ]
  }
}
```

### Skills Mode Example:
```json
{
  "executionTrace": {
    "executedTools": [
      "ToolSearch",
      "Skill",
      "create_lwc_component_from_prd",
      "orchestrate_lwc_component_optimization",
      "Bash"
    ],
    "executedSkills": [],
    "embeddedKnowledge": [
      "applying-slds"
    ],
    "targetTools": [
      "create_lwc_component_from_prd",
      "orchestrate_lwc_component_optimization",
      "Skill"
    ]
  }
}
```

## Key Differences

### Tool Count vs. Effectiveness

While MCP mode has 5 tools compared to Skills mode's 3, Skills mode achieves better results because:

1. **Embedded Knowledge**: The `applying-slds` skill includes comprehensive SLDS documentation and best practices
2. **Integrated Workflow**: Skills are optimized for the specific task of SLDS component generation
3. **Context Efficiency**: Single skill invocation vs. multiple tool calls

### When to Use Each Mode

**Use Baseline Mode when:**
- Creating benchmark comparisons
- Testing core functionality without SLDS overhead
- Learning the basic component structure

**Use MCP Mode when:**
- You need moderate SLDS support
- You want to understand individual tool contributions
- You're debugging specific SLDS guidance issues

**Use Skills Mode when:**
- Creating production-ready components
- Maximizing SLDS compliance scores
- Needing the most comprehensive SLDS guidance

## Analyzing Component Quality

To understand how tooling impacts quality, compare components across modes:

1. **Check the Dashboard Filters:**
   - Filter by "Baseline SLDS Only" to see baseline components
   - Filter by "Skills Mode Only" to see skills-enhanced components

2. **Review Execution Traces:**
   - Look at `executionTrace.executedTools` to see what was used
   - Check `embeddedKnowledge` array for skills-specific knowledge

3. **Compare Scores:**
   - SLDS Compliance scores (`scores.slds_linter`)
   - Overall Readiness scores (`scores.overall`)
   - Violation counts (`violations.warnings`, `violations.errors`)

## Environment Variables Summary

| Variable | Baseline | MCP | Skills |
|----------|----------|-----|--------|
| `ENABLE_SLDS_SKILLS` | `false` | `false` | `true` |
| `ENABLE_MCP_TOOLS` | `false` | `true` | N/A |
| `TEST_MODEL` | Any Claude model | Any Claude model | Any Claude model |

## Related Documentation

- [Baseline SLDS Label Feature](./BASELINE_SLDS_LABEL.md)
- [Implementation Summary](../IMPLEMENTATION_SUMMARY.md)
- [Quality Gate Configuration](../src/modules/dashboard/qualityGateConfig/README.md)
