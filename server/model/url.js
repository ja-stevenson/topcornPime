//url.js
module.exports = getPlUrl;

function getPlUrl(movieName){
  var start = 'http://putlocker.is/watch-';
  var end = '-online-free-putlocker.html';
  // =========== manual removals ================
  movieName = movieName.toLowerCase();
  var swaps = {
    '&': 'and',
    ':': '',
    ' ': '-',
    '+': '-',
    "'": ''
  };
  var fixed = movieName.split('').reduce( (newTitle, char) =>{
    if(char === "'") console.log(swaps[char]);
    return (Object.keys(swaps).indexOf(char) > -1) ? 
      newTitle + swaps[char] :
      newTitle + char;
  },'');
  return [start + fixed + end, start+fixed+'-'+'XXXX'+end];
}