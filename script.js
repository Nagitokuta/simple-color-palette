document.addEventListener("DOMContentLoaded", function () {
  // パレットを配列で管理
  let currentPalette = [];

  // HTML要素を取得
  const colorPicker = document.getElementById("colorPicker");
  const selectedColorCode = document.getElementById("selectedColorCode");
  const selectedColorBox = document.getElementById("selectedColorBox");
  const addColorBtn = document.getElementById("addColorBtn");
  const currentPaletteDisplay = document.getElementById("currentPalette");
  const paletteNameInput = document.getElementById("paletteName");
  const savePaletteBtn = document.getElementById("savePaletteBtn");
  const viewSavedPalettesBtn = document.getElementById("viewSavedPalettesBtn");
  const savedPalettesSection = document.getElementById("savedPalettesSection");
  const savedPalettesList = document.getElementById("savedPalettesList");
  const backToMainBtn = document.getElementById("backToMainBtn");

  // 要素の存在チェック
  if (
    !colorPicker ||
    !selectedColorCode ||
    !selectedColorBox ||
    !addColorBtn ||
    !currentPaletteDisplay ||
    !paletteNameInput ||
    !savePaletteBtn ||
    !viewSavedPalettesBtn ||
    !savedPalettesSection ||
    !savedPalettesList ||
    !backToMainBtn
  ) {
    console.error("必要な要素が見つかりません");
    return;
  }

  // 初期表示
  updateSelectedColor();
  renderPalette();

  // イベントリスナーの設定
  colorPicker.addEventListener("input", updateSelectedColor);
  addColorBtn.addEventListener("click", addColorToPalette);
  savePaletteBtn.addEventListener("click", savePalette);
  viewSavedPalettesBtn.addEventListener("click", showSavedPalettesView);
  backToMainBtn.addEventListener("click", showMainView);

  // 選択色の表示を更新する関数
  function updateSelectedColor() {
    try {
      const selectedColor = colorPicker.value;
      selectedColorCode.textContent = selectedColor.toUpperCase();
      selectedColorBox.style.backgroundColor = selectedColor;
    } catch (error) {
      console.error("色の更新中にエラーが発生しました:", error);
    }
  }

  // パレットに色を追加する関数
  function addColorToPalette() {
    try {
      const color = colorPicker.value.toUpperCase();

      // パレットサイズの制限
      if (currentPalette.length >= 10) {
        alert("パレットには最大10色まで追加できます");
        return;
      }

      // 重複チェック
      if (currentPalette.includes(color)) {
        alert("この色は既にパレットに追加されています");
        return;
      }

      // パレットに色を追加
      currentPalette.push(color);

      // パレット表示を更新
      renderPalette();

      // フィードバック表示
      showAddFeedback();
    } catch (error) {
      console.error("色の追加中にエラーが発生しました:", error);
    }
  }

  // パレットを画面に反映する関数
  function renderPalette() {
    try {
      // 表示エリアをクリア
      currentPaletteDisplay.innerHTML = "";

      // パレットが空の場合のメッセージ
      if (currentPalette.length === 0) {
        return; // CSSの::beforeでメッセージを表示
      }

      // 各色に対してDOM要素を作成
      currentPalette.forEach(function (color, index) {
        const colorDiv = document.createElement("div");
        colorDiv.className = "color-item";
        colorDiv.style.backgroundColor = color;
        colorDiv.title = `${color} (クリックで削除)`;

        // クリックで削除機能
        colorDiv.addEventListener("click", function () {
          removeColorFromPalette(index);
        });

        currentPaletteDisplay.appendChild(colorDiv);
      });
    } catch (error) {
      console.error("パレットの表示中にエラーが発生しました:", error);
    }
  }

  // パレットから色を削除する関数
  function removeColorFromPalette(index) {
    try {
      if (confirm("この色をパレットから削除しますか？")) {
        currentPalette.splice(index, 1);
        renderPalette();
      }
    } catch (error) {
      console.error("色の削除中にエラーが発生しました:", error);
    }
  }

  // 追加完了のフィードバック表示
  function showAddFeedback() {
    const originalText = addColorBtn.textContent;
    const originalColor = addColorBtn.style.backgroundColor;

    addColorBtn.textContent = "追加完了！";
    addColorBtn.style.backgroundColor = "#27ae60";

    setTimeout(function () {
      addColorBtn.textContent = originalText;
      addColorBtn.style.backgroundColor = originalColor;
    }, 1000);
  }

  // パレット保存機能
  function savePalette() {
    try {
      // パレット名を取得
      const paletteName = paletteNameInput.value.trim();

      // バリデーション
      if (!paletteName) {
        alert("パレット名を入力してください");
        paletteNameInput.focus();
        return;
      }

      if (currentPalette.length === 0) {
        alert("パレットに色を追加してください");
        return;
      }

      // 既存の保存済みパレット配列をlocalStorageから取得
      let savedPalettes = getSavedPalettes();

      // 同じ名前のパレットが既に存在するかチェック
      const existingPalette = savedPalettes.find((p) => p.name === paletteName);
      if (existingPalette) {
        if (!confirm(`「${paletteName}」は既に存在します。上書きしますか？`)) {
          return;
        }
        // 既存のパレットを削除
        savedPalettes = savedPalettes.filter((p) => p.name !== paletteName);
      }

      // 新しいパレットオブジェクトを作成
      const newPalette = {
        id: Date.now(), // 簡易的なID生成
        name: paletteName,
        colors: currentPalette.slice(), // 配列のコピー
        createdAt: new Date().toISOString(),
      };

      // 配列に追加
      savedPalettes.push(newPalette);

      // localStorageに保存
      localStorage.setItem("savedPalettes", JSON.stringify(savedPalettes));

      // 成功フィードバック
      showSaveFeedback();

      // フォームをリセット
      paletteNameInput.value = "";
      currentPalette = [];
      renderPalette();
    } catch (error) {
      console.error("パレットの保存中にエラーが発生しました:", error);
      alert("パレットの保存に失敗しました");
    }
  }

  // 保存済みパレットを取得する関数
  function getSavedPalettes() {
    try {
      const saved = localStorage.getItem("savedPalettes");
      return saved ? JSON.parse(saved) : [];
    } catch (error) {
      console.error("保存済みパレットの取得中にエラーが発生しました:", error);
      return [];
    }
  }

  // 保存完了のフィードバック表示
  function showSaveFeedback() {
    const originalText = savePaletteBtn.textContent;
    const originalColor = savePaletteBtn.style.backgroundColor;

    savePaletteBtn.textContent = "保存完了！";
    savePaletteBtn.style.backgroundColor = "#27ae60";

    setTimeout(function () {
      savePaletteBtn.textContent = originalText;
      savePaletteBtn.style.backgroundColor = originalColor;
    }, 2000);
  }

  // 画面切り替え関数
  function showMainView() {
    savedPalettesSection.style.display = "none";
  }

  function showSavedPalettesView() {
    savedPalettesSection.style.display = "block";
    renderSavedPalettes();
  }

  // 保存済みパレット一覧を表示する関数
  function renderSavedPalettes() {
    try {
      // 保存済みパレットを取得
      const savedPalettes = getSavedPalettes();

      // 表示エリアをクリア
      savedPalettesList.innerHTML = "";

      // パレットが存在しない場合
      if (savedPalettes.length === 0) {
        const emptyMessage = document.createElement("div");
        emptyMessage.className = "empty-message";
        emptyMessage.textContent = "保存されたパレットはありません。";
        savedPalettesList.appendChild(emptyMessage);
        return;
      }

      // 各パレットを表示
      savedPalettes.forEach(function (palette, index) {
        const paletteItem = createPaletteItem(palette, index);
        savedPalettesList.appendChild(paletteItem);
      });
    } catch (error) {
      console.error("保存済みパレットの表示中にエラーが発生しました:", error);
    }
  }

  // パレットアイテムのDOM要素を作成する関数
  function createPaletteItem(palette, index) {
    // メインコンテナ
    const item = document.createElement("div");
    item.className = "saved-palette-item";

    // パレット名
    const nameDiv = document.createElement("div");
    nameDiv.className = "saved-palette-name";
    nameDiv.textContent = `パレット名: ${palette.name}`;
    item.appendChild(nameDiv);

    // 色表示エリア
    const colorsDiv = document.createElement("div");
    colorsDiv.className = "saved-palette-colors";

    palette.colors.forEach(function (color) {
      const colorDiv = document.createElement("div");
      colorDiv.className = "saved-color-item";
      colorDiv.style.backgroundColor = color;
      colorDiv.title = color;
      colorsDiv.appendChild(colorDiv);
    });

    item.appendChild(colorsDiv);

    // 作成日時表示
    if (palette.createdAt) {
      const dateDiv = document.createElement("div");
      dateDiv.className = "saved-palette-date";
      const date = new Date(palette.createdAt);
      dateDiv.textContent = `作成日: ${date.toLocaleDateString("ja-JP")}`;
      item.appendChild(dateDiv);
    }

    // アクションボタンエリア
    const actionsDiv = document.createElement("div");
    actionsDiv.className = "palette-actions";

    // コピーボタン
    const copyBtn = document.createElement("button");
    copyBtn.className = "copy-btn";
    copyBtn.textContent = "パレットをコピー";
    copyBtn.addEventListener("click", function () {
      copyPaletteToClipboard(palette);
    });
    actionsDiv.appendChild(copyBtn);

    // 削除ボタン
    const deleteBtn = document.createElement("button");
    deleteBtn.className = "delete-btn";
    deleteBtn.textContent = "削除";
    deleteBtn.addEventListener("click", function () {
      deletePalette(palette.id);
    });
    actionsDiv.appendChild(deleteBtn);

    // 編集ボタン（オプション）
    const editBtn = document.createElement("button");
    editBtn.className = "edit-btn";
    editBtn.textContent = "編集";
    editBtn.addEventListener("click", function () {
      editPalette(palette);
    });
    actionsDiv.appendChild(editBtn);

    item.appendChild(actionsDiv);

    return item;
  }

  // パレットをクリップボードにコピーする関数
  function copyPaletteToClipboard(palette) {
    try {
      // 色コードをカンマ区切りで結合
      const colorCodes = palette.colors.join(", ");

      // クリップボードAPIを使用
      if (navigator.clipboard && navigator.clipboard.writeText) {
        navigator.clipboard
          .writeText(colorCodes)
          .then(function () {
            showCopyFeedback("パレットの色コードをコピーしました！");
          })
          .catch(function (error) {
            console.error("クリップボードへのコピーに失敗しました:", error);
            fallbackCopyToClipboard(colorCodes);
          });
      } else {
        // フォールバック方法
        fallbackCopyToClipboard(colorCodes);
      }
    } catch (error) {
      console.error("コピー処理中にエラーが発生しました:", error);
      alert("コピーに失敗しました");
    }
  }

  // フォールバック用のコピー関数
  function fallbackCopyToClipboard(text) {
    try {
      const textArea = document.createElement("textarea");
      textArea.value = text;
      textArea.style.position = "fixed";
      textArea.style.left = "-999999px";
      textArea.style.top = "-999999px";
      document.body.appendChild(textArea);
      textArea.focus();
      textArea.select();

      const successful = document.execCommand("copy");
      document.body.removeChild(textArea);

      if (successful) {
        showCopyFeedback("パレットの色コードをコピーしました！");
      } else {
        alert("コピーに失敗しました");
      }
    } catch (error) {
      console.error("フォールバックコピーに失敗しました:", error);
      alert("コピーに失敗しました");
    }
  }

  // コピー完了のフィードバック表示
  function showCopyFeedback(message) {
    // 既存のフィードバック要素があれば削除
    const existingFeedback = document.querySelector(".copy-feedback");
    if (existingFeedback) {
      existingFeedback.remove();
    }

    // フィードバック要素を作成
    const feedback = document.createElement("div");
    feedback.className = "copy-feedback";
    feedback.textContent = message;
    feedback.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            background: #27ae60;
            color: white;
            padding: 12px 20px;
            border-radius: 6px;
            box-shadow: 0 2px 8px rgba(0,0,0,0.2);
            z-index: 1000;
            font-weight: 600;
        `;

    document.body.appendChild(feedback);

    // 3秒後に自動削除
    setTimeout(function () {
      if (feedback.parentNode) {
        feedback.parentNode.removeChild(feedback);
      }
    }, 3000);
  }

  // パレットを削除する関数
  function deletePalette(paletteId) {
    try {
      if (!confirm("このパレットを削除しますか？この操作は取り消せません。")) {
        return;
      }

      // 保存済みパレットを取得
      let savedPalettes = getSavedPalettes();

      // 指定されたIDのパレットを削除
      savedPalettes = savedPalettes.filter(function (palette) {
        return palette.id !== paletteId;
      });

      // localStorageに保存
      localStorage.setItem("savedPalettes", JSON.stringify(savedPalettes));

      // 表示を更新
      renderSavedPalettes();

      showCopyFeedback("パレットを削除しました");
    } catch (error) {
      console.error("パレットの削除中にエラーが発生しました:", error);
      alert("パレットの削除に失敗しました");
    }
  }

  // パレットを編集する関数
  function editPalette(palette) {
    try {
      if (
        confirm(
          `「${palette.name}」を編集しますか？現在のパレットは上書きされます。`
        )
      ) {
        // 現在のパレットに色をセット
        currentPalette = palette.colors.slice();
        paletteNameInput.value = palette.name;

        // メイン画面に戻る
        showMainView();

        // パレット表示を更新
        renderPalette();

        showCopyFeedback("パレットを編集モードで読み込みました");
      }
    } catch (error) {
      console.error("パレットの編集中にエラーが発生しました:", error);
      alert("パレットの編集に失敗しました");
    }
  }

  // 保存済みパレットを取得する関数（既存）
  function getSavedPalettes() {
    try {
      const saved = localStorage.getItem("savedPalettes");
      return saved ? JSON.parse(saved) : [];
    } catch (error) {
      console.error("保存済みパレットの取得中にエラーが発生しました:", error);
      return [];
    }
  }

  // その他の既存関数...
  // updateSelectedColor, addColorToPalette, renderPalette,
  // removeColorFromPalette, showAddFeedback, savePalette, showSaveFeedback
});
