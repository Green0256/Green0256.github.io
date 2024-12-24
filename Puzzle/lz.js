// 圧縮関数
function compressData(data) {
    const jsonString = JSON.stringify(data); // オブジェクトをJSON文字列化
    const compressed = LZString.compressToEncodedURIComponent(jsonString); // 圧縮＆URIエンコーディング
    return compressed;
}

// 復元関数
function decompressData(compressed) {
    const jsonString = LZString.decompressFromEncodedURIComponent(compressed); // 復元
    return JSON.parse(jsonString); // JSON文字列をオブジェクトに戻す
}
