interface FileForPreview {
  name: string;
  path: string;
  content: string;
}

export function generatePreviewHTML(files: FileForPreview[]): string {
  const componentFiles = files.filter(f => 
    f.name.endsWith('.tsx') || f.name.endsWith('.jsx')
  );

  if (componentFiles.length === 0) {
    return generateErrorHTML('No React components found. Please create a .tsx or .jsx file.');
  }

  let mainComponent = componentFiles.find(f => 
    f.name === 'App.tsx' || f.name === 'App.jsx'
  );

  if (!mainComponent) {
    mainComponent = componentFiles[0];
  }

  const componentsCode = componentFiles
    .map((file, index) => {
      let code = file.content;
      
      code = code.replace(/import\s+(?:type\s+)?.*?from\s+['"][^'"]*['"];?\s*/g, '');
      code = code.replace(/import\s+['"][^'"]*['"];?\s*/g, '');
      
      const isMainFile = file.name === mainComponent!.name;
      const componentName = isMainFile ? 'App' : `Component${index}`;
      
      if (isMainFile) {
        code = code.replace(/export\s+default\s+function\s+\w+/g, `function ${componentName}`);
        code = code.replace(/export\s+default\s+/g, `const ${componentName} = `);
      } else {
        code = code.replace(/export\s+default\s+function\s+\w+/g, `function ${componentName}`);
        code = code.replace(/export\s+default\s+/g, `const ${componentName} = `);
        code = code.replace(/export\s+(?:const|let|var|function|class)\s+/g, '');
      }
      
      code = code.replace(/export\s*\{[^}]*\};?/g, '');
      
      return code;
    })
    .join('\n\n');

  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Preview</title>
  <script crossorigin src="https://unpkg.com/react@18/umd/react.production.min.js"></script>
  <script crossorigin src="https://unpkg.com/react-dom@18/umd/react-dom.production.min.js"></script>
  <script src="https://unpkg.com/@babel/standalone/babel.min.js"></script>
  <script src="https://cdn.tailwindcss.com"></script>
  <style>
    body {
      margin: 0;
      padding: 0;
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', 'Oxygen',
        'Ubuntu', 'Cantarell', 'Fira Sans', 'Droid Sans', 'Helvetica Neue',
        sans-serif;
      -webkit-font-smoothing: antialiased;
      -moz-osx-font-smoothing: grayscale;
    }
    #root {
      min-height: 100vh;
    }
    .error-container {
      padding: 2rem;
      background: #fee;
      border-left: 4px solid #c00;
      margin: 1rem;
      font-family: monospace;
    }
  </style>
</head>
<body>
  <div id="root"></div>
  <script type="text/babel" data-type="module">
    const { useState, useEffect, useRef, useCallback, useMemo } = React;

    try {
      ${componentsCode}

      const root = ReactDOM.createRoot(document.getElementById('root'));
      root.render(React.createElement(App));
    } catch (error) {
      document.getElementById('root').innerHTML = \`
        <div class="error-container">
          <h2 style="color: #c00; margin-top: 0;">Preview Error</h2>
          <p><strong>Message:</strong> \${error.message}</p>
          <pre style="background: #f5f5f5; padding: 1rem; overflow: auto;">\${error.stack}</pre>
        </div>
      \`;
      console.error('Preview error:', error);
    }
  </script>
</body>
</html>`;
}

function generateErrorHTML(message: string): string {
  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Preview Error</title>
  <style>
    body {
      margin: 0;
      padding: 2rem;
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', sans-serif;
      background: #f9f9f9;
    }
    .error-box {
      background: #fff3cd;
      border: 1px solid #ffc107;
      border-radius: 8px;
      padding: 2rem;
      max-width: 600px;
      margin: 2rem auto;
    }
    h2 {
      color: #856404;
      margin-top: 0;
    }
    p {
      color: #856404;
      line-height: 1.6;
    }
  </style>
</head>
<body>
  <div class="error-box">
    <h2>⚠️ Preview Not Available</h2>
    <p>${message}</p>
  </div>
</body>
</html>`;
}
