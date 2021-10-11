import { createServer } from 'http';
import { readFile } from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const outFilesDir = 'src';

const server = createServer((request, response) => {
  if (!request.url) {
    response.writeHead(400);
    response.end();
    return;
  }

  const fileName = request.url.slice(1);
  const filePath = path.join(
    fileURLToPath(import.meta.url),
    '../..',
    outFilesDir,
    fileName || 'index.html'
  );

  readFile(filePath, (error, fileBuffer) => {
    if (error) {
      console.log(error);
      response.writeHead(404);
      response.end();
      return;
    }

    const fileSuffix = fileName.slice(fileName.lastIndexOf('.') + 1);

    const contentType = contentTypes[fileSuffix] || contentTypes.html;

    response.writeHead(200, { 'content-type': contentType });
    response.write(fileBuffer);
    response.end();
  });
});

const port = process.env.PORT || 3000;

server.listen(port);
console.log(`server running on port ${port}`);

const contentTypes = {
  html: 'text/html',
  css: 'text/css',
  js: 'application/javascript',
};
