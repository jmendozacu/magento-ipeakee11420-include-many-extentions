/*!
 * Braintree Data
 * https://www.braintreepayments.com
 * Copyright (c) 2009-2014 Braintree, a division of PayPal, Inc.
 *
 * Licensed under the MIT License.
 * http://opensource.org/licenses/MIT
 */

(function(){"use strict";var sjcl={cipher:{},hash:{},keyexchange:{},mode:{},misc:{},codec:{},exception:{corrupt:function(message){this.toString=function(){return"CORRUPT: "+this.message;};this.message=message;},invalid:function(message){this.toString=function(){return"INVALID: "+this.message;};this.message=message;},bug:function(message){this.toString=function(){return"BUG: "+this.message;};this.message=message;},notReady:function(message){this.toString=function(){return"NOT READY: "+this.message;};this.message=message;}}};if(typeof module!='undefined'&&module.exports){module.exports=sjcl;}
sjcl.bitArray={bitSlice:function(a,bstart,bend){a=sjcl.bitArray._shiftRight(a.slice(bstart/32),32-(bstart&31)).slice(1);return(bend===undefined)?a:sjcl.bitArray.clamp(a,bend-bstart);},extract:function(a,bstart,blength){var x,sh=Math.floor((-bstart-blength)&31);if((bstart+blength-1^bstart)&-32){x=(a[bstart/32|0]<<(32-sh))^(a[bstart/32+1|0]>>>sh);}else{x=a[bstart/32|0]>>>sh;}
return x&((1<<blength)-1);},concat:function(a1,a2){if(a1.length===0||a2.length===0){return a1.concat(a2);}
var out,i,last=a1[a1.length-1],shift=sjcl.bitArray.getPartial(last);if(shift===32){return a1.concat(a2);}else{return sjcl.bitArray._shiftRight(a2,shift,last|0,a1.slice(0,a1.length-1));}},bitLength:function(a){var l=a.length,x;if(l===0){return 0;}
x=a[l-1];return(l-1)*32+sjcl.bitArray.getPartial(x);},clamp:function(a,len){if(a.length*32<len){return a;}
a=a.slice(0,Math.ceil(len/32));var l=a.length;len=len&31;if(l>0&&len){a[l-1]=sjcl.bitArray.partial(len,a[l-1]&0x80000000>>(len-1),1);}
return a;},partial:function(len,x,_end){if(len===32){return x;}
return(_end?x|0:x<<(32-len))+len*0x10000000000;},getPartial:function(x){return Math.round(x/0x10000000000)||32;},equal:function(a,b){if(sjcl.bitArray.bitLength(a)!==sjcl.bitArray.bitLength(b)){return false;}
var x=0,i;for(i=0;i<a.length;i++){x|=a[i]^b[i];}
return(x===0);},_shiftRight:function(a,shift,carry,out){var i,last2=0,shift2;if(out===undefined){out=[];}
for(;shift>=32;shift-=32){out.push(carry);carry=0;}
if(shift===0){return out.concat(a);}
for(i=0;i<a.length;i++){out.push(carry|a[i]>>>shift);carry=a[i]<<(32-shift);}
last2=a.length?a[a.length-1]:0;shift2=sjcl.bitArray.getPartial(last2);out.push(sjcl.bitArray.partial(shift+shift2&31,(shift+shift2>32)?carry:out.pop(),1));return out;},_xor4:function(x,y){return[x[0]^y[0],x[1]^y[1],x[2]^y[2],x[3]^y[3]];}};sjcl.codec.hex={fromBits:function(arr){var out="",i,x;for(i=0;i<arr.length;i++){out+=((arr[i]|0)+0xF00000000000).toString(16).substr(4);}
return out.substr(0,sjcl.bitArray.bitLength(arr)/4);},toBits:function(str){var i,out=[],len;str=str.replace(/\s|0x/g,"");len=str.length;str=str+"00000000";for(i=0;i<str.length;i+=8){out.push(parseInt(str.substr(i,8),16)^0);}
return sjcl.bitArray.clamp(out,len*4);}};sjcl.hash.sha256=function(hash){if(!this._key[0]){this._precompute();}
if(hash){this._h=hash._h.slice(0);this._buffer=hash._buffer.slice(0);this._length=hash._length;}else{this.reset();}};sjcl.hash.sha256.hash=function(data){return(new sjcl.hash.sha256()).update(data).finalize();};sjcl.hash.sha256.prototype={blockSize:512,reset:function(){this._h=this._init.slice(0);this._buffer=[];this._length=0;return this;},update:function(data){if(typeof data==="string"){data=sjcl.codec.utf8String.toBits(data);}
var i,b=this._buffer=sjcl.bitArray.concat(this._buffer,data),ol=this._length,nl=this._length=ol+sjcl.bitArray.bitLength(data);for(i=512+ol&-512;i<=nl;i+=512){this._block(b.splice(0,16));}
return this;},finalize:function(){var i,b=this._buffer,h=this._h;b=sjcl.bitArray.concat(b,[sjcl.bitArray.partial(1,1)]);for(i=b.length+2;i&15;i++){b.push(0);}
b.push(Math.floor(this._length/0x100000000));b.push(this._length|0);while(b.length){this._block(b.splice(0,16));}
this.reset();return h;},_init:[],_key:[],_precompute:function(){var i=0,prime=2,factor;function frac(x){return(x-Math.floor(x))*0x100000000|0;}
outer:for(;i<64;prime++){for(factor=2;factor*factor<=prime;factor++){if(prime%factor===0){continue outer;}}
if(i<8){this._init[i]=frac(Math.pow(prime,1/2));}
this._key[i]=frac(Math.pow(prime,1/3));i++;}},_block:function(words){var i,tmp,a,b,w=words.slice(0),h=this._h,k=this._key,h0=h[0],h1=h[1],h2=h[2],h3=h[3],h4=h[4],h5=h[5],h6=h[6],h7=h[7];for(i=0;i<64;i++){if(i<16){tmp=w[i];}else{a=w[(i+1)&15];b=w[(i+14)&15];tmp=w[i&15]=((a>>>7^a>>>18^a>>>3^a<<25^a<<14)+
(b>>>17^b>>>19^b>>>10^b<<15^b<<13)+
w[i&15]+w[(i+9)&15])|0;}
tmp=(tmp+h7+(h4>>>6^h4>>>11^h4>>>25^h4<<26^h4<<21^h4<<7)+(h6^h4&(h5^h6))+k[i]);h7=h6;h6=h5;h5=h4;h4=h3+tmp|0;h3=h2;h2=h1;h1=h0;h0=(tmp+((h1&h2)^(h3&(h1^h2)))+(h1>>>2^h1>>>13^h1>>>22^h1<<30^h1<<19^h1<<10))|0;}
h[0]=h[0]+h0|0;h[1]=h[1]+h1|0;h[2]=h[2]+h2|0;h[3]=h[3]+h3|0;h[4]=h[4]+h4|0;h[5]=h[5]+h5|0;h[6]=h[6]+h6|0;h[7]=h[7]+h7|0;}};sjcl.cipher.aes=function(key){if(!this._tables[0][0][0]){this._precompute();}
var i,j,tmp,encKey,decKey,sbox=this._tables[0][4],decTable=this._tables[1],keyLen=key.length,rcon=1;if(keyLen!==4&&keyLen!==6&&keyLen!==8){throw new sjcl.exception.invalid("invalid aes key size");}
this._key=[encKey=key.slice(0),decKey=[]];for(i=keyLen;i<4*keyLen+28;i++){tmp=encKey[i-1];if(i%keyLen===0||(keyLen===8&&i%keyLen===4)){tmp=sbox[tmp>>>24]<<24^sbox[tmp>>16&255]<<16^sbox[tmp>>8&255]<<8^sbox[tmp&255];if(i%keyLen===0){tmp=tmp<<8^tmp>>>24^rcon<<24;rcon=rcon<<1^(rcon>>7)*283;}}
encKey[i]=encKey[i-keyLen]^tmp;}
for(j=0;i;j++,i--){tmp=encKey[j&3?i:i-4];if(i<=4||j<4){decKey[j]=tmp;}else{decKey[j]=decTable[0][sbox[tmp>>>24]]^decTable[1][sbox[tmp>>16&255]]^decTable[2][sbox[tmp>>8&255]]^decTable[3][sbox[tmp&255]];}}};sjcl.cipher.aes.prototype={encrypt:function(data){return this._crypt(data,0);},decrypt:function(data){return this._crypt(data,1);},_tables:[[[],[],[],[],[]],[[],[],[],[],[]]],_precompute:function(){var encTable=this._tables[0],decTable=this._tables[1],sbox=encTable[4],sboxInv=decTable[4],i,x,xInv,d=[],th=[],x2,x4,x8,s,tEnc,tDec;for(i=0;i<256;i++){th[(d[i]=i<<1^(i>>7)*283)^i]=i;}
for(x=xInv=0;!sbox[x];x^=x2||1,xInv=th[xInv]||1){s=xInv^xInv<<1^xInv<<2^xInv<<3^xInv<<4;s=s>>8^s&255^99;sbox[x]=s;sboxInv[s]=x;x8=d[x4=d[x2=d[x]]];tDec=x8*0x1010101^x4*0x10001^x2*0x101^x*0x1010100;tEnc=d[s]*0x101^s*0x1010100;for(i=0;i<4;i++){encTable[i][x]=tEnc=tEnc<<24^tEnc>>>8;decTable[i][s]=tDec=tDec<<24^tDec>>>8;}}
for(i=0;i<5;i++){encTable[i]=encTable[i].slice(0);decTable[i]=decTable[i].slice(0);}},_crypt:function(input,dir){if(input.length!==4){throw new sjcl.exception.invalid("invalid aes block size");}
var key=this._key[dir],a=input[0]^key[0],b=input[dir?3:1]^key[1],c=input[2]^key[2],d=input[dir?1:3]^key[3],a2,b2,c2,nInnerRounds=key.length/4-2,i,kIndex=4,out=[0,0,0,0],table=this._tables[dir],t0=table[0],t1=table[1],t2=table[2],t3=table[3],sbox=table[4];for(i=0;i<nInnerRounds;i++){a2=t0[a>>>24]^t1[b>>16&255]^t2[c>>8&255]^t3[d&255]^key[kIndex];b2=t0[b>>>24]^t1[c>>16&255]^t2[d>>8&255]^t3[a&255]^key[kIndex+1];c2=t0[c>>>24]^t1[d>>16&255]^t2[a>>8&255]^t3[b&255]^key[kIndex+2];d=t0[d>>>24]^t1[a>>16&255]^t2[b>>8&255]^t3[c&255]^key[kIndex+3];kIndex+=4;a=a2;b=b2;c=c2;}
for(i=0;i<4;i++){out[dir?3&-i:i]=sbox[a>>>24]<<24^sbox[b>>16&255]<<16^sbox[c>>8&255]<<8^sbox[d&255]^key[kIndex++];a2=a;a=b;b=c;c=d;d=a2;}
return out;}};sjcl.random={randomWords:function(nwords,paranoia){var out=[],i,readiness=this.isReady(paranoia),g;if(readiness===this._NOT_READY){throw new sjcl.exception.notReady("generator isn't seeded");}else if(readiness&this._REQUIRES_RESEED){this._reseedFromPools(!(readiness&this._READY));}
for(i=0;i<nwords;i+=4){if((i+1)%this._MAX_WORDS_PER_BURST===0){this._gate();}
g=this._gen4words();out.push(g[0],g[1],g[2],g[3]);}
this._gate();return out.slice(0,nwords);},setDefaultParanoia:function(paranoia){this._defaultParanoia=paranoia;},addEntropy:function(data,estimatedEntropy,source){source=source||"user";var id,i,tmp,t=(new Date()).valueOf(),robin=this._robins[source],oldReady=this.isReady(),err=0;id=this._collectorIds[source];if(id===undefined){id=this._collectorIds[source]=this._collectorIdNext++;}
if(robin===undefined){robin=this._robins[source]=0;}
this._robins[source]=(this._robins[source]+1)%this._pools.length;switch(typeof(data)){case"number":if(estimatedEntropy===undefined){estimatedEntropy=1;}
this._pools[robin].update([id,this._eventId++,1,estimatedEntropy,t,1,data|0]);break;case"object":var objName=Object.prototype.toString.call(data);if(objName==="[object Uint32Array]"){tmp=[];for(i=0;i<data.length;i++){tmp.push(data[i]);}
data=tmp;}else{if(objName!=="[object Array]"){err=1;}
for(i=0;i<data.length&&!err;i++){if(typeof(data[i])!="number"){err=1;}}}
if(!err){if(estimatedEntropy===undefined){estimatedEntropy=0;for(i=0;i<data.length;i++){tmp=data[i];while(tmp>0){estimatedEntropy++;tmp=tmp>>>1;}}}
this._pools[robin].update([id,this._eventId++,2,estimatedEntropy,t,data.length].concat(data));}
break;case"string":if(estimatedEntropy===undefined){estimatedEntropy=data.length;}
this._pools[robin].update([id,this._eventId++,3,estimatedEntropy,t,data.length]);this._pools[robin].update(data);break;default:err=1;}
if(err){throw new sjcl.exception.bug("random: addEntropy only supports number, array of numbers or string");}
this._poolEntropy[robin]+=estimatedEntropy;this._poolStrength+=estimatedEntropy;if(oldReady===this._NOT_READY){if(this.isReady()!==this._NOT_READY){this._fireEvent("seeded",Math.max(this._strength,this._poolStrength));}
this._fireEvent("progress",this.getProgress());}},isReady:function(paranoia){var entropyRequired=this._PARANOIA_LEVELS[(paranoia!==undefined)?paranoia:this._defaultParanoia];if(this._strength&&this._strength>=entropyRequired){return(this._poolEntropy[0]>this._BITS_PER_RESEED&&(new Date()).valueOf()>this._nextReseed)?this._REQUIRES_RESEED|this._READY:this._READY;}else{return(this._poolStrength>=entropyRequired)?this._REQUIRES_RESEED|this._NOT_READY:this._NOT_READY;}},getProgress:function(paranoia){var entropyRequired=this._PARANOIA_LEVELS[paranoia?paranoia:this._defaultParanoia];if(this._strength>=entropyRequired){return 1.0;}else{return(this._poolStrength>entropyRequired)?1.0:this._poolStrength/entropyRequired;}},startCollectors:function(){if(this._collectorsStarted){return;}
if(window.addEventListener){window.addEventListener("load",this._loadTimeCollector,false);window.addEventListener("mousemove",this._mouseCollector,false);}else if(document.attachEvent){document.attachEvent("onload",this._loadTimeCollector);document.attachEvent("onmousemove",this._mouseCollector);}
else{throw new sjcl.exception.bug("can't attach event");}
this._collectorsStarted=true;},stopCollectors:function(){if(!this._collectorsStarted){return;}
if(window.removeEventListener){window.removeEventListener("load",this._loadTimeCollector,false);window.removeEventListener("mousemove",this._mouseCollector,false);}else if(window.detachEvent){window.detachEvent("onload",this._loadTimeCollector);window.detachEvent("onmousemove",this._mouseCollector);}
this._collectorsStarted=false;},addEventListener:function(name,callback){this._callbacks[name][this._callbackI++]=callback;},removeEventListener:function(name,cb){var i,j,cbs=this._callbacks[name],jsTemp=[];for(j in cbs){if(cbs.hasOwnProperty(j)&&cbs[j]===cb){jsTemp.push(j);}}
for(i=0;i<jsTemp.length;i++){j=jsTemp[i];delete cbs[j];}},_pools:[new sjcl.hash.sha256()],_poolEntropy:[0],_reseedCount:0,_robins:{},_eventId:0,_collectorIds:{},_collectorIdNext:0,_strength:0,_poolStrength:0,_nextReseed:0,_key:[0,0,0,0,0,0,0,0],_counter:[0,0,0,0],_cipher:undefined,_defaultParanoia:6,_collectorsStarted:false,_callbacks:{progress:{},seeded:{}},_callbackI:0,_NOT_READY:0,_READY:1,_REQUIRES_RESEED:2,_MAX_WORDS_PER_BURST:65536,_PARANOIA_LEVELS:[0,48,64,96,128,192,256,384,512,768,1024],_MILLISECONDS_PER_RESEED:30000,_BITS_PER_RESEED:80,_gen4words:function(){for(var i=0;i<4;i++){this._counter[i]=this._counter[i]+1|0;if(this._counter[i]){break;}}
return this._cipher.encrypt(this._counter);},_gate:function(){this._key=this._gen4words().concat(this._gen4words());this._cipher=new sjcl.cipher.aes(this._key);},_reseed:function(seedWords){this._key=sjcl.hash.sha256.hash(this._key.concat(seedWords));this._cipher=new sjcl.cipher.aes(this._key);for(var i=0;i<4;i++){this._counter[i]=this._counter[i]+1|0;if(this._counter[i]){break;}}},_reseedFromPools:function(full){var reseedData=[],strength=0,i;this._nextReseed=reseedData[0]=(new Date()).valueOf()+this._MILLISECONDS_PER_RESEED;for(i=0;i<16;i++){reseedData.push(Math.random()*0x100000000|0);}
for(i=0;i<this._pools.length;i++){reseedData=reseedData.concat(this._pools[i].finalize());strength+=this._poolEntropy[i];this._poolEntropy[i]=0;if(!full&&(this._reseedCount&(1<<i))){break;}}
if(this._reseedCount>=1<<this._pools.length){this._pools.push(new sjcl.hash.sha256());this._poolEntropy.push(0);}
this._poolStrength-=strength;if(strength>this._strength){this._strength=strength;}
this._reseedCount++;this._reseed(reseedData);},_mouseCollector:function(ev){var x=ev.x||ev.clientX||ev.offsetX||0,y=ev.y||ev.clientY||ev.offsetY||0;sjcl.random.addEntropy([x,y],2,"mouse");},_loadTimeCollector:function(ev){sjcl.random.addEntropy((new Date()).valueOf(),2,"loadtime");},_fireEvent:function(name,arg){var j,cbs=sjcl.random._callbacks[name],cbsTemp=[];for(j in cbs){if(cbs.hasOwnProperty(j)){cbsTemp.push(cbs[j]);}}
for(j=0;j<cbsTemp.length;j++){cbsTemp[j](arg);}}};(function(){try{var ab=new Uint32Array(32);crypto.getRandomValues(ab);sjcl.random.addEntropy(ab,1024,"crypto.getRandomValues");}catch(e){}})();if(typeof JSON!=='object'){JSON={};}
(function(){'use strict';function f(n){return n<10?'0'+n:n;}
if(typeof Date.prototype.toJSON!=='function'){Date.prototype.toJSON=function(){return isFinite(this.valueOf())?this.getUTCFullYear()+'-'+
f(this.getUTCMonth()+1)+'-'+
f(this.getUTCDate())+'T'+
f(this.getUTCHours())+':'+
f(this.getUTCMinutes())+':'+
f(this.getUTCSeconds())+'Z':null;};String.prototype.toJSON=Number.prototype.toJSON=Boolean.prototype.toJSON=function(){return this.valueOf();};}
var cx=/[\u0000\u00ad\u0600-\u0604\u070f\u17b4\u17b5\u200c-\u200f\u2028-\u202f\u2060-\u206f\ufeff\ufff0-\uffff]/g,escapable=/[\\\"\x00-\x1f\x7f-\x9f\u00ad\u0600-\u0604\u070f\u17b4\u17b5\u200c-\u200f\u2028-\u202f\u2060-\u206f\ufeff\ufff0-\uffff]/g,gap,indent,meta={'\b':'\\b','\t':'\\t','\n':'\\n','\f':'\\f','\r':'\\r','"':'\\"','\\':'\\\\'},rep;function quote(string){escapable.lastIndex=0;return escapable.test(string)?'"'+string.replace(escapable,function(a){var c=meta[a];return typeof c==='string'?c:'\\u'+('0000'+a.charCodeAt(0).toString(16)).slice(-4);})+'"':'"'+string+'"';}
function str(key,holder){var i,k,v,length,mind=gap,partial,value=holder[key];if(value&&typeof value==='object'&&typeof value.toJSON==='function'){value=value.toJSON(key);}
if(typeof rep==='function'){value=rep.call(holder,key,value);}
switch(typeof value){case'string':return quote(value);case'number':return isFinite(value)?String(value):'null';case'boolean':case'null':return String(value);case'object':if(!value){return'null';}
gap+=indent;partial=[];if(Object.prototype.toString.apply(value)==='[object Array]'){length=value.length;for(i=0;i<length;i+=1){partial[i]=str(i,value)||'null';}
v=partial.length===0?'[]':gap?'[\n'+gap+partial.join(',\n'+gap)+'\n'+mind+']':'['+partial.join(',')+']';gap=mind;return v;}
if(rep&&typeof rep==='object'){length=rep.length;for(i=0;i<length;i+=1){if(typeof rep[i]==='string'){k=rep[i];v=str(k,value);if(v){partial.push(quote(k)+(gap?': ':':')+v);}}}}else{for(k in value){if(Object.prototype.hasOwnProperty.call(value,k)){v=str(k,value);if(v){partial.push(quote(k)+(gap?': ':':')+v);}}}}
v=partial.length===0?'{}':gap?'{\n'+gap+partial.join(',\n'+gap)+'\n'+mind+'}':'{'+partial.join(',')+'}';gap=mind;return v;}}
if(typeof JSON.stringify!=='function'){JSON.stringify=function(value,replacer,space){var i;gap='';indent='';if(typeof space==='number'){for(i=0;i<space;i+=1){indent+=' ';}}else if(typeof space==='string'){indent=space;}
rep=replacer;if(replacer&&typeof replacer!=='function'&&(typeof replacer!=='object'||typeof replacer.length!=='number')){throw new Error('JSON.stringify');}
return str('',{'':value});};}
if(typeof JSON.parse!=='function'){JSON.parse=function(text,reviver){var j;function walk(holder,key){var k,v,value=holder[key];if(value&&typeof value==='object'){for(k in value){if(Object.prototype.hasOwnProperty.call(value,k)){v=walk(value,k);if(v!==undefined){value[k]=v;}else{delete value[k];}}}}
return reviver.call(holder,key,value);}
text=String(text);cx.lastIndex=0;if(cx.test(text)){text=text.replace(cx,function(a){return'\\u'+
('0000'+a.charCodeAt(0).toString(16)).slice(-4);});}
if(/^[\],:{}\s]*$/.test(text.replace(/\\(?:["\\\/bfnrt]|u[0-9a-fA-F]{4})/g,'@').replace(/"[^"\\\n\r]*"|true|false|null|-?\d+(?:\.\d*)?(?:[eE][+\-]?\d+)?/g,']').replace(/(?:^|:|,)(?:\s*\[)+/g,''))){j=eval('('+text+')');return typeof reviver==='function'?walk({'':j},''):j;}
throw new SyntaxError('JSON.parse');};}}());sjcl.random.startCollectors();var BraintreeData={};BraintreeData.Environment=function(name,url,id){this.url=url,this.name=name,this.id=id,this.getId=function(){if(this.hasOwnProperty("customId")){return this.customId;}else{return this.id;}};this.withId=function(customId){this.customId=customId;return this;};};BraintreeData.iframeId="braintreeDataFrame";BraintreeData.collectionStarted=false;BraintreeData.environments={qa:new BraintreeData.Environment("qa","https://assets.qa.braintreegateway.com/data","600000"),sandbox:new BraintreeData.Environment("sandbox","https://assets.braintreegateway.com/sandbox/data","600000"),production:new BraintreeData.Environment("production","https://assets.braintreegateway.com/data","600000")};BraintreeData.setup=function(merchantPublicId,formId,env){this._setupCollector(env);this._setupForm(formId);BraintreeData.FraudNet.initialize();};BraintreeData._setupCollector=function(env){this.collectionStarted=true;this._initializeEnvironment(env);this._setupIFrame();};BraintreeData._setupForm=function(formId){var form=document.getElementById(formId);this._addHiddenField(form,"device_data",this._getDeviceData());};BraintreeData._getDeviceData=function(){if(this.collectionStarted){return JSON.stringify({device_session_id:this._getDeviceSessionId(),fraud_merchant_id:this.currentEnvironment.getId(),correlation_id:BraintreeData.FraudNet.getSessionId()});}else{throw("You must call setup or _setupCollector before _getDeviceData.");}}
BraintreeData._addHiddenField=function(form,name,value){if(this._formHasInput(form,name))return;var hiddenField=document.createElement("input");hiddenField.type="hidden";hiddenField.name=name;hiddenField.id=name;hiddenField.value=value;form.appendChild(hiddenField);};BraintreeData._getDeviceSessionId=function(){var bits,hexString;if(this.deviceSessionId==undefined){bits=sjcl.random.randomWords(4,0);hexString=sjcl.codec.hex.fromBits(bits);this.deviceSessionId=hexString;}
return this.deviceSessionId;};BraintreeData._setupIFrame=function(){var params,iframe,img,self=this;if(document.getElementById(BraintreeData.iframeId)){return;}
params="?m="+this.currentEnvironment.getId()+"&s="+this._getDeviceSessionId();iframe=document.createElement("iframe");iframe.width=1;iframe.id=BraintreeData.iframeId;iframe.height=1;iframe.frameBorder=0;iframe.scrolling="no";document.body.appendChild(iframe);setTimeout(function(){iframe.src=self.currentEnvironment.url+"/logo.htm"+params;iframe.innerHTML="<img src=\""+self.currentEnvironment.url+"/logo.gif"+params+"\" />";},10);};BraintreeData._formHasInput=function(form,input_id){var children=form.getElementsByTagName("input");var hasInput=false;for(var i=0;i<children.length;i+=1){if(children[i].id==input_id){hasInput=true;break;}}
return hasInput;};BraintreeData._initializeEnvironment=function(env){if(typeof(env)!=="undefined"&&env.hasOwnProperty("name")&&this.environments.hasOwnProperty(env.name)){this.currentEnvironment=this.environments[env.name];}else{throw(env+" is not a valid environment");}};BraintreeData.sjcl=sjcl;window.BraintreeData=BraintreeData;(function(window){var exports=BraintreeData.FraudNet={};var getSessionId=(function(){var id='';for(var i=0;i<32;i++){id+=Math.floor(Math.random()*16).toString(16);}
return function(){return id;}})();var parameters={'f':getSessionId(),'s':'BRAINTREE_SIGNIN','b':getBeaconId()};function getBeaconId(){var sessionId=getSessionId();var timestamp=new Date().getTime()/1000;return'https://b.stats.paypal.com/counter.cgi'+'?i=127.0.0.1'+'&p='+sessionId+'&t='+timestamp+'&a=14';}
function initialize(){createParameterBlock();createThirdPartyBlock();}
function createParameterBlock(){var el=document.body.appendChild(document.createElement('script'));el.type='application/json';el.setAttribute('fncls','fnparams-dede7cc5-15fd-4c75-a9f4-36c430ee3a99');el.text=JSON.stringify(parameters);}
function createThirdPartyBlock(){var scriptBaseURL='https://www.paypalobjects.com/webstatic/r/fb/';var dom,doc,where,iframe=document.createElement('iframe');iframe.src='javascript:false';iframe.title='';iframe.role='presentation';(iframe.frameElement||iframe).style.cssText='width: 0; height: 0; border: 0';where=document.getElementsByTagName('script');where=where[where.length-1];where.parentNode.insertBefore(iframe,where);try{doc=iframe.contentWindow.document;}catch(e){dom=document.domain;iframe.src='javascript:var d=document.open();d.domain="'+dom+'";void(0);';doc=iframe.contentWindow.document;}
doc.open()._l=function(){var js=this.createElement('script');if(dom){this.domain=dom;}
js.id='js-iframe-async';js.src=scriptBaseURL+'fb-all-prod.pp.min.js';this.body.appendChild(js);};doc.write('<body onload="document._l();">');doc.close();}
exports.initialize=initialize;exports.getSessionId=getSessionId;})(this);if(typeof window.onBraintreeDataLoad==='function'){window.onBraintreeDataLoad();}})();


