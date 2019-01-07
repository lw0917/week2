var express = require('express');
var router = express.Router();
var mongo=require('../mongo');
var mongodb=require('mongodb');

/* GET home page. */
router.get('/api/list', function(req, res, next) {
    var val=req.query.val||'',
        page=req.query.page*1||1,
        size=req.query.size*1||10;
    var obj=val?{title:{$regex:val}}:{};
    console.log(obj)
    mongo('week',function(err,col,con){
        if(err){
           res.json({code:0,msg:err})
        }else{
            con.find(obj).count(function(error,num){
              
              if(error){
                res.json({code:0,msg:error})
              }else{
                var total=Math.ceil(num/size);//计算总页数
                var skips=(page-1)*size;       //计算跳过几条，从第几条开始
                con.find(obj).skip(skips).limit(size).toArray(function(errors,result){
                        if(errors){
                            res.json({code:0,msg:errors})
                        }else{
                           res.json({code:1,msg:result,total:total})
                        }
                        col.close();
                })
              }
          }) 
        }
    })
});
router.get('/api/del',function(req,res,next){
       var id=req.query.id;
       mongo('week',function(err,col,con){
        if(err){
           res.json({code:0,msg:err})
        }else{
           con.deleteOne({'_id':mongodb.ObjectId(id)},function(error,result){
              if(error){
                res.json({code:0,msg:error})
              }else{
                res.json({code:1,msg:'删除成功'})
              }
              col.close();
          })    
        }
    })
})

module.exports = router;
