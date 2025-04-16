# Bright Data MCP

Official [Bright Data](https://brightdata.com) [Model Context Protocol (MCP)](https://github.com/modelcontextprotocol) server that enables referencing public web data. This server allows MCP clients like Claude Desktop, Cursor, Windsurf, OpenAI Agents and others make decisions based on the information available on the web.

## Account setup

1. Make sure you have an account on [brightdata.com](https://brightdata.com) (new users get free credit for testing, and pay as you go options are available)
2. Get your API key from the [user settings page](https://brightdata.com/cp/setting/users)
3. Create a Web Unlocker proxy zone called `mcp_unlocker` in your [control panel](https://brightdata.com/cp/zones)
    - You can override this zone in your MCP server with the env variable `WEB_UNLOCKER_ZONE`
4. (Optional) To enable browser control tools:
   - Visit your Brightdata control panel at [brightdata.com/cp/zones](https://brightdata.com/cp/zones)
   - Create a new 'scraping browser' zone
   - Once created, copy the authentication string from the Scraping Browser overview tab
   - The authentication string will be formatted like: `brd-customer-[your-customer-ID]-zone-[your-zone-ID]:[your-password]`


## Quickstart with Claude Desktop

1. Install `nodejs` to get the `npx` command (node.js module runner). Installation instructions can be found on the [node.js website](https://nodejs.org/en/download)
2. Go to Claude > Settings > Developer > Edit Config > claude_desktop_config.json to include the following:

```
{
  "mcpServers": {
    "Bright Data": {
      "command": "npx",
      "args": ["@brightdata/mcp"],
      "env": {
        "API_TOKEN": "<insert-your-api-token-here>",
        "WEB_UNLOCKER_ZONE": "<optional if you want to override the default mcp_unlocker zone name>",
        "BROWSER_AUTH": "<optional if you want to enable remote browser control tools>"
      }
    }
  }
}
```

## Other MCP clients

To use this MCP server with other agent types, you should adapt the following to your specific software:
- the full command to run the MCP server is `npx @brightdata/mcp`
- the environment variable `API_TOKEN=<your-token>` must exist when running the server

## Usage

Some example queries that this MCP server will be able to help with:
- "Google some movies that are releasing soon in <area>"
- "What's tesla's market cap?"
- "What's the wikipedia article of the day?"
- "What's the 7d weather forecast in <location>?"
- "Of the 3 highest paid tech CEOs, how long has their career been?"

The videos below demonstrates a minimal use case for Claude Desktop:

![Demo](assets/Demo2.gif)

![Demo](assets/Demo.gif)

## Troubleshooting

### Timeouts when using certain tools

Some tools can involve reading web data, and the amount of time needed to load the page can vary by quite a lot in extreme circumstances.
To ensure that your agent will be able to conume the data, set a high enough timeout in your agent settings.
A value of `180s` should be enough for 99% of requests, but some sites load slower than others, so tune this to your needs.
