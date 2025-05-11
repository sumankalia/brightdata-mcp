|Feature|Description|
|---|---|
|search_engine|Scrape search results from Google, Bing or Yandex. Returns SERP results in markdown (URL, title, description)|
|scrape_as_markdown|Scrape a single webpage URL with advanced options for content extraction and get back the results in MarkDown language. This tool can unlock any webpage even if it uses bot detection or CAPTCHA.|
|scrape_as_html|Scrape a single webpage URL with advanced options for content extraction and get back the results in HTML. This tool can unlock any webpage even if it uses bot detection or CAPTCHA.|
|session_stats|Tell the user about the tool usage during this session|
|web_data_amazon_product|Quickly read structured amazon product data. Requires a valid product URL with /dp/ in it. This can be a cache lookup, so it can be more reliable than scraping|
|web_data_amazon_product_reviews|Quickly read structured amazon product review data. Requires a valid product URL with /dp/ in it. This can be a cache lookup, so it can be more reliable than scraping|
|web_data_linkedin_person_profile|Quickly read structured linkedin people profile data. This can be a cache lookup, so it can be more reliable than scraping|
|web_data_linkedin_company_profile|Quickly read structured linkedin company profile data. This can be a cache lookup, so it can be more reliable than scraping|
|web_data_zoominfo_company_profile|Quickly read structured ZoomInfo company profile data. Requires a valid ZoomInfo company URL. This can be a cache lookup, so it can be more reliable than scraping|
|web_data_instagram_profiles|Quickly read structured Instagram profile data. Requires a valid Instagram URL. This can be a cache lookup, so it can be more reliable than scraping|
|web_data_instagram_posts|Quickly read structured Instagram post data. Requires a valid Instagram URL. This can be a cache lookup, so it can be more reliable than scraping|
|web_data_instagram_reels|Quickly read structured Instagram reel data. Requires a valid Instagram URL. This can be a cache lookup, so it can be more reliable than scraping|
|web_data_instagram_comments|Quickly read structured Instagram comments data. Requires a valid Instagram URL. This can be a cache lookup, so it can be more reliable than scraping|
|web_data_facebook_posts|Quickly read structured Facebook post data. Requires a valid Facebook post URL. This can be a cache lookup, so it can be more reliable than scraping|
|web_data_facebook_marketplace_listings|Quickly read structured Facebook marketplace listing data. Requires a valid Facebook marketplace listing URL. This can be a cache lookup, so it can be more reliable than scraping|
|web_data_facebook_company_reviews|Quickly read structured Facebook company reviews data. Requires a valid Facebook company URL and number of reviews. This can be a cache lookup, so it can be more reliable than scraping|
|web_data_x_posts|Quickly read structured X post data. Requires a valid X post URL. This can be a cache lookup, so it can be more reliable than scraping|
|web_data_zillow_properties_listing|Quickly read structured zillow properties listing data. Requires a valid zillow properties listing URL. This can be a cache lookup, so it can be more reliable than scraping|
|web_data_booking_hotel_listings|Quickly read structured booking hotel listings data. Requires a valid booking hotel listing URL. This can be a cache lookup, so it can be more reliable than scraping|
|web_data_youtube_videos|Quickly read structured YouTube videos data. Requires a valid YouTube video URL. This can be a cache lookup, so it can be more reliable than scraping|
|scraping_browser_navigate|Navigate a scraping browser session to a new URL|
|scraping_browser_go_back|Go back to the previous page|
|scraping_browser_go_forward|Go forward to the next page|
|scraping_browser_click|Click on an element. Avoid calling this unless you know the element selector (you can use other tools to find those)|
|scraping_browser_links|Get all links on the current page, text and selectors. It's strongly recommended that you call the links tool to check that your click target is valid|
|scraping_browser_type|Type text into an element|
|scraping_browser_wait_for|Wait for an element to be visible on the page|
|scraping_browser_screenshot|Take a screenshot of the current page|
|scraping_browser_get_html|Get the HTML content of the current page. Avoid using the full_page option unless it is important to see things like script tags since this can be large|
|scraping_browser_get_text|Get the text content of the current page|
