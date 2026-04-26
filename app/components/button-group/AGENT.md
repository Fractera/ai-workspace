# components/button-group/

UI-примитив: группировка кнопок/инпутов в единый визуальный блок.

## Компоненты

| Файл | Экспорты | Описание |
|------|---------|----------|
| `button-group.tsx` | `ButtonGroup`, `ButtonGroupText`, `ButtonGroupSeparator`, `buttonGroupVariants` | Обёртки на cva + radix Slot |

## API

```tsx
<ButtonGroup orientation="horizontal | vertical">
  <Button>...</Button>
  <ButtonGroupSeparator />
  <ButtonGroupText>label</ButtonGroupText>
</ButtonGroup>
```

`ButtonGroup` — контейнер `role="group"`, управляет скруглениями и границами дочерних элементов через CSS selectors.
`ButtonGroupText` — текстовый элемент внутри группы (через `asChild` или `div`).
`ButtonGroupSeparator` — вертикальный/горизонтальный разделитель внутри группы.

## Потребители

- `components/ai-elements/message.client.tsx` — `MessageBranchSelector` (переключатель веток сообщения)
