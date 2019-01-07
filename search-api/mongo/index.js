var mongodb=require('mongodb').MongoClient;
var url='mongodb://localhost:27017';
module.exports=function(colname,ck){
     mongodb.connect(url,{ useNewUrlParser: true },function(err,con){
         if(err){
             return ck&&ck(err)
         }
         var col=con.db('list').collection(colname);
         ck&&ck(null,con,col);
     })
}