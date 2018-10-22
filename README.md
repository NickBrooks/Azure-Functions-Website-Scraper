# Azure-Functions-Website-Scraper
Scrape web pages for text, descriptions, images and other meta tags.

Simply deploy to Azure Functions as a Javascript function, and send a `POST` request to:

`https://{yourapp}.azurewebsites.net/api/ScrapeWebsite`

Make sure to include a URL in the body:

```
{
    "url": "https://www.youtube.com/watch?v=dQw4w9WgXcQ"
}
```

Result will look like this:

```
{
    "title": "Never Gonna Give You Up (Video)",
    "softTitle": "Never Gonna Give You Up (Video)",
    "date": "2009-10-24",
    "author": [],
    "publisher": "YouTube",
    "copyright": null,
    "favicon": "https://s.ytimg.com/yts/img/favicon-vfl8qSV2F.ico",
    "description": "Rick Astley - Never Gonna Give You Up (Official Music Video) - Listen On Spotify: http://smarturl.it/AstleySpotify Learn more about the brand new album ‘Beau...",
    "keywords": "Rick Astley, RickAstleyVEVO, RickAstleyvevo, Rick Astley VEVO, vevo, VEVO, official, Rick Roll, video, Rick Astley full album, music video, Rick Astley album...",
    "lang": "en",
    "canonicalLink": "https://www.youtube.com/watch?v=dQw4w9WgXcQ",
    "tags": [],
    "image": "https://i.ytimg.com/vi/dQw4w9WgXcQ/maxresdefault.jpg",
    "videos": [],
    "links": [
        {
            "text": "http://smarturl.it/AstleySpotify",
            "href": "/redirect?redir_token=BLjEqOfDR4L-p04IjRPUMVsXbpJ8MTU0MDI3NTQ4N0AxNTQwMTg5MDg3&q=http%3A%2F%2Fsmarturl.it%2FAstleySpotify&event=video_description&v=dQw4w9WgXcQ"
        },
        {
            "text": "https://RickAstley.lnk.to/BeautifulLi...",
            "href": "/redirect?redir_token=BLjEqOfDR4L-p04IjRPUMVsXbpJ8MTU0MDI3NTQ4N0AxNTQwMTg5MDg3&q=https%3A%2F%2FRickAstley.lnk.to%2FBeautifulLifeND&event=video_description&v=dQw4w9WgXcQ"
        },
        {
            "text": "http://smarturl.it/AstleyGHiTunes",
            "href": "/redirect?redir_token=BLjEqOfDR4L-p04IjRPUMVsXbpJ8MTU0MDI3NTQ4N0AxNTQwMTg5MDg3&q=http%3A%2F%2Fsmarturl.it%2FAstleyGHiTunes&event=video_description&v=dQw4w9WgXcQ"
        },
        {
            "text": "http://smarturl.it/AstleyGHAmazon",
            "href": "/redirect?redir_token=BLjEqOfDR4L-p04IjRPUMVsXbpJ8MTU0MDI3NTQ4N0AxNTQwMTg5MDg3&q=http%3A%2F%2Fsmarturl.it%2FAstleyGHAmazon&event=video_description&v=dQw4w9WgXcQ"
        },
        {
            "text": "http://www.rickastley.co.uk/",
            "href": "/redirect?redir_token=BLjEqOfDR4L-p04IjRPUMVsXbpJ8MTU0MDI3NTQ4N0AxNTQwMTg5MDg3&q=http%3A%2F%2Fwww.rickastley.co.uk%2F&event=video_description&v=dQw4w9WgXcQ"
        },
        {
            "text": "https://twitter.com/rickastley",
            "href": "/redirect?redir_token=BLjEqOfDR4L-p04IjRPUMVsXbpJ8MTU0MDI3NTQ4N0AxNTQwMTg5MDg3&q=https%3A%2F%2Ftwitter.com%2Frickastley&event=video_description&v=dQw4w9WgXcQ"
        },
        {
            "text": "https://www.facebook.com/RickAstley/",
            "href": "/redirect?redir_token=BLjEqOfDR4L-p04IjRPUMVsXbpJ8MTU0MDI3NTQ4N0AxNTQwMTg5MDg3&q=https%3A%2F%2Fwww.facebook.com%2FRickAstley%2F&event=video_description&v=dQw4w9WgXcQ"
        },
        {
            "text": "https://www.instagram.com/officialric",
            "href": "/redirect?redir_token=BLjEqOfDR4L-p04IjRPUMVsXbpJ8MTU0MDI3NTQ4N0AxNTQwMTg5MDg3&q=https%3A%2F%2Fwww.instagram.com%2Fofficialric&event=video_description&v=dQw4w9WgXcQ"
        }
    ],
    "text": "Rick Astley - Never Gonna Give You Up (Official Music Video) - Listen On Spotify: http://smarturl.it/AstleySpotify\n\nLearn more about the brand new album ‘Beautiful Life’: https://RickAstley.lnk.to/BeautifulLi...\n\nBuy On iTunes: http://smarturl.it/AstleyGHiTunes\n\nAmazon: http://smarturl.it/AstleyGHAmazon\n\nFollow Rick Astley\n\nWebsite: http://www.rickastley.co.uk/\n\nTwitter: https://twitter.com/rickastley\n\nFacebook: https://www.facebook.com/RickAstley/\n\nInstagram:  https://www.instagram.com/officialric...\n\nLyrics\n\nWe're no strangers to love\n\nYou know the rules and so do I\n\nA full commitment's what I'm thinking of\n\nYou wouldn't get this from any other guy\n\nI just wanna tell you how I'm feeling\n\nGotta make you understand\n\nNever gonna give you up\n\nNever gonna let you down\n\nNever gonna run around and desert you\n\nNever gonna make you cry\n\nNever gonna say goodbye\n\nNever gonna tell a lie and hurt you\n\nWe've known each other for so long\n\nYour heart's been aching, but\n\nYou're too shy to say it\n\nInside, we both know what's been going on\n\nWe know the game and we're gonna play it\n\nAnd if you ask me how I'm feeling\n\nDon't tell me you're too blind to see\n\nNever gonna give you up\n\nNever gonna let you down\n\nNever gonna run around and desert you\n\nNever gonna make you cry\n\nNever gonna say goodbye\n\nNever gonna tell a lie and hurt you\n\nNever gonna give you up\n\nNever gonna let you down\n\nNever gonna run around and desert you\n\nNever gonna make you cry\n\nNever gonna say goodbye\n\nNever gonna tell a lie and hurt you\n\n(Ooh, give you up)\n\n(Ooh, give you up)\n\nNever gonna give, never gonna give\n\n(Give you up)\n\nNever gonna give, never gonna give\n\n(Give you up)\n\nWe've known each other for so long\n\nYour heart's been aching, but\n\nYou're too shy to say it\n\nInside, we both know what's been going on\n\nWe know the game and we're gonna play it\n\nI just wanna tell you how I'm feeling\n\nGotta make you understand\n\nNever gonna give you up\n\nNever gonna let you down\n\nNever gonna run around and desert you\n\nNever gonna make you cry\n\nNever gonna say goodbye\n\nNever gonna tell a lie and hurt you\n\nNever gonna give you up\n\nNever gonna let you down\n\nNever gonna run around and desert you\n\nNever gonna make you cry\n\nNever gonna say goodbye\n\nNever gonna tell a lie and hurt you\n\nNever gonna give you up\n\nNever gonna let you down\n\nNever gonna run around and desert you\n\nNever gonna make you cry\n\nNever gonna say goodbye\n\nNever gonna tell a lie and hurt you\""
}
```