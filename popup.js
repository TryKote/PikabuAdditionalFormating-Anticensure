function base64encode(str) {
  console.log("base64encode");
  console.log("str:" + str);
  var b64chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefg' +
    'hijklmnopqrstuvwxyz0123456789+/=';
  var b64encoded = '';
  var chr1, chr2, chr3;
  var enc1, enc2, enc3, enc4;

  for (var i = 0; i < str.length;) {
    chr1 = str.charCodeAt(i++);
    chr2 = str.charCodeAt(i++);
    chr3 = str.charCodeAt(i++);

    enc1 = chr1 >> 2;
    enc2 = ((chr1 & 3) << 4) | (chr2 >> 4);

    enc3 = isNaN(chr2) ? 64 : (((chr2 & 15) << 2) | (chr3 >> 6));
    enc4 = isNaN(chr3) ? 64 : (chr3 & 63);

    b64encoded += b64chars.charAt(enc1) + b64chars.charAt(enc2) +
      b64chars.charAt(enc3) + b64chars.charAt(enc4);
  }
  return b64encoded;
}

function replace() {
	console.log("replace");
	console.log("in replace: "+ document.getElementById('TKtext').value);
	document.getElementById('TKcode').value = '[:'+base64encode(document.getElementById('TKtext').value)+':]';
}

function generator() {
	console.log("generator");
    setInterval(replace, 500);
    var all = document.getElementById('TKcontent').getElementsByTagName("textarea");
    all[0].style = "";
    all[1].style = "";
}

console.log("In js:");

document.addEventListener('DOMContentLoaded', function () {
  document.getElementById('genBtn').addEventListener('click', generator);
  //main();
});

/*document.addEventListener('DOMContentLoaded', function () {
  document.getElementById('TKcode').addEventListener('onchange', replace);
  //main();
});*/
