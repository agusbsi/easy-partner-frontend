<!-- LOVABLE:BEGIN -->
> [!IMPORTANT]
> This project is connected to [Lovable](https://lovable.dev). Avoid rewriting
> published git history — force pushing, or rebasing/amending/squashing commits
> that are already pushed — as it rewrites history on Lovable's side and the
> user will likely lose their project history.
>
> Commits you push to the connected branch sync back to Lovable and show up in
> the editor, so keep the branch in a working state.

## What Lovable manages

Rules outside this block are the project's own. Change the pieces below in
Lovable, not by hand. With the [Lovable MCP](https://mcp.lovable.dev)
connected, `send_message` asks Lovable to do it; otherwise ask the user to
use the editor.

- **Database.** Do not add or edit `supabase/migrations/` or `drizzle/`.
  Ask Lovable to change the schema.
- **Generated files.** Do not edit a file whose header says it is automatically
  generated.
- **AI gateway.** Keep model calls on Lovable's gateway, and keep
  `LOVABLE_API_KEY` out of browser code.
- **Connectors.** Lovable provides native connectors. `list_connectors` shows
  which are enabled; `add_connector` only returns the dashboard link. When a
  connector is enabled, calls go through the connector gateway and need
  `LOVABLE_API_KEY`. When Lovable does not provide one, users can bring their
  own key and store it in Secrets.
- **Secrets.** Lovable manages them. Do not put secret values in the repo.
<!-- LOVABLE:END -->

## Project rules (Easy Partner)

- Auth is an isolated mock service in `src/lib/auth/mock-auth.ts`; all UI calls go through it so a real backend can replace it without UI changes.
- Signed-in pages live under `src/routes/_authenticated/` (client-only, `ssr: false`) because the mock session lives in localStorage; admin-only routes check the role in their own `beforeLoad`.
- Desktop and mobile shells are separate components (`src/components/layout/`): at `lg+` a fixed-height frame of floating panels (sidebar, topbar, content) where only the content panel scrolls; below `lg` window scroll with app header + floating bottom nav; never show the sidebar on mobile.
- Nav structure is defined once in `src/components/layout/nav-config.ts` and feeds sidebar, mobile Menu launcher, breadcrumb and command search.
- Use `ResponsiveSheet` for forms/details: dialog on desktop, bottom sheet on mobile.
- In recharts, pass multiple series as arrays, never React fragments — its react-is cannot detect React 19 fragments and drops them.
