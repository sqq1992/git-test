// import axios from 'axios';
import qs from 'qs';
import { clone } from 'src/common/public.js';
const urls = require('./mock');
const debug = process.env.NODE_ENV !== 'production';
const isTest = process.env.NODE_ENV === 'test';

function getUrl(api) {
  const url = urls[api]
  if(/^https?|\/\//.test(url)) return url
  return `${debug ? '/mock' : ''}${url}`
}


axios.defaults.withCredentials = true

export default function http(req,cb, errcb) {
    let _data = req.data ? clone(req.data) : {};
    if(_data instanceof FormData) {}
    else {
        for(let i in _data){
            if(typeof _data[i] == 'object'){
                _data[i] = JSON.stringify(_data[i]);
            }
        }
        if(isTest){
            _data.isTest = 1;
        }
        _data = qs.stringify( _data );
    }
    axios.post(getUrl(req.api_name),_data).then((res) => {
        if (/^1/.test(res.data.result)) {
            cb(res.data);
        } else {
            if(res.data.code && res.data.code == 302){
                window.location.href = res.data.url;
                return;
            }
            if(req.vm){
                let errorMessage = res.data.message.length > 30 ? res.data.message.slice(0,30) + '...' : res.data.message;
                req.vm.$message({
                    type: 'error',
                    message: errorMessage
                });
            }
            errcb && errcb(res.data);
        }
    }).catch((res) => {
        console.log(res)
        errcb && errcb(res.data);
    })
}
