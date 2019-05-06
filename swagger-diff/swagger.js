var SwaggerDiff = require('swagger-diff');
var fs = require("fs");
//jenkins构建ID
var sourceVer = 303;
var targetVer = 303;
var config = {"changes": {
  "breaks": {
    "major": 2,
    "minor": 3,
    "patch": 3,
    "unchanged": 3
  },
  "smooths": {
    "major": 0,
    "minor": 1,
    "patch": 2,
    "unchanged": 3
  }
}};


SwaggerDiff('http://mcwp.test.zhudb.com/swagger/'+sourceVer+'.js', 'http://mcwp.test.zhudb.com/swagger/'+targetVer+'.js', config).then(function (diff) {
    console.log(diff);
    fs.writeFile('swagger-diff.txt', JSON.stringify(diff),  function(err) {
        console.log(err);
   });
});
