// aimodel.js
import http from 'http';

export async function callLlama3(prompt) {
  return new Promise((resolve, reject) => {
    const data = JSON.stringify({
      model: 'llama3',
      prompt: prompt,
      stream: false
    });

    const options = {
      hostname: 'localhost',
      port: 11435,
      path: '/api/generate',
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Content-Length': data.length
      }
    };

    const req = http.request(options, (res) => {
      let result = '';
      res.on('data', (chunk) => {
        result += chunk;
      });
      res.on('end', () => {
        try {
          const parsed = JSON.parse(result);
          resolve(parsed.response);
        } catch (e) {
          reject('Error parsing LLaMA 3 response: ' + e.message);
        }
      });
    });

    req.on('error', (error) => {
      reject('LLaMA 3 request error: ' + error.message);
    });

    req.write(data);
    req.end();
  });
}
