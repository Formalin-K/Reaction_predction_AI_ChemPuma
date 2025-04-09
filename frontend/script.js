document.addEventListener("DOMContentLoaded", () => {
  const welcomeBtn = document.getElementById("start-btn");
  const welcomeScreen = document.getElementById("welcome-screen");
  const mainScreen = document.getElementById("main-screen");

  welcomeBtn.addEventListener("click", () => {
    welcomeScreen.style.display = "none";
    mainScreen.classList.remove("hidden");

    const inputField = document.getElementById("smiles-input");
    inputField.addEventListener("keydown", (e) => {
      if (e.key === "Enter") {
        handleInput();
      }
    });

    inputField.focus();
  });
});

function appendBotMessage(text) {
  const chatBox = document.getElementById('chat-box');
  const div = document.createElement('div');
  div.classList.add('message', 'bot');
  div.innerText = text;
  chatBox.appendChild(div);
  chatBox.scrollTop = chatBox.scrollHeight;
}

function appendUserMessage(text) {
  const chatBox = document.getElementById('chat-box');
  const div = document.createElement('div');
  div.classList.add('message', 'user');
  div.innerHTML = `<div class='bubble'>${text}</div>`;
  chatBox.appendChild(div);
  chatBox.scrollTop = chatBox.scrollHeight;
}

async function handleInput() {
  const inputField = document.getElementById('smiles-input');
  const input = inputField.value.trim();
  if (!input) return;

  appendUserMessage(input);
  inputField.value = '';

  const tokens = input.split(" ");
  const dotIndex = tokens.indexOf('.');
  const tokensA = dotIndex >= 0 ? tokens.slice(0, dotIndex) : tokens;
  const tokensB = dotIndex >= 0 ? tokens.slice(dotIndex + 1) : [];
  const smilesA = tokensA.join("");
  const smilesB = tokensB.join("");

  setTimeout(() => {
    appendBotMessage("こういう反応の結果が知りたいんだな？");
  }, 300);

  // 一行の化学式1 + 化学式2 表示
  setTimeout(() => {
    const chatBox = document.getElementById('chat-box');
    const msg = document.createElement('div');
    msg.classList.add('message', 'bot');

    const idA = `inputCanvasA_${Date.now()}_A`;
    const idB = `inputCanvasB_${Date.now()}_B`;

    const wrapperId = `reactants_${Date.now()}`;
    msg.innerHTML = `
      <div id="${wrapperId}" style="display: flex; align-items: center; gap: 10px; flex-wrap: nowrap;">
        <canvas id="${idA}" width="150" height="150"></canvas>
        ${smilesB ? "<span style='font-size:20px;'>+</span><canvas id='" + idB + "' width='150' height='150'></canvas>" : ""}
      </div>
    `;
    chatBox.appendChild(msg);

    drawSmiles(smilesA, idA);
    if (smilesB) drawSmiles(smilesB, idB);

    chatBox.scrollTop = chatBox.scrollHeight;
  }, 900);

  setTimeout(() => {
    appendBotMessage("考えるから、ちょっと待ってくれ。");
  }, 1400);

  let predicted = "";
  try {
    const res = await fetch('http://localhost:8000/predict', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ input })
    });
    const data = await res.json();
    predicted = data.output;
  } catch (e) {
    setTimeout(() => {
      appendBotMessage("うーん、ちょっと失敗だ。もう一回やってみてくれ。");
    }, 1800);
    return;
  }

  setTimeout(() => {
    appendBotMessage("お待たせ。こんなんじゃないか？");
  }, 2000);

  // 化学式1 + 化学式2 → 化学式3（横並び一行）
  setTimeout(() => {
    const chatBox = document.getElementById('chat-box');
    const resultMsg = document.createElement('div');
    resultMsg.classList.add('message', 'bot');

    const idA2 = `finalCanvasA_${Date.now()}_A`;
    const idB2 = `finalCanvasB_${Date.now()}_B`;
    const outputId = `outputCanvas_${Date.now()}`;

    resultMsg.innerHTML = `
      <div style="display: flex; align-items: center; gap: 10px; flex-wrap: nowrap;">
        <canvas id="${idA2}" width="150" height="150"></canvas>
        ${smilesB ? "<span style='font-size:20px;'>+</span><canvas id='" + idB2 + "' width='150' height='150'></canvas>" : ""}
        <span style='font-size:20px;'>→</span>
        <canvas id="${outputId}" width="150" height="150"></canvas>
      </div>
    `;
    chatBox.appendChild(resultMsg);

    drawSmiles(smilesA, idA2);
    if (smilesB) drawSmiles(smilesB, idB2);
    drawSmiles(predicted, outputId);

    chatBox.scrollTop = chatBox.scrollHeight;
  }, 2400);

  setTimeout(() => {
    appendBotMessage("まあねえ、私は所詮AIだ。\nそういうわけだから、正しいかどうかの判断は、自分ですべきだと思うぞ。");
  }, 2800);
}

function drawSmiles(smiles, canvasId) {
  const canvas = document.getElementById(canvasId);
  if (!canvas) return;

  SmilesDrawer.parse(smiles, (tree) => {
    const drawer = new SmilesDrawer.Drawer({ width: 150, height: 150 });
    drawer.draw(tree, canvas, 'light', false);
  }, (err) => {
    console.error(`SMILES parse error for ${smiles}:`, err);
  });
}











