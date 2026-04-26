# code-platforms-bridge — AGENT.md

## Purpose

Отдельный Node.js процесс — WebSocket мост между браузером и Claude Code CLI.

Запускается независимо от Next.js. Один процесс на всё приложение (один пользователь — один сервер).

**Порт:** `:3200`
**Бинарник Claude:** `/Users/romanbolshiyanov/.local/bin/claude` (или `CLAUDE_BIN` из env)
**Рабочая директория:** корень проекта (`../` относительно этой папки)

## Поток данных

```
PM нажимает "Отправить" в браузере
  → WebSocket.send({ type: 'stdin', data: 'prompt\n' })     [браузер → :3200]
    → pty.write(data)                                         [Bridge → Claude stdin]
      → Claude Code выполняет (читает файлы, запускает esbuild)
        → pty.onData(chunk)                                   [Claude stdout → Bridge]
          → ws.send({ type: 'stdout', data: chunk })          [:3200 → браузер]
            → браузер добавляет chunk к сообщению ассистента
```

## Протокол сообщений

### Браузер → Bridge
```json
{ "type": "stdin", "data": "текст промпта\n" }
```

### Bridge → Браузер
```json
{ "type": "stdout", "data": "строка от Claude" }
{ "type": "exit",   "code": 0 }
```

## Файлы

| Файл | Назначение |
|------|-----------|
| `server.js` | Точка входа — WebSocket сервер + node-pty |
| `package.json` | Зависимости: `ws`, `node-pty`, `dotenv` |

## Переменные окружения

| Переменная | По умолчанию | Назначение |
|-----------|-------------|-----------|
| `CLAUDE_BRIDGE_PORT` | `3200` | Порт WebSocket сервера |
| `CLAUDE_BIN` | `/Users/romanbolshiyanov/.local/bin/claude` | Путь к Claude Code CLI |

Читает `.env.local` из корня проекта через `dotenv`.

## Запуск

```bash
# Разработка (с авто-перезапуском)
cd code-platforms-bridge && npm run dev

# Продакшн
cd code-platforms-bridge && npm start
```

## Архитектурные решения

- **Один pty на WebSocket соединение** — при каждом подключении браузера создаётся новый Claude процесс. При закрытии WS процесс убивается.
- **Нельзя встраивать в Next.js** — отдельный процесс обязателен (см. `docs/SERVER_ARCHITECTURE.md` — правило "один процесс, одна задача").
- **Нет авторизации** — Bridge работает только на localhost, внешний доступ закрыт сетевыми правилами сервера.

## Следующие шаги

- [ ] Парсер `<Suggestion>` тегов из stdout — рендерить как кнопки в браузере
- [ ] Поддержка `&mode=terminal` — сырой вывод без ai-elements парсинга
- [ ] pm2 конфиг для автозапуска на сервере
