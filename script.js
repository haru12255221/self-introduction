document.addEventListener('DOMContentLoaded', function() {
  const form = document.getElementById('worksheet-form');
  const shareBtn = document.getElementById('share-btn');
  const shareResult = document.getElementById('share-result');
  const shareUrl = document.getElementById('share-url');
  const copyBtn = document.getElementById('copy-btn');
  const copyMessage = document.getElementById('copy-message');

  // URLからデータを読み込む
  loadFromUrl();

  // 共有ボタンのクリックイベント
  shareBtn.addEventListener('click', function() {
    const data = collectFormData();
    const encoded = encodeData(data);
    const url = window.location.origin + window.location.pathname + '?d=' + encoded;

    shareUrl.value = url;
    shareResult.style.display = 'flex';
  });

  // コピーボタンのクリックイベント
  copyBtn.addEventListener('click', function() {
    shareUrl.select();
    navigator.clipboard.writeText(shareUrl.value).then(function() {
      copyMessage.style.display = 'block';
      setTimeout(function() {
        copyMessage.style.display = 'none';
      }, 2000);
    });
  });

  // フォームデータを収集
  function collectFormData() {
    const data = {};

    // テキスト入力
    const textInputs = form.querySelectorAll('input[type="text"], textarea');
    textInputs.forEach(function(input) {
      if (input.name && input.value) {
        data[input.name] = input.value;
      }
    });

    // ラジオボタン
    const radioInputs = form.querySelectorAll('input[type="radio"]:checked');
    radioInputs.forEach(function(input) {
      if (input.name) {
        data[input.name] = input.value;
      }
    });

    return data;
  }

  // データをエンコード
  function encodeData(data) {
    const json = JSON.stringify(data);
    return btoa(encodeURIComponent(json));
  }

  // データをデコード
  function decodeData(encoded) {
    try {
      const json = decodeURIComponent(atob(encoded));
      return JSON.parse(json);
    } catch (e) {
      console.error('データの読み込みに失敗しました', e);
      return null;
    }
  }

  // URLからデータを読み込んでフォームに反映
  function loadFromUrl() {
    const params = new URLSearchParams(window.location.search);
    const encoded = params.get('d');

    if (!encoded) return;

    const data = decodeData(encoded);
    if (!data) return;

    // テキスト入力とテキストエリアに値を設定
    Object.keys(data).forEach(function(key) {
      const input = form.querySelector('[name="' + key + '"]');
      if (input) {
        if (input.type === 'radio') {
          const radio = form.querySelector('input[name="' + key + '"][value="' + data[key] + '"]');
          if (radio) {
            radio.checked = true;
          }
        } else {
          input.value = data[key];
        }
      }
    });
  }
});
