#!/usr/bin/env node
'use strict'; /*jslint node:true es9:true*/
import {FastMCP} from 'fastmcp';
import {z} from 'zod';
import axios from 'axios';
import {tools as browser_tools} from './browser_tools.js';
import {createRequire} from 'node:module';
const require = createRequire(import.meta.url);
const package_json = require('./package.json');
const api_token = process.env.API_TOKEN;
const unlocker_zone = process.env.WEB_UNLOCKER_ZONE || 'mcp_unlocker';

if (!api_token)
    throw new Error('Cannot run MCP server without API_TOKEN env');

const api_headers = ()=>({
    'user-agent': `${package_json.name}/${package_json.version}`,
    authorization: `Bearer ${api_token}`
});

async function ensure_required_zones() {
    try {
        console.error('Checking for required zones...');
        let response = await axios({
            url: 'https://api.brightdata.com/zone/get_active_zones',
            method: 'GET',
            headers: api_headers(),
        });
        
        let zones = response.data || [];
        let has_unlocker_zone = zones.some(zone => zone.name === unlocker_zone);
        
        if (!has_unlocker_zone) {
            console.error(`Required zone "${unlocker_zone}" not found, creating it...`);
            let creation_response = await axios({
                url: 'https://api.brightdata.com/zone',
                method: 'POST',
                headers: {
                    ...api_headers(),
                    'Content-Type': 'application/json'
                },
                data: {
                    zone: {
                        name: unlocker_zone,
                        type: 'unblocker'
                    },
                    plan: {
                        type: 'unblocker'
                    }
                }
            });
            console.error(`Zone "${unlocker_zone}" created successfully`);
        } else {
            console.error(`Required zone "${unlocker_zone}" already exists`);
        }
    } catch(e) {
        console.error('Error checking/creating zones:', e.response?.data || e.message);
    }
}

await ensure_required_zones();

let server = new FastMCP({
    name: 'Bright Data',
    version: package_json.version,
});
let debug_stats = {tool_calls: {}};

server.addTool({
    name: 'search_engine',
    description: 'Scrape search results from Google, Bing or Yandex. Returns '
    +'SERP results in markdown (URL, title, description)',
    parameters: z.object({
        query: z.string(),
        engine: z.enum([
            'google',
            'bing',
            'yandex',
        ]).optional().default('google'),
    }),
    execute: tool_fn('search_engine', async({query, engine})=>{
        let response = await axios({
            url: 'https://api.brightdata.com/request',
            method: 'POST',
            data: {
                url: search_url(engine, query),
                zone: unlocker_zone,
                format: 'raw',
                data_format: 'markdown',
            },
            headers: api_headers(),
            responseType: 'text',
        });
        return response.data;
    }),
});

server.addTool({
    name: 'scrape_as_markdown',
    description: 'Scrape a single webpage URL with advanced options for '
    +'content extraction and get back the results in MarkDown language. '
    +'This tool can unlock any webpage even if it uses bot detection or '
    +'CAPTCHA.',
    parameters: z.object({url: z.string().url()}),
    execute: tool_fn('scrape_as_markdown', async({url})=>{
        let response = await axios({
            url: 'https://api.brightdata.com/request',
            method: 'POST',
            data: {
                url,
                zone: unlocker_zone,
                format: 'raw',
                data_format: 'markdown',
            },
            headers: api_headers(),
            responseType: 'text',
        });
        return response.data;
    }),
});
server.addTool({
    name: 'scrape_as_html',
    description: 'Scrape a single webpage URL with advanced options for '
    +'content extraction and get back the results in HTML. '
    +'This tool can unlock any webpage even if it uses bot detection or '
    +'CAPTCHA.',
    parameters: z.object({url: z.string().url()}),
    execute: tool_fn('scrape_as_html', async({url})=>{
        let response = await axios({
            url: 'https://api.brightdata.com/request',
            method: 'POST',
            data: {
                url,
                zone: unlocker_zone,
                format: 'raw',
            },
            headers: api_headers(),
            responseType: 'text',
        });
        return response.data;
    }),
});

server.addTool({
    name: 'session_stats',
    description: 'Tell the user about the tool usage during this session',
    parameters: z.object({}),
    execute: tool_fn('session_stats', async()=>{
        let used_tools = Object.entries(debug_stats.tool_calls);
        let lines = ['Tool calls this session:'];
        for (let [name, calls] of used_tools)
            lines.push(`- ${name} tool: called ${calls} times`);
        return lines.join('\n');
    }),
});

