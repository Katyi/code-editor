const express = require('express');
const bodyParser = require('body-parser');
const { spawn } = require('child_process');
const vm = require('vm');
// const cors = require('cors');

const app = express();
const port = 3000;

app.use(bodyParser.json());

// app.use(cors());

//cors
app.use((req, res, next) => {
  res.setHeader('Access-Control-Allow-Credentials', true);
  res.setHeader('Access-Control-Allow-Origin', '*');
  // another common pattern
  // res.setHeader('Access-Control-Allow-Origin', req.headers.origin);
  res.setHeader(
    'Access-Control-Allow-Methods',
    'GET,OPTIONS,PATCH,DELETE,POST,PUT'
  );
  res.setHeader(
    'Access-Control-Allow-Headers',
    'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version'
  );
  next();
});

//test api
app.get('/test', (req, res) => {
  try {
    res.status(200).json({ message: 'test' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

app.post('/execute', async (req, res) => {
  const code = req.body.code;
  const language = req.body.language;
  let output = '';

  // Execution the code from client here
  if (language === 'python') {
    const pythonProcess = spawn('/usr/local/bin/python3', ['-c', code]);

    pythonProcess.stdout.on('data', (data) => {
      output += data.toString();
    });

    pythonProcess.stderr.on('data', (data) => {
      res.status(500).json({
        error: `Python code execution error: ${data}`,
      });
    });

    pythonProcess.on('close', (code) => {
      if (code === 0) {
        res.status(200).json({
          message: 'Python code executed successfully',
          output: output.trim(),
        });
      }
    });
  } else if (language === 'javascript') {
    const sandbox = {
      console: {
        log: (message) => {
          output += message + '\n';
        },
      },
    };

    try {
      vm.runInNewContext(code, sandbox);
      res.status(200).json({
        message: 'JavaScript code executed successfully',
        output: output.trim(),
      });
    } catch (err) {
      res.status(500).json({
        error: `JavaScript code execution error: ${err.message}`,
      });
    }
  } else {
    res.status(400).json({ error: 'Invalid language specified.' });
  }
});

app.listen(port, () => {
  console.log(`Server listening on port ${port}`);
});
