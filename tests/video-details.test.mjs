import test from 'node:test';
import assert from 'node:assert/strict';
import worker from '../worker/clients.js';
import { videoDetailsResponse } from '../server/videoDetails.js';
const request = () => new Request('https://example.com/api/video-details', {headers:{Origin:'https://www.viannafx.media'}});
test('video details endpoint returns public metadata using the existing private secret', async t => {
 t.mock.method(globalThis,'fetch',async url=>{
  assert.equal(url.searchParams.get('id'),'rH3nU3F1oF8');
  assert.equal(url.searchParams.get('key'),'private-test-key');
  assert.equal(url.searchParams.get('part'),'snippet,statistics,contentDetails');
  return Response.json({items:[{id:'rH3nU3F1oF8',snippet:{title:'Title',channelTitle:'Mugm',channelId:'channel'},statistics:{viewCount:'100',likeCount:'20'},contentDetails:{duration:'PT1H11M20S'}}]});
 });
 const response=await worker.fetch(request(),{YT:'private-test-key',CLIENTS_RATE_LIMIT:{limit:async()=>({success:true})}});
 assert.equal(response.status,200);
 assert.equal(response.headers.get('Access-Control-Allow-Origin'),'https://www.viannafx.media');
 const data=await response.json();assert.equal(data.views,100);assert.equal(data.duration,'PT1H11M20S');assert.ok(!JSON.stringify(data).includes('private-test-key'));
});
test('video details fails safely when unavailable and keeps rate limiting',async()=>{
 assert.equal((await videoDetailsResponse('')).status,503);
 const response=await videoDetailsResponse('secret',async()=>{throw new Error('secret');});
 assert.equal(response.status,502);assert.deepEqual(await response.json(),{error:'unavailable'});
 assert.equal((await worker.fetch(request(),{CLIENTS_RATE_LIMIT:{limit:async()=>({success:false})}})).status,429);
});
