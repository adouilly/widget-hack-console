// hack-console-widget.js
// Console Matrix Virtuelle autonome par Antoine Douilly
(function(global) {
  let hackConsoleRoot = null;
  let oldLog = null;

  function injectStyles() {
    if (document.getElementById('hack-console-style')) return;
    const style = document.createElement('style');
    style.id = 'hack-console-style';
    style.textContent = `
      .hack-console-widget {
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        height: 40vh;
        min-height: 150px;
        max-height: 40vh;
        background: black;
        color: #0f0;
        font-family: monospace;
        padding: 1em 2em;
        box-sizing: border-box;
        overflow: hidden;
        border-bottom: 2px solid var(--matrix-border-color, #0f0);
        resize: vertical;
        z-index: 9999;
        text-align: center;
        user-select: text;
        display: flex;
        flex-direction: column;
      }
      .hack-console-widget-canvas {
        position: absolute;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        z-index: 0;
        pointer-events: none;
      }
      .hack-console-widget h1, .hack-console-widget-author, .hack-console-widget-console {
        position: relative;
        z-index: 1;
      }
      .hack-console-widget-author {
        color: #0f0;
        font-size: 1em;
        margin-bottom: 0.5em;
        z-index: 2;
        pointer-events: none;
        text-align: center;
        position: relative;
      }
      .hack-console-widget-console {
        background: rgba(0,0,0,0.8);
        padding: 1em 0 2em 0;
        flex: 1 1 auto;
        min-height: 0;
        max-height: none;
        overflow-y: auto;
        text-align: left;
        white-space: pre-wrap;
        word-wrap: break-word;
        color: #fff;
        /* Scrollbar styles will be set dynamically */
      }
      .hack-console-widget-console::-webkit-scrollbar {
        width: 10px;
      }
      .hack-console-widget-console::-webkit-scrollbar-thumb {
        background: var(--matrix-scroll-color, #0f0);
        border-radius: 5px;
      }
      .hack-console-widget-console::-webkit-scrollbar-track {
        background: rgba(0,0,0,0.2);
      }
      .hack-console-widget-footer { display: none; }
    `;
    document.head.appendChild(style);
  }

  function injectHTML() {
    if (document.getElementById('hack-console-root')) return;
    hackConsoleRoot = document.createElement('div');
    hackConsoleRoot.id = 'hack-console-root';
    hackConsoleRoot.innerHTML = `
      <div class="hack-console-widget" style="position:fixed;top:0;left:0;width:100%;display:flex;flex-direction:column;height:40vh;min-height:150px;max-height:40vh;">
        <canvas class="hack-console-widget-canvas"></canvas>
        <h1>Console Virtuelle</h1>
        <div class="hack-console-widget-author">by Antoine Douilly</div>
        <div class="hack-console-widget-console" style="flex:1 1 auto;min-height:0;"></div>
      </div>
    `;
    document.body.appendChild(hackConsoleRoot);
  }

  function patchConsole() {
    const divConsole = hackConsoleRoot.querySelector('.hack-console-widget-console');
    oldLog = console.log;
    console.log = function(...args) {
      oldLog.apply(console, args);
      const ligne = document.createElement('div');
      ligne.textContent = args.join(' ');
      divConsole.appendChild(ligne);
      divConsole.scrollTop = divConsole.scrollHeight;
    };
  }

  function unpatchConsole() {
    if (oldLog) console.log = oldLog;
  }

  function matrixEffect() {
    const canvas = hackConsoleRoot.querySelector('.hack-console-widget-canvas');
    const ctx = canvas.getContext('2d');
    let width, height, drops = [];
    function resizeCanvas() {
      const rect = canvas.parentElement.getBoundingClientRect();
      width = canvas.width = rect.width;
      height = canvas.height = rect.height;
      const columns = Math.floor(width / 16);
      drops = new Array(columns).fill(1);
    }
    window.addEventListener('resize', resizeCanvas);
    resizeCanvas();
    const letters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789@#$%^&*()*&^%';
    // Tableau de couleurs Matrix
    const matrixColors = [
      '#0f0', // vert
      '#00f', // bleu
      '#a0f', // violet
      '#f00', // rouge
      '#fa0', // orange
      '#ff0'  // jaune
    ];
    let colorIndex = 0;
    let matrixColor = matrixColors[colorIndex], lastMatrixDraw = 0, lastColorChange = 0;
    function changeMatrixColor() {
      colorIndex = (colorIndex + 1) % matrixColors.length;
      matrixColor = matrixColors[colorIndex];
      const h1 = hackConsoleRoot.querySelector('h1');
      if (h1) h1.style.color = matrixColor;
      const author = hackConsoleRoot.querySelector('.hack-console-widget-author');
      if (author) author.style.color = matrixColor;
      // Changer la couleur de la scrollbar via CSS variable
      const consoleDiv = hackConsoleRoot.querySelector('.hack-console-widget-console');
      if (consoleDiv) consoleDiv.style.setProperty('--matrix-scroll-color', matrixColor);
      // Changer la couleur de la border-bottom via CSS variable
      const widgetDiv = hackConsoleRoot.querySelector('.hack-console-widget');
      if (widgetDiv) widgetDiv.style.setProperty('--matrix-border-color', matrixColor);
    }
    function drawMatrix(now) {
      if (!lastMatrixDraw || now - lastMatrixDraw > 33) {
        ctx.fillStyle = 'rgba(0, 0, 0, 0.1)';
        ctx.fillRect(0, 0, width, height);
        ctx.fillStyle = matrixColor;
        ctx.font = '16px monospace';
        drops.forEach((y, x) => {
          const text = letters.charAt(Math.floor(Math.random() * letters.length));
          const posX = x * 16;
          const posY = y * 16;
          ctx.fillText(text, posX, posY);
          if (posY > height && Math.random() > 0.975) drops[x] = 0;
          drops[x]++;
        });
        lastMatrixDraw = now;
      }
      if (!lastColorChange || now - lastColorChange > 10000) {
        changeMatrixColor();
        lastColorChange = now;
      }
      requestAnimationFrame(drawMatrix);
    }
    requestAnimationFrame(drawMatrix);
  }

  function initHackConsole() {
    injectStyles();
    injectHTML();
    patchConsole();
    matrixEffect();
    console.log("Voici ta console virtuelle 💻");
  }

  function removeHackConsole() {
    unpatchConsole();
    if (hackConsoleRoot) {
      hackConsoleRoot.remove();
      hackConsoleRoot = null;
    }
    const style = document.getElementById('hack-console-style');
    if (style) style.remove();
  }

  global.initHackConsole = initHackConsole;
  global.removeHackConsole = removeHackConsole;
})(window);
