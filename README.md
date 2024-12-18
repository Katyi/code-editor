## Code Editor

**🛠️ Стек**

Frontend: React + TypeScript + CodeMirror + Chakra UI
Backend: node.js + express

**💬 Основная информация о проекте**

Приложение является упрощенным редактором кода. Надо выбрать Python или Javascript, написать код и нажать кнопку Run. После нажатия кнопки код отправляется на cервер для выполнения и полученный результат появляется в нижнем текстовм поле.
Frontend часть загружена в vercel.com, Backend часть загружена в render.com.

**📚 Инструкция по запуску**

##### 1. Клонирование

```
git clone https://github.com/Katyi/code-editor.git
```

##### 2. Установите модули

```
В каждой папке react-codeMirror-app и server запустите команду: npm install
```

##### 3. Запуск

```
В папке server в строке const pythonProcess = spawn('python', ['-c', code]) вместо python напишите путь, например: /usr/local/bin/python3, иначе локально не будет работать проверка кода python

В папке server запустите команду: npm run start

Измените VITE_API_URL на http://localhost:3000 в .env в папке react-codeMirror-app

В папке react-codeMirror-app запустите команду: npm run dev
```