const datasets = [{
    id: 'amazon_product',
    dataset_id: 'gd_l7q7dkf244hwjntr0',
    description: [
        'Quickly read structured amazon product data.',
        'Requires a valid product URL with /dp/ in it.',
        'This can be a cache lookup, so it can be more reliable than scraping'
    ].join('\n'),
    inputs: ['url'],
}, {
    id: 'amazon_product_reviews',
    dataset_id: 'gd_le8e811kzy4ggddlq',
    description: [
        'Quickly read structured amazon product review data.',
        'Requires a valid product URL with /dp/ in it.',
        'This can be a cache lookup, so it can be more reliable than scraping'
    ].join('\n'),
    inputs: ['url'],
}, {
    id: 'linkedin_person_profile',
    dataset_id: 'gd_l1viktl72bvl7bjuj0',
    description: [
        'Quickly read structured linkedin people profile data.',
        'This can be a cache lookup, so it can be more reliable than scraping'
    ].join('\n'),
    inputs: ['url'],
}, {
    id: 'linkedin_company_profile',
    dataset_id: 'gd_l1vikfnt1wgvvqz95w',
    description: [
        'Quickly read structured linkedin company profile data',
        'This can be a cache lookup, so it can be more reliable than scraping'
    ].join('\n'),
    inputs: ['url'],
},
{
    id: 'zoominfo_company_profile',
    dataset_id: 'gd_m0ci4a4ivx3j5l6nx',
    description: [
        'Quickly read structured ZoomInfo company profile data.',
        'Requires a valid ZoomInfo company URL.',
        'This can be a cache lookup, so it can be more reliable than scraping'
    ].join('\n'),
    inputs: ['url'],
},
{
    id: 'instagram_profiles',
    dataset_id: 'gd_l1vikfch901nx3by4',
    description: [
        'Quickly read structured Instagram profile data.',
        'Requires a valid Instagram URL.',
        'This can be a cache lookup, so it can be more reliable than scraping'
    ].join('\n'),
    inputs: ['url'],
},
{
    id: 'instagram_posts',
    dataset_id: 'gd_lk5ns7kz21pck8jpis',
    description: [
        'Quickly read structured Instagram post data.',
        'Requires a valid Instagram URL.',
        'This can be a cache lookup, so it can be more reliable than scraping'
    ].join('\n'),
    inputs: ['url'],
},
{
    id: 'instagram_reels',
    dataset_id: 'gd_lyclm20il4r5helnj',
    description: [
        'Quickly read structured Instagram reel data.',
        'Requires a valid Instagram URL.',
        'This can be a cache lookup, so it can be more reliable than scraping'
    ].join('\n'),
    inputs: ['url'],
},
{
    id: 'instagram_comments',
    dataset_id: 'gd_ltppn085pokosxh13',
    description: [
        'Quickly read structured Instagram comments data.',
        'Requires a valid Instagram URL.',
        'This can be a cache lookup, so it can be more reliable than scraping'
    ].join('\n'),
    inputs: ['url'],
},
{
    id: 'facebook_posts',
    dataset_id: 'gd_lyclm1571iy3mv57zw',
    description: [
        'Quickly read structured Facebook post data.',
        'Requires a valid Facebook post URL.',
        'This can be a cache lookup, so it can be more reliable than scraping'
    ].join('\n'),
    inputs: ['url'],
},
{
    id: 'facebook_marketplace_listings',
    dataset_id: 'gd_lvt9iwuh6fbcwmx1a',
    description: [
        'Quickly read structured Facebook marketplace listing data.',
        'Requires a valid Facebook marketplace listing URL.',
        'This can be a cache lookup, so it can be more reliable than scraping'
    ].join('\n'),
    inputs: ['url'],
},
{
    id: 'facebook_company_reviews',
    dataset_id: 'gd_m0dtqpiu1mbcyc2g86',
    description: [
        'Quickly read structured Facebook company reviews data.',
        'Requires a valid Facebook company URL and number of reviews.',
        'This can be a cache lookup, so it can be more reliable than scraping'
    ].join('\n'),
    inputs: ['url','num_of_reviews'],
},
{
    id: 'x_posts',
    dataset_id: 'gd_lwxkxvnf1cynvib9co',
    description: [
        'Quickly read structured X post data.',
        'Requires a valid X post URL.',
        'This can be a cache lookup, so it can be more reliable than scraping'
    ].join('\n'),
    inputs: ['url'],
},
{
    id: 'zillow_properties_listing',
    dataset_id: 'gd_lfqkr8wm13ixtbd8f5',
    description: [
        'Quickly read structured zillow properties listing data.',
        'Requires a valid zillow properties listing URL.',
        'This can be a cache lookup, so it can be more reliable than scraping'
    ].join('\n'),
    inputs: ['url'],
},
{
    id: 'booking_hotel_listings',
    dataset_id: 'gd_m5mbdl081229ln6t4a',
    description: [
        'Quickly read structured booking hotel listings data.',
        'Requires a valid booking hotel listing URL.',
        'This can be a cache lookup, so it can be more reliable than scraping'
    ].join('\n'),
    inputs: ['url'],
},
{
    id: 'youtube_videos',
    dataset_id: 'gd_m5mbdl081229ln6t4a',
    description: [
        'Quickly read structured YpuTube videos data.',
        'Requires a valid YouTube video URL.',
        'This can be a cache lookup, so it can be more reliable than scraping'
    ].join('\n'),
    inputs: ['url'],
}];
for (let {dataset_id, id, description, inputs} of datasets)
{
    let parameters = {};
    for (let input of inputs)
        parameters[input] = input=='url' ? z.string().url() : z.string();
    server.addTool({
        name: `web_data_${id}`,
        description,
        parameters: z.object(parameters),
        execute: tool_fn(`web_data_${id}`, async(data)=>{
            let triggerResponse = await axios({
                url: 'https://api.brightdata.com/datasets/v3/trigger',
                params: {
                    dataset_id,
                    include_errors: true
                },
                method: 'POST',
                data: [data],
                headers: api_headers(),
            });
            if (!triggerResponse.data?.snapshot_id) 
            {
                throw new Error('No snapshot ID returned from trigger request');
            }
            const snapshotId = triggerResponse.data.snapshot_id;
            console.error(`[web_data_${id}] triggered collection with snapshot ID: ${snapshotId}`);
            
            const maxAttempts = 600; 
            let attempts = 0;
            
            while (attempts < maxAttempts) {
                try {
                    let snapshotResponse = await axios({
                        url: `https://api.brightdata.com/datasets/v3/snapshot/${snapshotId}`,
                        params: {
                            format: 'json'
                        },
                        method: 'GET',
                        headers: api_headers()
                    });
                    
                    if (snapshotResponse.data?.status === 'running') 
                    {
                        console.error(`[web_data_${id}] snapshot not ready, polling again (attempt ${attempts + 1}/${maxAttempts})`);
                        attempts++;
                        await new Promise(resolve => setTimeout(resolve, 1000)); 
                        continue;
                    }
                    
                    console.error(`[web_data_${id}] snapshot data received after ${attempts + 1} attempts`);
                    let resultData = JSON.stringify(snapshotResponse.data);
                    return resultData;
                    
                } catch (pollError) {
                    console.error(`[web_data_${id}] polling error: ${pollError.message}`);
                    attempts++;
                    await new Promise(resolve => setTimeout(resolve, 1000)); 
                }
            }
            throw new Error(`Timeout after ${maxAttempts} seconds waiting for data`);
        }),
    });
}

for (let tool of browser_tools)
    server.addTool(tool);

console.error('Starting server...');
server.start({transportType: 'stdio'});
function tool_fn(name, fn){
    return async data=>{
        debug_stats.tool_calls[name] = debug_stats.tool_calls[name]||0;
        debug_stats.tool_calls[name]++;
        let ts = Date.now();
        console.error(`[%s] executing %s`, name, JSON.stringify(data));
        try { return await fn(data); }
        catch(e){
            if (e.response)
            {
                console.error(`[%s] error %s %s: %s`, name, e.response.status,
                    e.response.statusText, e.response.data);
                let message = e.response.data;
                if (message?.length)
                    throw new Error(`HTTP ${e.response.status}: ${message}`);
            }
            else
                console.error(`[%s] error %s`, name, e.stack);
            throw e;
        } finally {
            let dur = Date.now()-ts;
            console.error(`[%s] tool finished in %sms`, name, dur);
        }
    };
}

function search_url(engine, query){
    let q = encodeURIComponent(query);
    if (engine=='yandex')
        return `https://yandex.com/search/?text=${q}`;
    if (engine=='bing')
        return `https://www.bing.com/search?q=${q}`;
    return `https://www.google.com/search?q=${q}`;
}

