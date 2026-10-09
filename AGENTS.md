<!-- LOVABLE:BEGIN -->
> [!IMPORTANT]
> This project is connected to [Lovable](https://lovable.dev). Avoid rewriting
> published git history — force pushing, or rebasing/amending/squashing commits
> that are already pushed — as it rewrites history on Lovable's side and the
> user will likely lose their project history.
>
> Commits you push to the connected branch sync back to Lovable and show up in
> the editor, so keep the branch in a working state.
<!-- LOVABLE:END -->

- Use TanStack file routes inside one shared application shell; client-side navigation keeps the operational workflow in one SPA.
- Keep quotation data and all reactive financial calculations in the Zustand useQuotationStore module, so every view uses the same values.
- Treat the current application as session-only frontend state; do not claim remote persistence, identity verification, secure shared access or electronic signatures without connected services.
- Generate generic commercial PDFs client-side through the quotation PDF module and omit internal material, labor, margin and profit figures to preserve commercial confidentiality.
- Define all visual palette and reusable presentation styles in src/styles.css; feature modules consume semantic design tokens.
- Use the row-local Command/Popover supplier picker and shared supplier metadata helper; registration hands the searched name to QuickEntry so no separate supplier page interrupts costing.
