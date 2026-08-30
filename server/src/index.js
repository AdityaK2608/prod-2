import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import mongoose from 'mongoose';
import dns from 'node:dns/promises';
import net from 'node:net';

const app = express();
const PORT = process.env.PORT || 5000;
const NVD_BASE = 'https://services.nvd.nist.gov/rest/json/cves/2.0';
app.use(cors({ origin: process.env.CLIENT_ORIGIN?.split(',').map(v => v.trim()) || true }));
app.use(express.json({ limit: '100kb' }));

const searchSchema = new mongoose.Schema({ query:{type:String,required:true,trim:true,maxlength:200},resultCount:{type:Number,default:0},createdAt:{type:Date,default:Date.now} },{versionKey:false});
const Search=mongoose.models.Search||mongoose.model('Search',searchSchema);
let mongoReady=false;
if(process.env.MONGODB_URI){mongoose.connect(process.env.MONGODB_URI).then(()=>{mongoReady=true;console.log('MongoDB connected')}).catch(e=>console.error('MongoDB connection failed:',e.message))}

function normalizeTarget(value){
  let raw=String(value||'').trim(); if(!raw) throw new Error('A hostname or URL is required.');
  if(!/^https?:\/\//i.test(raw)) raw='https://'+raw;
  const u=new URL(raw); if(!['http:','https:'].includes(u.protocol)) throw new Error('Only HTTP and HTTPS targets are supported.');
  if(u.username||u.password) throw new Error('Credentials in target URLs are not allowed.');
  if(u.port && !['80','443'].includes(u.port)) throw new Error('Only ports 80 and 443 are supported.');
  if(net.isIP(u.hostname)) throw new Error('IP-address targets are not supported. Use a hostname.');
  if(u.hostname==='localhost'||u.hostname.endsWith('.localhost')||u.hostname.endsWith('.local')) throw new Error('Local targets are not allowed.');
  return u;
}
async function publicHost(host){
  const records=await dns.lookup(host,{all:true,verbatim:true});
  if(!records.length) throw new Error('Target did not resolve.');
  for(const r of records){const ip=r.address;if(net.isIP(ip)==4){const p=ip.split('.').map(Number);if(p[0]===10||p[0]===127||(p[0]===169&&p[1]===254)||(p[0]===172&&p[1]>=16&&p[1]<=31)||(p[0]===192&&p[1]===168))throw new Error('Private or link-local targets are blocked.')}else if(net.isIP(ip)==6&&(/^(::1|fc|fd|fe80)/i.test(ip)))throw new Error('Private or link-local targets are blocked.')}
  return records;
}
async function targetFetch(u,opts={}){await publicHost(u.hostname);return fetch(u,{redirect:'manual',signal:AbortSignal.timeout(8000),...opts})}

app.get('/api/health',(_req,res)=>res.json({ok:true,service:'sentinel-api',mongo:mongoReady}));
app.get('/api/cves',async(req,res)=>{try{const q=String(req.query.q||'').trim();const startIndex=Math.max(0,Number.parseInt(req.query.startIndex||'0',10)||0);const resultsPerPage=Math.min(50,Math.max(1,Number.parseInt(req.query.resultsPerPage||'12',10)||12));if(!q||q.length>200)return res.status(400).json({error:'A query between 1 and 200 characters is required.'});const params=new URLSearchParams({startIndex:String(startIndex),resultsPerPage:String(resultsPerPage)});if(/^CVE-\d{4}-\d{4,}$/i.test(q))params.set('cveId',q.toUpperCase());else params.set('keywordSearch',q);const response=await fetch(`${NVD_BASE}?${params}`,{headers:{Accept:'application/json',...(process.env.NVD_API_KEY?{apiKey:process.env.NVD_API_KEY}:{})}});const data=await response.json();if(!response.ok)return res.status(response.status).json({error:data?.message||`NVD returned HTTP ${response.status}`});if(mongoReady)Search.create({query:q,resultCount:data.totalResults||0}).catch(()=>{});res.json(data)}catch(error){res.status(502).json({error:'NVD lookup failed',detail:error.message})}});

app.get('/api/domain',async(req,res)=>{try{const u=normalizeTarget(req.query.target);const records=await publicHost(u.hostname);let response;try{response=await targetFetch(u,{method:'GET',headers:{'User-Agent':'Sentinel-Security-Scanner/1.0','Accept':'text/html,*/*'}})}catch(e){return res.status(502).json({error:'Target connection failed',detail:e.message})}res.json({target:u.hostname,url:u.origin,addresses:records.map(x=>x.address),reachable:response.status>=200&&response.status<500,status:response.status,statusText:response.statusText,redirect:response.headers.get('location')||null,server:response.headers.get('server')||null,contentType:response.headers.get('content-type')||null,securityHeaders:['strict-transport-security','content-security-policy','x-content-type-options','x-frame-options','referrer-policy','permissions-policy'].filter(h=>response.headers.has(h))})}catch(e){res.status(400).json({error:e.message})}});

app.get('/api/headers',async(req,res)=>{try{const u=normalizeTarget(req.query.target);const response=await targetFetch(u,{method:'HEAD',headers:{'User-Agent':'Sentinel-Security-Scanner/1.0'}});const names=['strict-transport-security','content-security-policy','x-content-type-options','x-frame-options','referrer-policy','permissions-policy','cross-origin-opener-policy','cross-origin-resource-policy'];const headers={};for(const n of names)headers[n]=response.headers.get(n);res.json({target:u.hostname,status:response.status,headers,score:names.filter(n=>headers[n]).length,total:names.length,grade:names.filter(n=>headers[n]).length>=6?'STRONG':names.filter(n=>headers[n]).length>=3?'MODERATE':'WEAK'})}catch(e){res.status(400).json({error:e.message})}});

app.get('/api/tls',async(req,res)=>{try{const u=normalizeTarget(req.query.target);if(u.protocol!=='https:')return res.json({target:u.hostname,tls:false,message:'Target does not use HTTPS.'});await publicHost(u.hostname);const response=await fetch(u,{method:'HEAD',redirect:'manual',signal:AbortSignal.timeout(8000),headers:{'User-Agent':'Sentinel-Security-Scanner/1.0'}});res.json({target:u.hostname,tls:true,httpsReachable:true,status:response.status,protocol:'HTTPS',strictTransportSecurity:response.headers.get('strict-transport-security')||null,certificateDetails:'Certificate-level inspection requires a dedicated TLS socket service and is not inferred from HTTP headers.'})}catch(e){res.status(400).json({error:e.message})}});

app.get('/api/dns',async(req,res)=>{try{const host=normalizeTarget(req.query.target).hostname;const [a,aaaa,mx,txt,ns,cname]=await Promise.allSettled([dns.resolve4(host),dns.resolve6(host),dns.resolveMx(host),dns.resolveTxt(host),dns.resolveNs(host),dns.resolveCname(host)]);const value=x=>x.status==='fulfilled'?x.value:[];const txtRows=value(txt).map(r=>r.join(''));res.json({target:host,A:value(a),AAAA:value(aaaa),MX:value(mx),TXT:txtRows,NS:value(ns),CNAME:value(cname),dnssecHint:txtRows.some(x=>/v=DKIM1|v=spf1/i.test(x))?'Mail/security TXT records detected':'No SPF/DKIM-style TXT record detected'} )}catch(e){res.status(400).json({error:e.message})}});

app.get('/api/search-history',async(_req,res)=>{if(!mongoReady)return res.json([]);const rows=await Search.find().sort({createdAt:-1}).limit(20).lean();res.json(rows)});
app.listen(PORT,()=>console.log(`Sentinel API listening on :${PORT}`));
