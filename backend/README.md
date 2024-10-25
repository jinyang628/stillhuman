# Backend

## Getting Started

Make sure your terminal is at the root of backend

### Using [Poetry](https://python-poetry.org/) for dependency management.

```bash
# Install Poetry (If using Windows, use WSL)
curl -sSL https://install.python-poetry.org | python3 -
```

You will need to set poetry in your `PATH` environment variable. See [Step 3](https://python-poetry.org/docs/#installing-with-the-official-installer).

Install all dependencies

```bash
# Install dependencies
poetry install
```

```bash
# Update/upgrade dependencies
poetry update
```

```bash
# Activate Python virtual environment
poetry shell
```

### Copy the existing environment template file

```bash
# Create .env file (by copying from .env.example)

# MacOS/Linux
cp .env.example .env

# Windows
copy .env.example .env
```

### Start the server

```bash
uvicorn app.routes.main:create_app --reload --host 0.0.0.0 --port 8080
```

#### Check style

Run the following command at the root of `backend`

```bash
# Style check
black .

# Import check
isort .
```
