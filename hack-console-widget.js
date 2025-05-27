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
      .hack-console-widget { position: fixed; top: 0; left: 0; width: 100%; max-height: 40vh; min-height: 150px; background: black; color: #0f0; font-family: monospace; padding: 1em 2em; box-sizing: border-box; overflow-y: auto; border-bottom: 2px solid #0f0; resize: vertical; z-index: 9999; text-align: center; user-select: text; }
      .hack-console-widget-canvas { position: absolute; top: 0; left: 0; width: 100%; height: 100%; z-index: 0; pointer-events: none; }
      .hack-console-widget h1, .hack-console-widget-console { position: relative; z-index: 1; }
      .hack-console-widget-console { background: rgba(0,0,0,0.8); padding: 1em 0 2em 0; max-height: calc(40vh - 4em); overflow-y: auto; text-align: left; white-space: pre-wrap; word-wrap: break-word; }
      .hack-console-widget-footer { position: absolute; left: 0; right: 0; bottom: 0; width: 100%; text-align: center; color: #0f0; font-size: 1em; padding-bottom: 0.5em; z-index: 2; pointer-events: none; }
    `;
    document.head.appendChild(style);
  }

  function injectHTML() {
    if (document.getElementById('hack-console-root')) return;
    hackConsoleRoot = document.createElement('div');
    hackConsoleRoot.id = 'hack-console-root';
    hackConsoleRoot.innerHTML = `
      <div class="hack-console-widget" style="position:fixed;top:0;left:0;width:100%;">
        <canvas class="hack-console-widget-canvas"></canvas>
        <h1>Console Virtuelle</h1>
        <div class="hack-console-widget-console"></div>
        <div class="hack-console-widget-footer">by Antoine Douilly</div>
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
    let matrixColor = '#0f0', lastMatrixDraw = 0, lastColorChange = 0;
    function randomGreenColor() {
      const g = 128 + Math.floor(Math.random() * 128);
      const r = Math.floor(Math.random() * 40);
      const b = Math.floor(Math.random() * 40);
      return `rgb(${r},${g},${b})`;
    }
    function changeMatrixColor() {
      matrixColor = randomGreenColor();
      const h1 = hackConsoleRoot.querySelector('h1');
      if (h1) h1.style.color = matrixColor;
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
