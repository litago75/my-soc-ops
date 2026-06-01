## Mandatory Development Checklist
- [ ] Lint: npm run lint
- [ ] Build: npm run build
- [ ] Test: npm run test

# Copilot Instructions for Bingo Mixer

## Architecture
- App shell: [src/App.tsx](src/App.tsx)
- State owner: [src/hooks/useBingoGame.ts](src/hooks/useBingoGame.ts)
- Rules engine: [src/utils/bingoLogic.ts](src/utils/bingoLogic.ts)
- Keep [src/components](src/components) mostly presentational.

## State and Rules
- Game flow: start -> playing -> bingo.
- Board is 5x5; center index 12 is free and pre-marked.
- Keep board/state updates immutable.
- Keep rule changes in [src/utils/bingoLogic.ts](src/utils/bingoLogic.ts).
- Keep persistence/version validation in [src/hooks/useBingoGame.ts](src/hooks/useBingoGame.ts).

## Key Types
- Source: [src/types/index.ts](src/types/index.ts)
- BingoSquareData: id, text, isMarked, isFreeSpace
- BingoLine: type, index, squares
- GameState: start | playing | bingo

## Testing and Validation
- Run lint, build, and test before completion.
- Main suite: [src/utils/bingoLogic.test.ts](src/utils/bingoLogic.test.ts)
- Test setup: [src/test/setup.ts](src/test/setup.ts)
- Add/update tests whenever behavior changes.

## Styling
- Use Tailwind v4 patterns already in the codebase.
- Tailwind specifics: [.github/instructions/tailwind-4.instructions.md](.github/instructions/tailwind-4.instructions.md)

## Common Tasks
- Update questions: [src/data/questions.ts](src/data/questions.ts)
- Change game logic (tests first): [src/utils/bingoLogic.ts](src/utils/bingoLogic.ts)
- Change state/persistence: [src/hooks/useBingoGame.ts](src/hooks/useBingoGame.ts)
- If scripts/setup/workflow change, update [README.md](README.md) and [workshop](workshop)
