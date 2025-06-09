const _colors = [
  "6f0000",
  "670933",
  "660099",
  "370084",
  "011fc7",
  "0034c2",
  "005284",
  "005f6e",
  "00594d",
  "006229",
  "3a810d",
  "628400",
  "998000",
  "996700",
  "994100",
  "771800",
  "145ca8",
];

const _VietnameseSigns = [
  "aAeEoOuUiIdDyY",
  "áàạảãâấầậẩẫăắằặẳẵ",
  "ÁÀẠẢÃÂẤẦẬẨẪĂẮẰẶẲẴ",
  "éèẹẻẽêếềệểễ",
  "ÉÈẸẺẼÊẾỀỆỂỄ",
  "óòọỏõôốồộổỗơớờợởỡ",
  "ÓÒỌỎÕÔỐỒỘỔỖƠỚỜỢỞỠ",
  "úùụủũưứừựửữ",
  "ÚÙỤỦŨƯỨỪỰỬỮ",
  "íìịỉĩ",
  "ÍÌỊỈĨ",
  "đ",
  "Đ",
  "ýỳỵỷỹ",
  "ÝỲỴỶỸ",
];

export function _RemoveSign4VietnameseString(str) {
  for (var i = 1; i < _VietnameseSigns.length; i++) {
    for (var j = 0; j < _VietnameseSigns[i].length; j++) {
      str = str.replaceAll(_VietnameseSigns[i][j], _VietnameseSigns[0][i - 1]);
    }
  }
  return str;
}

export function textToColor(s) {
  var standardizedStr = _RemoveSign4VietnameseString(s);
  var sum = 0;
  for (var i = 0; i < standardizedStr.length; i++) {
    sum += standardizedStr.charCodeAt(i);
  }
  return _colors[sum % _colors.length];
}
