'use strict';
var request = require('request');
var watson = require('watson-developer-cloud');
var fs = require('fs');
var parsing=null;

const conversation = require('../message');
const cloudant = require('../../util/db');
const db = cloudant.db;

var received=null;

var options = {
    url: "https://gateway.aibril-watson.kr/visual-recognition/api"+'/v3/classify?url=http://cfile24.uf.tistory.com/image/245A80485254E350180F5A&version=2016-05-17',
        method: 'GET',
        auth: {
            'user': '8eb1dd46-d7f1-44e1-a209-f4907993e742',
            'pass': 'EW5visw4WWUc'
        }
};
/*
classify_wp_wrequest_url : function(vr){
      var request = require('request');
      var options = {
          url: "https://gateway.aibril-watson.kr/visual-recognition/api"+'/v3/classify?url=http://cfile24.uf.tistory.com/image/245A80485254E350180F5A&version=2016-05-17',
          method: 'GET',
          auth: {
              'user': 8eb1dd46-d7f1-44e1-a209-f4907993e742,
              'pass': EW5visw4WWUc
          }
      };
      function callback(error, response, body) {
          if (!error && response.statusCode == 200) {
          console.log('result[VR] :', 'Success');
          console.log(body);
          }else{
          console.log('result[VR] :', 'fail');
          }
      }
      request(options, callback);
   }
/*
var vr = {
     "url": "https://gateway.aibril-watson.kr/visual-recognition/api",
     "username": "8eb1dd46-d7f1-44e1-a209-f4907993e742",
     "password": "EW5visw4WWUc"
};*/
let postMessage = (req, res) => {
  res.setHeader('Content-Type', 'application/json; charset=utf-8');
  let user_key = req.body.user_key;
  let type = req.body.type;
  let content = {
    'text' : req.body.content
  };
  if (type.includes("text")){

  //user_key를 사용하여 db에 저장된 context가 있는지 확인합니다.
  db.get(user_key).then(doc => {
    //저장된 context가 있는 경우 이를 사용하여 conversation api를 호출합니다.
    var request=require('request');
    var options={
      url: "https://def6d9d4-5f33-45f5-a919-3a337c64e8fa-bluemix:7f17624a1dabf62aa54d13ea600ae150ce2c8d1123d70f88e651f62af3e129f7@def6d9d4-5f33-45f5-a919-3a337c64e8fa-bluemix.cloudant.com/test/abf6aab6d84fc72e27ae1a7f10e9152b",
      method:'GET'
    };
    
    request(options,function(error, response, body){
    if(error == null) {
      received=JSON.parse(body);
    }
    else {
      console.log("error:::"+error);
    }
    });

    conversation.getConversationResponse(content, doc.context).then(data => {
      // context를 업데이트 합니다.
      db.insert(Object.assign(doc, {
        'context': Object.assign(data.context, {
          'timezone' : "Asia/Seoul"
        }),
      }));
      request(options,function(error, response, body){
        if(error == null) {
          received=JSON.parse(body);
        }
        else {
          console.log("error:::"+error);
        }
      });
      return res.json({
        "message" : {
          "text" : getOutputText(data)
        }
      });
    }).catch(function(err){
      return res.json({
          "message" : {
            "text" : JSON.stringify(err.message)
          }
      });
    });
  }).catch(function(err) {
    // 처음 대화인 경우 context가 없습니다. 이러한 경우 context 없이 conversation api를 호출합니다.
    var request=require('request');
    var options={
      url: "https://def6d9d4-5f33-45f5-a919-3a337c64e8fa-bluemix:7f17624a1dabf62aa54d13ea600ae150ce2c8d1123d70f88e651f62af3e129f7@def6d9d4-5f33-45f5-a919-3a337c64e8fa-bluemix.cloudant.com/test/281b3688b2739b7af544c19903281f09",
      method:'GET'
    };

    request(options,function(error, response, body){
    if(error == null) {
      received=JSON.parse(body);
    }
    else {
      console.log("error:::"+error);
    }
    });

    conversation.getConversationResponse(content, {}).then(data => {
      // context를 저장합니다.
      db.insert({
        '_id' : user_key,
        'user_key' : user_key,
        'context': data.context,
        'type' : 'kakao'
      });
          
      return res.json({
          "message" : {
            "text" : getOutputText(data)
          }
      });   
    }).catch(function(err){
      return res.json({
          "message" : {
            "text" : JSON.stringify(err.message)
          }
      });
    });
  
  });
  }
  else if (type.includes("photo")){
	  /*
	  var request = require('request');
	  var options = {
		url: "",
        method: 'GET',
        auth: {
            'user': '8eb1dd46-d7f1-44e1-a209-f4907993e742',
            'pass': 'EW5visw4WWUc'
        }
	  };
	  var new_url="https://gateway.aibril-watson.kr/visual-recognition/api/v3/classify?url="+"http://cfile24.uf.tistory.com/image/245A80485254E350180F5A&version=2016-05-17"
      options.url=new_url;

	  function callback(error, response, body) {
        if (!error && response.statusCode == 200) {
        console.log('result[VR] :', 'Success');
        return res.json({
			"message" : {
			"text" : "http://www.youtube.com/results?search_query="+parsing.images[0].classifiers[0].classes[0].class
		}
	  });
      }else{
        return res.json({
			"message" : {
			"text" : "failed"
		}
	  });
        }
      }
	  request(options, callback);
	  
	  options = {
          url: "https://gateway.aibril-watson.kr/visual-recognition/api"+'/v3/classify?url=http://cfile24.uf.tistory.com/image/245A80485254E350180F5A&version=2016-05-17',
          method: 'GET',
          auth: {
              'user': '8eb1dd46-d7f1-44e1-a209-f4907993e742',
              'pass': 'EW5visw4WWUc'
          }
      };
      function callback(error, response, body) {
          if (!error && response.statusCode == 200) {
          console.log('result[VR] :', 'Success');
          return res.json({
			"message" : {
			"text" : "http://www.youtube.com/results?search_query="+parsing.images[0].classifiers[0].classes[0].class
			}
		  });
          }else{
          console.log('result[VR] :', 'fail');
          }
      }
      request(options, callback);
*/

	request({
		url : 'https://gateway.aibril-watson.kr/visual-recognition/api/v3/classify?version=2016-05-17',
		method: 'POST',
		auth: {
			'user': '8eb1dd46-d7f1-44e1-a209-f4907993e742',
			'pass': 'EW5visw4WWUc'
		},
		formData : {
			images_file: {
				value:  fs.createReadStream('././image.jpg'),
				options: {
				filename: 'image.jpg',
				contentType: 'image/jpeg'
				}
			},
	classifier_ids : 'final_health_machine_32978688'
    }
	},function(error,response,body){
		parsing=JSON.parse(body)
		return res.json({
			"message" : {
			"text" : "http://www.youtube.com/results?search_query="+parsing.images[0].classifiers[0].classes[0].class
			}
		});
	});
	
	
  }//end if photo

};


let getOutputText = data => {

  let output = data.output;
  
  if (output.text.join("\\n").includes("%")){
    if (received.inuse.includes("on")){
    
      return "이 기구는 현재 다른사람이 사용중입니다.";
    }
    else if (received.inuse.includes("off")){
    
      return "이 기구는 현재 사용가능합니다.";
    }
  }
  else if(output.text && Array.isArray(output.text)){
    return output.text.join('\n');
  }
  else if(output.text){
    return output.text;
  }
  else return "";
}





module.exports = {
    'initialize': function(app, options) {
        app.post('/api/kakao/message', postMessage);
    }
};

