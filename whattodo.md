프롬프트 1 (준비):

export CLAUDE_CODE_MAX_OUTPUT_TOKENS=64000

Run this first. Then read index-old.html and list:
1. Total line count
2. Which lines are <style> (chart CSS)
3. Which lines are <script> (chart JS + libraries)
4. Which lines are SVG content
5. Which lines are text content (title, KPIs, insights)

Do NOT write any files yet. Just report the structure.
프롬프트 2 (실행):

Now migrate into Template E in 3 steps:

Step A: Copy template-E-poster.html → index.html,
set data-theme="light", data-layout="portrait",
add #chart-slot dark background.
Populate {{placeholders}} from index-old.html text content.

Step B: Inject chart CSS (scoped under .chart-area)
and SVG elements into #chart-slot.

Step C: Inject all <script> tags at the bottom.

Write the complete file after all 3 steps.