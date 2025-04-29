<p align="center">
  <a href="https://brightdata.com/">
    <img src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRl_OPxT2TiPrtxwIjYlt1EzqoJ6mYX2LK4xw&s" width="100" alt="Bright Data Logo">
  </a>
</p>

<h1 align="center">Bright Data MCP</h1>
<h3 align="center">Enhance AI Agents with Real-Time Web Data</h3>

<div align="center">
  
[![smithery badge](https://smithery.ai/badge/@luminati-io/brightdata-mcp)](https://smithery.ai/server/@luminati-io/brightdata-mcp) 
<a href="https://glama.ai/mcp/servers/@luminati-io/brightdata-mcp">
  <img width="200" src="https://glama.ai/mcp/servers/@luminati-io/brightdata-mcp/badge" alt="Bright Data MCP server" />
</a>

</div>

## 🌟 Overview

Welcome to the official Bright Data Model Context Protocol (MCP) server, enabling LLMs, agents and apps to access, discover and extract web data in real-time. This server allows MCP clients, such as Claude Desktop, Cursor, Windsurf and others, to seamlessly search the web, navigate websites, take action and retrieve data - without getting blocked.

## ✨ Features

- **Real-time Web Access**: Access up-to-date information directly from the web
- **Bypass Geo-restrictions**: Access content regardless of location constraints
- **Web Unlocker**: Navigate websites with bot detection protection
- **Browser Control**: Optional remote browser automation capabilities
- **Seamless Integration**: Works with all MCP-compatible AI assistants

## 🚀 Quickstart with Claude Desktop

1. Install `nodejs` to get the `npx` command (node.js module runner). Installation instructions can be found on the [node.js website](https://nodejs.org/en/download)

2. Go to Claude > Settings > Developer > Edit Config > claude_desktop_config.json to include the following:

```json
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

## 🔧 Account Setup

1. Make sure you have an account on [brightdata.com](https://brightdata.com) (new users get free credit for testing, and pay as you go options are available)

2. Get your API key from the [user settings page](https://brightdata.com/cp/setting/users)

3. Create a Web Unlocker proxy zone called `mcp_unlocker` in your [control panel](https://brightdata.com/cp/zones)
   - You can override this zone in your MCP server with the env variable `WEB_UNLOCKER_ZONE`

4. (Optional) To enable browser control tools:
   - Visit your Bright Data control panel at [brightdata.com/cp/zones](https://brightdata.com/cp/zones)
   - Create a new 'Browser API' zone
   - Once created, copy the authentication string from the Browser API overview tab
   - The authentication string will be formatted like: `brd-customer-[your-customer-ID]-zone-[your-zone-ID]:[your-password]`

![Browser API Setup](https://github.com/user-attachments/assets/cb494aa8-d84d-4bb4-a509-8afb96872afe)

## 🔌 Other MCP Clients

To use this MCP server with other agent types, you should adapt the following to your specific software:

- The full command to run the MCP server is `npx @brightdata/mcp`
- The environment variable `API_TOKEN=<your-token>` must exist when running the server

## 💡 Usage Examples

Some example queries that this MCP server will be able to help with:

- "Google some movies that are releasing soon in [your area]"
- "What's Tesla's current market cap?"
- "What's the Wikipedia article of the day?"
- "What's the 7-day weather forecast in [your location]?"
- "Of the 3 highest paid tech CEOs, how long have their careers been?"

## 🎬 Demo

The videos below demonstrate a minimal use case for Claude Desktop:

![Demo](assets/Demo3.gif)
![Demo](assets/Demo.gif)

## ⚠️ Troubleshooting

### Timeouts when using certain tools

Some tools can involve reading web data, and the amount of time needed to load the page can vary by quite a lot in extreme circumstances.

To ensure that your agent will be able to consume the data, set a high enough timeout in your agent settings.

A value of `180s` should be enough for 99% of requests, but some sites load slower than others, so tune this to your needs.

## 📞 Support

If you encounter any issues or have questions, please reach out to the Bright Data support team or open an issue in the repository.
