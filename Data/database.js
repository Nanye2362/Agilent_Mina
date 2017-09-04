var commondata = {
  name: 'zz',
  age: '18',
  company: 'cognizant'
}
function fun1(){
  console.log('database');
}

module.exports = {
  dataContent: commondata
}
module.exports.fun1 = fun1;