var AllReplaced = false;

function utf8_encode (str_data) { // Encodes an ISO-8859-1 string to UTF-8
  str_data = str_data.replace(/\r\n/g,"\n");
  var utftext = "";

  for (var n = 0; n < str_data.length; n++) {
    var c = str_data.charCodeAt(n);
    if (c < 128) {
      utftext += String.fromCharCode(c);
    } else if((c > 127) && (c < 2048)) {
      utftext += String.fromCharCode((c >> 6) | 192);
      utftext += String.fromCharCode((c & 63) | 128);
    } else {
      utftext += String.fromCharCode((c >> 12) | 224);
      utftext += String.fromCharCode(((c >> 6) & 63) | 128);
      utftext += String.fromCharCode((c & 63) | 128);
    }
  }
  return utftext;
}

function utf8_decode ( str_data ) { // Converts a string with ISO-8859-1 characters encoded with UTF-8   to single-byte
  var string = "", i = 0, c = c1 = c2 = 0;

  while ( i < str_data.length ) {
    c = str_data.charCodeAt(i);
    if (c < 128) {
      string += String.fromCharCode(c);
      i++;
    } else if((c > 191) && (c < 224)) {
      c2 = str_data.charCodeAt(i+1);
      string += String.fromCharCode(((c & 31) << 6) | (c2 & 63));
      i += 2;
    } else {
      c2 = str_data.charCodeAt(i+1);
      c3 = str_data.charCodeAt(i+2);
      string += String.fromCharCode(((c & 15) << 12) | ((c2 & 63) << 6) | (c3 & 63));
      i += 3;
    }
  }
  return string;
}


function base64encode(str) {
  str = utf8_encode(str);
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

function base64decode(str) {
    var b64chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefg'+
                   'hijklmnopqrstuvwxyz0123456789+/=';
    var b64decoded = '';
    var chr1, chr2, chr3;
    var enc1, enc2, enc3, enc4;
 
    str = str.replace(/[^a-z0-9\+\/\=]/gi, '');
 
    for (var i=0; i<str.length;) {
        enc1 = b64chars.indexOf(str.charAt(i++));
        enc2 = b64chars.indexOf(str.charAt(i++));
        enc3 = b64chars.indexOf(str.charAt(i++));
        enc4 = b64chars.indexOf(str.charAt(i++));
 
        chr1 = (enc1 << 2) | (enc2 >> 4);
        chr2 = ((enc2 & 15) << 4) | (enc3 >> 2);
        chr3 = ((enc3 & 3) << 6) | enc4;
 
        b64decoded = b64decoded + String.fromCharCode(chr1);
 
        if (enc3 < 64) {
            b64decoded += String.fromCharCode(chr2);
        }
        if (enc4 < 64) {
            b64decoded += String.fromCharCode(chr3);
        }
    }
    b64decoded = utf8_decode(b64decoded);
    return b64decoded;
}

function antixss(str) {
  str = str.replace('<', '&lt;');
  str = str.replace('>', '&gt;');
  str = str.replace(/\r\n|\r|\n/g,"<br>");
  return str;
}

function BodyAutoubdate() {
  for (var i = 0; i < document.getElementsByClassName('b-comment__content').length; i++) {
    var before = document.getElementsByClassName('b-comment__content')[i].innerHTML;

    //---------BASE64-decode module-------------- 
    var base = /\[\:([\s\S]*?)\:\]/gim;
    console.log('var base: ', base);
    var res = base.exec(before);

    if (res) {
      console.log('Res found: ', res[1]);
      res = base64decode(String(res[1]));
      console.log('Res decoded: ', res);
      res = antixss(res);
      console.log('After antixss: ', res);
    //------------------------------------------
      
    }
      //---------TAGS module---------------------------------------------------
      before = before.replace(/\[\:([\s\S]*?)\:\]/gim, ''+res+'');
      before = before.replace(/\[u\]([\s\S]*?)\[\/u\]/gim, '<u>$1</u>');
      before = before.replace(/\[s\]([\s\S]*?)\[\/s\]/gim, '<s>$1</s>');
      before = before.replace(/\[link\]([\link\S]*?)\[\/link\]/gim, '<a href="$1">$1</a>');
      before = before.replace(/\[h\]([\s\S]*?)\[\/h\]/gim, '<h4><b>$1</b></h4><hr>');
      before = before.replace(/\[line\]/gim, '<hr>');
      before = before.replace(/\[img\]((?:https?\:\/\/)[\S\s]*?(?:(?:\.jpg)|(?:\.png)))\[\/img\]/gim, '<a href="$1"><img class="b-image" data-viewable="true" data-large-image="" style="max-height: 600px; max-width: 800px; border-radius: 5%; float: top; margin-bottom: 2%;" src="$1"></a><br>');
      //-----------------------------------------------------------------------
    
    if (document.getElementsByClassName('b-comment__content')[i].innerHTML != before) {
      //--------Signature add module--------------
      before = '<style type="text/css">'+
                '.TKdiv {'+
                    
                '}'+
                '.TKfooter {'+
                    'color: #bbbbbb;'+
                    'font-size: 7pt;'+
                '}'+
                '.TKimg {'+
                    'width: 10px;'+
                    'height: 10px;'+
                    'border: 1px solid black;'+
                    'border-radius: 1px;'+
                    'position: relative;'+
                    'top: 3px;'+
                '}'+
              '</style>'+
              '<div class="TKdiv">'+before+'<footer class="TKfooter"><img class="TKimg" src="http://cs6.pikabu.ru/images/avatars/104/v104973-574379787.jpg"/> Created by TryKote</footer></div>';
      //----------------------------------------
      document.getElementsByClassName('b-comment__content')[i].innerHTML = before;
    }
  }  
}

function replace() {
  if (AllReplaced) return 0;
  AllReplaced = true;
  BodyAutoubdate();
  setInterval(BodyAutoubdate, 3000);
}


function onWindowLoad() {
    chrome.webNavigation.onCompleted.addListener(function(details) {
        chrome.tabs.executeScript(null, {
            code: 'replace();'
        });
    });
}

onWindowLoad();
