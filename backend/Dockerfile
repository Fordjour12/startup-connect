ARG PYTHON_VERSION=3.13.3
FROM python:${PYTHON_VERSION}-slim as base

ENV PYTHONDONTWRITEBYTECODE=1

ENV PYTHONUNBUFFERED=1

WORKDIR /app

ARG UID=10001
RUN adduser \
    --disabled-password \
    --gecos "" \
    --home "/nonexistent" \
    --shell "/sbin/nologin" \
    --no-create-home \
    --uid "${UID}" \
    appuser

COPY --from=ghcr.io/astral-sh/uv:latest /uv /uvx /bin/

COPY . /app
RUN chown -R appuser:appuser /app
USER appuser

RUN uv sync --frozen --no-cache

CMD ["/app/.venv/bin/fastapi","run", "app/main.py", "--port", "80","--host", "0.0.0.0"]
