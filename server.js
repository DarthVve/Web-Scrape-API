const http = require('http');
const cheerio = require('cheerio');
const axios = require('axios')


const server = http.createServer((req, res) => {
    if (req.url === '/web-scrape' && req.method === 'GET') {
        async function scrape() {
            try {
                const url = "https://www.freecodecamp.org/news/implementing-a-linked-list-in-javascript/"
                const response = await axios.get(url);
                const $ = cheerio.load(response.data);
                const title = $('title').text();
                const desc = $('meta[name="description"]').attr('content');
                const imgUrls = [];
                $('img').each((i, image) => {
                    let imageUrl = $(image).attr('src');
                    imgUrls.push(imageUrl)
                })

                const data = {
                    Title: title,
                    Description: desc,
                    ImageUrls: imgUrls
                };

                res.writeHead(200, { 'Content-Type': 'text/HTML' })
                .end(JSON.stringify(data, null, 1));
            } catch (err) { console.error(err) };
        }   
        scrape();
    } else {
        res.writeHead(404, { 'Content-Type': 'text/HTML' })
            .end(JSON.stringify({ alert: "Route Unavailable" }));
    }
});

const PORT = process.env.PORT || 4501;

server.listen(PORT, () => console.log(`Server Running on Port ${PORT}`));

