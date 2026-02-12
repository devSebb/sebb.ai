# View Contracts

## Pages

- `pages/home` composes section partials and expects:
  - `@identity`, `@links`, `@about`, `@tech_icons`, `@tech_stack`
  - `@experience`, `@specializations`, `@projects`, `@contact`
- `pages/resume` expects:
  - `@identity`, `@resume`
- `pages/project` expects:
  - `@identity`, `@projects`, `@project`, `@tech_icons`

## Shared partials

- `shared/_sidebar`
  - uses: `@identity`, `@links`
- `shared/_hero`
  - uses: `@identity`, `@links`, `@about`
- `shared/_techstach_carousel`
  - uses: `@tech_stack`, `@tech_icons`
- `shared/_experience`
  - uses: `@experience`
- `shared/_specializations`
  - uses: `@specializations`
- `shared/_projects`
  - uses: `@projects`
- `shared/_contact`
  - uses: `@contact`
