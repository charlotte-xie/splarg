# Splarg

A pnpm project.

## Prerequisites

- Node.js (>= 18.0.0)
- pnpm (>= 8.0.0)

## Installation

1. Clone the repository:
```bash
git clone <repository-url>
cd splarg
```

2. Install dependencies:
```bash
pnpm install
```

## Development

Start the Next.js development server:
```bash
pnpm dev
```

Build and export the static site:
```bash
pnpm build
pnpm export
```

## Deploy to GitHub Pages

1. Make sure your changes are committed and pushed to GitHub.
2. Deploy with:
```bash
pnpm deploy
```
This will build, export, and publish the `out/` directory to the `gh-pages` branch.

## Scripts

- `pnpm start` - Start the application
- `pnpm dev` - Start the development server
- `pnpm test` - Run tests

## Project Structure

```
splarg/
├── package.json
├── pnpm-workspace.yaml
├── README.md
└── .gitignore
```

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Commit and push to your branch
5. Create a pull request

## License

ISC 