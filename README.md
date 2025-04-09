```markdown
# 🧪 Reaction Prediction AI — ChemPuma

日本語ロボと化学反応予測しよう。  
SMILES を入力するだけで、反応生成物を予測してくれるインタラクティブな AI アプリです。

![ChemPuma UI](frontend/robot-image.png)

---

## 🚀 Demo

https://user.github.io/Reaction_Prediction_AI_ChemPuma ← （GitHub Pages等にホストしたらここ）

```
Cl C C C Br . S c 1 c c n c c 1
```

入力すると...

→ 日本語ロボChemPumaが反応を考えて構造式まで描画してくれます！

---

## 🧠 What’s inside?

- 🧪 **SMILES-based Seq2Seq モデル** (Keras + Attention)
- 🧬 **分子構造描画** with [smiles-drawer](https://github.com/reymond-group/smilesDrawer)
- 💬 **チャット風 UI** でインタラクティブな反応予測
- ⚡ **FastAPI** を使った軽量な推論API

---

## 🔧 Getting Started

```bash
git clone https://github.com/yourname/Reaction_Prediction_AI_ChemPuma.git
cd Reaction_Prediction_AI_ChemPuma
```

### 🚢 Launch with Dev Container (VSCode)

> VSCode + Docker 推奨  
開いたら「Remote-Containers: Open Folder in Container」

---

### 📦 Backend

```bash
cd backend
uvicorn api:app --reload --host 0.0.0.0 --port 8000
```

### 🌐 Frontend

```bash
cd frontend
python -m http.server 5500
```

Access: http://localhost:5500

---

## 💡 Example

```python
from predict_utils import load_prediction_model, predict_product

model, vocab = load_prediction_model('./')
input_smiles = "C O . Cl C c 1 c n 2 c c c c c 2 n 1"
result = predict_product(input_smiles, model, vocab)
print(result)
```

---

## 📚 Model

| Component   | Description                    |
|-------------|--------------------------------|
| Encoder     | Bi-LSTM                        |
| Decoder     | LSTM + Attention               |
| Input       | SMILES tokenized (max_len=18)  |
| Output      | Product SMILES (max_len=18)    |

事前学習済みモデル: `backend/model_with_embedding.h5`  
語彙・設定: `backend/vocab_data.pkl`

---

## 🎓 Training

- US Patents dataset (1976–2016) の反応ペアを利用
- SMILES トークン列による NMT タスクとして学習
- モデル出力例などは [predict_utils.py](backend/predict_utils.py) を参照

---

## ⚠️ 注意

> このアプリは**学術・デモ用**です  
> 実験や医薬用途の使用は想定していません

---

## 📖 Reference

- [Schwaller et al. (2017)](https://arxiv.org/abs/1711.04810) - Neural Machine Translation of Organic Reactions
- [smilesDrawer](https://github.com/reymond-group/smilesDrawer) - 分子構造描画ライブラリ

---

## 🧑‍💻 Author

Created by [Formalin-K](https://github.com/Formalin-K)  
Pull requests / Issues always welcome 🚀

---

## 🪪 License

MIT License

```