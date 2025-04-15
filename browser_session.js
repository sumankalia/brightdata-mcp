'use strict'; /*jslint node:true es9:true*/
import * as playwright from 'playwright';

export class Browser_session {
    constructor({cdp_endpoint}){
        this.cdp_endpoint = cdp_endpoint;
    }

    async get_browser({log}={}){
        try {
            if (this._browser)
            {
                try { await this._browser.contexts(); }
                catch(e){
                    log?.(`Browser connection lost (${e.message}), `
                        +`reconnecting...`);
                    this._browser = null;
                    this._page = null;
                    this._browserClosed = true;
                }
            }
            if (!this._browser)
            {
                log?.(`Connecting to Bright Data Scraping Browser.`);
                this._browser = await playwright.chromium.connectOverCDP(
                    this.cdp_endpoint);
                this._browserClosed = false;
                this._browser.on('disconnected', () => {
                    log?.('Browser disconnected');
                    this._browser = null;
                    this._page = null;
                    this._browserClosed = true;
                });
                log?.('Connected to Bright Data Scraping Browser');
            }
            return this._browser;
        } catch(e){
            console.error('Error connecting to browser:', e);
            this._browser = null;
            this._page = null;
            this._browserClosed = true;
            throw e;
        }
    }

    async get_page(){
        try {
            if (this._browserClosed || !this._page)
            {
                const browser = await this.get_browser();
                const existingContexts = browser.contexts();
                if (existingContexts.length === 0)
                {
                    const context = await browser.newContext();
                    this._page = await context.newPage();
                }
                else
                {
                    const existingPages = existingContexts[0]?.pages();
                    if (existingPages && existingPages.length > 0)
                        this._page = existingPages[0];
                    else
                        this._page = await existingContexts[0].newPage();
                }
                this._browserClosed = false;
                this._page.once('close', ()=>{
                    this._page = null;
                });
            }
            return this._page;
        } catch(e){
            console.error('Error getting page:', e);
            this._browser = null;
            this._page = null;
            this._browserClosed = true;
            throw e;
        }
    }

    async close(){
        if (this._browser)
        {
            try { await this._browser.close(); }
            catch(e){ console.error('Error closing browser:', e); }
            this._browser = null;
            this._page = null;
            this._browserClosed = true;
        }
    }
}